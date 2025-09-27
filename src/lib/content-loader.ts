import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'src/content/tutorials');

/**
 * 动态加载教程内容
 * @param slug 教程的slug
 * @returns 教程内容字符串，如果文件不存在返回null
 */
export async function loadTutorialContent(slug: string): Promise<string | null> {
  try {
    const filePath = path.join(CONTENT_DIR, `${slug}.md`);

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      console.log(`Content file not found for slug: ${slug}`);
      return null;
    }

    // 读取文件内容
    const content = fs.readFileSync(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error(`Error loading content for slug ${slug}:`, error);
    return null;
  }
}

/**
 * 获取所有可用的内容文件列表
 * @returns 可用内容文件的slug数组
 */
export function getAvailableContentFiles(): string[] {
  try {
    if (!fs.existsSync(CONTENT_DIR)) {
      return [];
    }

    const files = fs.readdirSync(CONTENT_DIR);
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace('.md', ''));
  } catch (error) {
    console.error('Error reading content directory:', error);
    return [];
  }
}

/**
 * 检查特定slug是否有对应的内容文件
 * @param slug 教程的slug
 * @returns 是否存在对应的内容文件
 */
export function hasContentFile(slug: string): boolean {
  try {
    const filePath = path.join(CONTENT_DIR, `${slug}.md`);
    return fs.existsSync(filePath);
  } catch (error) {
    console.error(`Error checking content file for slug ${slug}:`, error);
    return false;
  }
}

/**
 * 为没有内容的教程创建模板文件
 * @param slug 教程的slug
 * @param title 教程标题
 * @param description 教程描述
 * @returns 是否成功创建
 */
export function createContentTemplate(slug: string, title: string, description: string): boolean {
  try {
    const filePath = path.join(CONTENT_DIR, `${slug}.md`);

    // 如果文件已存在，不覆盖
    if (fs.existsSync(filePath)) {
      console.log(`Content file already exists for slug: ${slug}`);
      return false;
    }

    // 创建目录（如果不存在）
    if (!fs.existsSync(CONTENT_DIR)) {
      fs.mkdirSync(CONTENT_DIR, { recursive: true });
    }

    // 生成模板内容
    const template = `# ${title}

## 简介

${description}

## 主要内容

### 基础概念

<!-- 在这里添加基础概念的介绍 -->

### 实践步骤

<!-- 在这里添加详细的操作步骤 -->

### 进阶技巧

<!-- 在这里添加高级用法和技巧 -->

### 常见问题

<!-- 在这里添加常见问题和解决方案 -->

## 总结

<!-- 在这里添加总结内容 -->

---

*本教程由 MatrixTools 制作，更多实用工具教程请访问 [MatrixTools.me](https://matrixtools.me)*
`;

    fs.writeFileSync(filePath, template, 'utf-8');
    console.log(`Created content template for slug: ${slug}`);
    return true;
  } catch (error) {
    console.error(`Error creating content template for slug ${slug}:`, error);
    return false;
  }
}