// Memory Usage and Leak Detection Tests
const puppeteer = require('puppeteer');
const { performance } = require('perf_hooks');
const config = require('../performance/performance.config');

describe('Memory Performance Tests', () => {
  let browser, page;
  const memorySnapshots = [];

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: process.env.CI ? 'new' : false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--js-flags=--expose-gc', // Enable garbage collection
      ],
    });
  });

  afterAll(async () => {
    await generateMemoryReport(memorySnapshots);
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    
    // Enable memory monitoring
    await page.evaluateOnNewDocument(() => {
      window.memorySnapshots = [];
      window.takeMemorySnapshot = () => {
        if (performance.memory) {
          const snapshot = {
            timestamp: Date.now(),
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
          };
          window.memorySnapshots.push(snapshot);
          return snapshot;
        }
        return null;
      };
    });
  });

  afterEach(async () => {
    await page.close();
  });

  describe('Memory Usage Baseline', () => {
    test('Homepage memory usage', async () => {
      await page.goto(`${config.environment.baseUrl}/`);
      await page.waitForLoadState('networkidle');
      
      const initialMemory = await getMemoryUsage(page);
      memorySnapshots.push({
        test: 'homepage-initial',
        ...initialMemory,
      });
      
      // Simulate user interactions
      await simulateUserActivity(page);
      
      const afterInteractionMemory = await getMemoryUsage(page);
      memorySnapshots.push({
        test: 'homepage-after-interaction',
        ...afterInteractionMemory,
      });
      
      // Check memory usage is within limits
      expect(initialMemory.usedJSHeapSize).toBeLessThan(config.thresholds.memory.heapUsed);
      expect(afterInteractionMemory.usedJSHeapSize).toBeLessThan(config.thresholds.memory.heapUsed * 1.5);
    });

    test('Tools page memory usage', async () => {
      await page.goto(`${config.environment.baseUrl}/tools`);
      await page.waitForLoadState('networkidle');
      
      const initialMemory = await getMemoryUsage(page);
      memorySnapshots.push({
        test: 'tools-initial',
        ...initialMemory,
      });
      
      // Scroll through tools (lazy loading test)
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await page.waitForTimeout(1000);
      
      const afterScrollMemory = await getMemoryUsage(page);
      memorySnapshots.push({
        test: 'tools-after-scroll',
        ...afterScrollMemory,
      });
      
      expect(initialMemory.usedJSHeapSize).toBeLessThan(config.thresholds.memory.heapUsed);
      expect(afterScrollMemory.usedJSHeapSize).toBeLessThan(config.thresholds.memory.heapUsed * 2);
    });
  });

  describe('Memory Leak Detection', () => {
    test('Navigation memory leak test', async () => {
      const initialMemory = await getMemoryUsage(page);
      
      // Navigate through multiple pages multiple times
      const pages = ['/', '/tools', '/tutorials', '/search'];
      const cycles = 5;
      
      for (let cycle = 0; cycle < cycles; cycle++) {
        for (const pagePath of pages) {
          await page.goto(`${config.environment.baseUrl}${pagePath}`);
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(500);
        }
        
        // Force garbage collection
        await page.evaluate(() => {
          if (window.gc) {
            window.gc();
          }
        });
        
        const cycleMemory = await getMemoryUsage(page);
        memorySnapshots.push({
          test: `navigation-leak-cycle-${cycle + 1}`,
          ...cycleMemory,
        });
      }
      
      const finalMemory = await getMemoryUsage(page);
      
      // Memory should not increase significantly after multiple navigations
      const memoryIncrease = finalMemory.usedJSHeapSize - initialMemory.usedJSHeapSize;
      const memoryIncreasePercentage = (memoryIncrease / initialMemory.usedJSHeapSize) * 100;
      
      expect(memoryIncreasePercentage).toBeLessThan(50); // Less than 50% increase
    });

    test('Event listener memory leak test', async () => {
      await page.goto(`${config.environment.baseUrl}/search`);
      
      const initialMemory = await getMemoryUsage(page);
      
      // Simulate rapid search interactions
      for (let i = 0; i < 50; i++) {
        await page.type('[data-testid="search-input"]', 'test query ' + i);
        await page.waitForTimeout(100);
        await page.keyboard.selectAll();
        await page.keyboard.press('Backspace');
      }
      
      // Force garbage collection
      await page.evaluate(() => {
        if (window.gc) {
          window.gc();
        }
      });
      
      const finalMemory = await getMemoryUsage(page);
      memorySnapshots.push({
        test: 'event-listener-leak-test',
        initial: initialMemory,
        final: finalMemory,
      });
      
      const memoryIncrease = finalMemory.usedJSHeapSize - initialMemory.usedJSHeapSize;
      expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024); // Less than 5MB increase
    });

    test('Image loading memory test', async () => {
      await page.goto(`${config.environment.baseUrl}/tools`);
      
      const initialMemory = await getMemoryUsage(page);
      
      // Scroll to load all images
      await page.evaluate(async () => {
        const scrollHeight = document.body.scrollHeight;
        const viewportHeight = window.innerHeight;
        const scrollSteps = Math.ceil(scrollHeight / viewportHeight);
        
        for (let i = 0; i < scrollSteps; i++) {
          window.scrollTo(0, i * viewportHeight);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      });
      
      await page.waitForTimeout(2000); // Wait for all images to load
      
      const afterImagesMemory = await getMemoryUsage(page);
      memorySnapshots.push({
        test: 'image-loading-memory',
        initial: initialMemory,
        afterImages: afterImagesMemory,
      });
      
      // Check that image loading doesn't cause excessive memory usage
      const memoryIncrease = afterImagesMemory.usedJSHeapSize - initialMemory.usedJSHeapSize;
      expect(memoryIncrease).toBeLessThan(20 * 1024 * 1024); // Less than 20MB for images
    });
  });

  describe('Garbage Collection Efficiency', () => {
    test('Manual garbage collection test', async () => {
      await page.goto(`${config.environment.baseUrl}/`);
      
      const beforeGC = await getMemoryUsage(page);
      
      // Create some temporary objects
      await page.evaluate(() => {
        const tempData = [];
        for (let i = 0; i < 10000; i++) {
          tempData.push({ id: i, data: new Array(100).fill('test data') });
        }
        // Clear references
        tempData.length = 0;
      });
      
      const beforeManualGC = await getMemoryUsage(page);
      
      // Force garbage collection
      await page.evaluate(() => {
        if (window.gc) {
          window.gc();
        }
      });
      
      await page.waitForTimeout(1000);
      const afterGC = await getMemoryUsage(page);
      
      memorySnapshots.push({
        test: 'garbage-collection-efficiency',
        beforeGC,
        beforeManualGC,
        afterGC,
      });
      
      // Memory should decrease after garbage collection
      expect(afterGC.usedJSHeapSize).toBeLessThan(beforeManualGC.usedJSHeapSize);
    });
  });
});

// Helper functions
async function getMemoryUsage(page) {
  return await page.evaluate(() => {
    if (performance.memory) {
      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
        timestamp: Date.now(),
      };
    }
    return {
      usedJSHeapSize: 0,
      totalJSHeapSize: 0,
      jsHeapSizeLimit: 0,
      timestamp: Date.now(),
    };
  });
}

async function simulateUserActivity(page) {
  // Simulate typical user interactions
  await page.hover('[data-testid="tool-card"]:first-child');
  await page.click('[data-testid="search-input"]');
  await page.type('[data-testid="search-input"]', 'test query');
  await page.keyboard.press('Escape');
  
  // Scroll activity
  await page.evaluate(() => {
    window.scrollTo(0, 300);
  });
  await page.waitForTimeout(500);
  
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
}

async function generateMemoryReport(snapshots) {
  const fs = require('fs').promises;
  const path = require('path');
  
  const reportPath = path.join(__dirname, '../../test-results/memory-report.json');
  
  const report = {
    timestamp: new Date().toISOString(),
    snapshots,
    analysis: analyzeMemoryUsage(snapshots),
  };
  
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log('Memory report generated:', reportPath);
}

function analyzeMemoryUsage(snapshots) {
  const analysis = {
    peakMemoryUsage: 0,
    averageMemoryUsage: 0,
    memoryLeakDetected: false,
    recommendations: [],
  };
  
  const usageValues = snapshots
    .filter(s => typeof s.usedJSHeapSize === 'number')
    .map(s => s.usedJSHeapSize);
  
  if (usageValues.length > 0) {
    analysis.peakMemoryUsage = Math.max(...usageValues);
    analysis.averageMemoryUsage = usageValues.reduce((a, b) => a + b, 0) / usageValues.length;
    
    // Simple leak detection - check for consistent upward trend
    if (usageValues.length >= 3) {
      const trend = usageValues.slice(-3).every((val, index, arr) => 
        index === 0 || val > arr[index - 1]
      );
      analysis.memoryLeakDetected = trend && 
        usageValues[usageValues.length - 1] > usageValues[0] * 1.5;
    }
  }
  
  // Generate recommendations
  if (analysis.peakMemoryUsage > 50 * 1024 * 1024) {
    analysis.recommendations.push('Consider optimizing memory usage - peak usage exceeds 50MB');
  }
  
  if (analysis.memoryLeakDetected) {
    analysis.recommendations.push('Potential memory leak detected - investigate event listeners and object references');
  }
  
  return analysis;
}