#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

// 教程分类映射
const categoryMapping = {
  '调qing一点通 – 晚熟青年': '职业发展',
  '法律相关电子书': '职业发展',
  '全国独家研学手册': '新手入门',
  '冷眼观爱 七天找到女朋友': '职业发展',
  '生财宝典（100位生财高手的判断路径和经验）': '商业增长',
  '怎样打开自学之门': '新手入门',
  '完全图解恋爱心理学': '职业发展',
  '如何让你爱的人爱上你': '职业发展',
  '欧阳春晓：6周维密薄肌线条弹力带普拉提': '职业发展',
  '如何利用下班时间写作': '职业发展',
  '步某非烟第1-4季 合集': '职业发展',
  '大学同学提升幸福感实用教程': '职业发展'
};

// 转换工具到教程格式
function convertToTutorial(tool, id) {
  const { title, description } = tool;
  const category = categoryMapping[title] || '职业发展';

  // 生成slug
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);

  // 解析原始tags
  const originalTags = tool.original_content.match(/tags: \[(.*?)\]/)?.[1] || '';
  const tags = originalTags.split(',').map(tag =>
    tag.trim().replace(/'/g, '').replace(/"/g, '')
  ).filter(t => t);

  // 生成教程内容
  const content = generateTutorialContent(title, description);

  return `  {
    id: '${id}',
    title: '${title}',
    description: '${description.replace(/是一款.*软件，为用户提供高效便捷的服务体验。/, '详细教程，帮助用户深入了解和掌握相关知识')}',
    content: \`${content}\`,
    category: '${category}',
    tags: [${tags.map(t => `'${t}'`).join(', ')}],
    author: 'AI工具导航站',
    publishedAt: '${new Date().toISOString().split('T')[0]}',
    readTime: ${Math.floor(Math.random() * 10 + 5)},
    difficulty: 'beginner',
    featured: false,
    slug: '${slug}'
  }`;
}

// 生成教程内容
function generateTutorialContent(title, description) {
  const templates = {
    '调qing一点通 – 晚熟青年': `# ${title}

## 课程简介

这是一套专为晚熟青年设计的成长指南，通过系统化的学习路径，帮助青年人找到自己的发展方向，提升个人能力和社交技巧。

## 学习目标

1. **认识自我**：深入了解自己的性格特点和优势
2. **职业规划**：制定清晰的职业发展路径
3. **社交技能**：提升人际交往和沟通能力
4. **情绪管理**：学会控制情绪，保持积极心态
5. **生活平衡**：在工作和生活间找到平衡点

## 课程大纲

### 第一章：自我认知与定位
- 性格测试与分析
- 发现个人优势
- 确定发展方向

### 第二章：职场必备技能
- 有效沟通技巧
- 时间管理方法
- 团队协作能力

### 第三章：人际关系处理
- 建立良好的人际网络
- 处理职场关系
- 维护长期友谊

### 第四章：个人成长规划
- 设定合理目标
- 制定行动计划
- 持续学习提升

## 学习建议

- 每天学习30分钟，循序渐进
- 做好学习笔记，定期复习
- 理论结合实践，学以致用
- 加入学习社群，互相交流

## 适用人群

- 刚步入职场的年轻人
- 希望提升自我的青年
- 寻求人生方向的迷茫者
- 想要改变现状的奋斗者`,

    '法律相关电子书': `# ${title}

## 资源简介

这是一套全面的法律知识学习资源，涵盖民事、刑事、经济法等多个法律领域，为读者提供系统的法律知识学习材料。

## 学习目标

1. **基础法律知识**：掌握常用法律概念和原则
2. **法律思维**：培养法律分析和推理能力
3. **实务应用**：了解法律在实际生活中的应用
4. **权益保护**：学会用法律保护自身权益
5. **职业发展**：为法律相关职业打下基础

## 资源内容

### 基础法学
- 法理学基础
- 宪法学概论
- 法制史研究

### 部门法学习
- 民法总则与分则
- 刑法理论与实务
- 行政法与行政诉讼法
- 经济法基础

### 实务指南
- 合同起草与审查
- 诉讼流程详解
- 法律文书写作
- 案例分析方法

### 专题研究
- 知识产权保护
- 劳动法律实务
- 公司法务管理
- 国际法基础

## 学习方法

1. 系统学习法律体系
2. 结合案例理解理论
3. 关注法律最新动态
4. 参与模拟法庭练习

## 适用人群

- 法律专业学生
- 企业法务人员
- 法律爱好者
- 需要法律知识的职场人士`,

    '全国独家研学手册': `# ${title}

## 手册简介

这是一套涵盖全国重要历史文化名城的研学旅行指南，包含北京、成都、敦煌、杭州、洛阳、济南、绍兴和西安等地的详细研学方案。

## 学习目标

1. **历史文化认知**：深入了解中国历史文化
2. **实地考察能力**：培养观察和记录能力
3. **跨学科学习**：整合多学科知识
4. **团队协作**：提升团队合作精神
5. **综合素养**：全面提升人文素养

## 研学内容

### 北京篇
- 故宫博物院深度游学
- 长城历史与建筑研究
- 北京大学参观交流
- 科技馆探索学习

### 西安篇
- 兵马俑考古发现
- 大雁塔历史文化
- 古城墙建筑研究
- 陕西历史博物馆

### 成都篇
- 三星堆文明探索
- 都江堰水利工程
- 武侯祠三国文化
- 熊猫基地生态研究

### 敦煌篇
- 莫高窟艺术鉴赏
- 丝绸之路历史
- 沙漠地理考察
- 敦煌文化传承

## 研学准备

1. 行前知识储备
2. 研学工具准备
3. 安全注意事项
4. 研学日志记录

## 适用人群

- 中小学生研学团队
- 家庭亲子研学
- 大学生实践活动
- 教育工作者`,

    '生财宝典（100位生财高手的判断路径和经验）': `# ${title}

## 课程简介

汇集100位成功创业者和投资人的实战经验，深度剖析他们的商业思维、决策逻辑和成功路径，为创业者提供宝贵的经验借鉴。

## 学习目标

1. **商业思维培养**：建立系统的商业分析框架
2. **机会识别能力**：学会发现和评估商业机会
3. **风险管理**：掌握风险识别和控制方法
4. **资源整合**：提升资源获取和配置能力
5. **持续成长**：建立终身学习的习惯

## 核心内容

### 第一部分：创业思维
- 如何发现市场需求
- 验证商业模式的方法
- 最小可行产品策略
- 快速迭代的重要性

### 第二部分：投资逻辑
- 价值投资的基本原则
- 如何评估项目潜力
- 投资时机的把握
- 风险与收益的平衡

### 第三部分：营销增长
- 用户增长策略
- 私域流量运营
- 内容营销技巧
- 社群运营方法

### 第四部分：团队管理
- 高效团队的构建
- 人才激励机制
- 企业文化建设
- 领导力提升

### 第五部分：案例分析
- 成功案例深度解析
- 失败案例经验总结
- 行业趋势洞察
- 未来机会预测

## 学习路径

1. 每日阅读一个案例
2. 提炼关键决策点
3. 对比自身情况思考
4. 制定个人行动计划
5. 实践验证并复盘

## 适用人群

- 创业者和准创业者
- 中小企业经营者
- 投资理财爱好者
- 职场进阶人士`,

    '怎样打开自学之门': `# ${title}

## 课程简介

这是一本经典的自学方法论指南，帮助学习者掌握高效的自学技巧，培养终身学习能力，实现知识和技能的自主提升。

## 学习目标

1. **学习方法掌握**：系统掌握各种自学技巧
2. **学习习惯养成**：建立良好的学习习惯
3. **知识管理**：构建个人知识体系
4. **效率提升**：提高学习效率和质量
5. **持续进步**：保持终身学习的动力

## 课程内容

### 第一章：自学的基础
- 认识自学的价值
- 克服学习障碍
- 制定学习计划
- 营造学习环境

### 第二章：高效学习法
- 快速阅读技巧
- 笔记整理方法
- 记忆技巧训练
- 思维导图应用

### 第三章：学习资源获取
- 网络资源利用
- 图书馆资源查找
- 在线课程选择
- 学习社群参与

### 第四章：知识内化与应用
- 知识整理框架
- 实践应用方法
- 输出倒逼输入
- 教学相长原理

### 第五章：学习进阶策略
- 跨学科学习
- 深度学习方法
- 批判性思维
- 创新能力培养

## 实践建议

1. 选择感兴趣的领域开始
2. 制定可执行的学习计划
3. 建立学习反馈机制
4. 定期总结和调整方法
5. 与他人分享学习成果

## 适用人群

- 在校学生
- 职场人士
- 转行学习者
- 终身学习践行者`
  };

  // 使用默认模板
  const defaultTemplate = `# ${title}

## 课程简介

${description}

本教程将帮助您系统地学习和掌握相关知识，通过理论讲解和实践指导，让您能够快速入门并熟练运用。

## 学习目标

通过本教程的学习，您将能够：
1. 掌握基础概念和原理
2. 了解实际应用场景
3. 学会解决常见问题
4. 提升相关技能水平
5. 为进阶学习打下基础

## 课程大纲

### 第一部分：基础知识
- 核心概念介绍
- 基本原理讲解
- 常用术语解释

### 第二部分：实践应用
- 实际案例分析
- 操作步骤详解
- 注意事项说明

### 第三部分：进阶提升
- 高级技巧分享
- 优化方法介绍
- 最佳实践总结

### 第四部分：资源推荐
- 推荐学习资料
- 相关工具介绍
- 社群交流平台

## 学习方法

1. 循序渐进，从基础开始
2. 理论结合实践
3. 多做练习，巩固知识
4. 积极思考，举一反三
5. 参与讨论，互相学习

## 适用人群

- 初学者和入门者
- 希望系统学习的人士
- 需要提升技能的从业者
- 对该领域感兴趣的爱好者

## 总结

持续学习是成功的关键。希望通过本教程，您能够掌握所需的知识和技能，在学习和工作中取得更好的成果。`;

  return templates[title] || defaultTemplate;
}

async function main() {
  try {
    console.log('🚀 开始转换内容为教程格式...\n');

    // 读取移除的工具数据
    const removedToolsPath = path.join(__dirname, '..', 'removed-tools-detailed.json');
    const removedTools = JSON.parse(await fs.readFile(removedToolsPath, 'utf8'));

    // 去重（因为有重复的"调qing一点通 – 晚熟青年"）
    const uniqueTools = [];
    const seenTitles = new Set();

    for (const tool of removedTools) {
      if (!seenTitles.has(tool.title)) {
        uniqueTools.push(tool);
        seenTitles.add(tool.title);
      }
    }

    console.log(`📋 找到 ${uniqueTools.length} 个需要转换的内容\n`);

    // 生成教程对象
    const tutorials = [];
    let startId = 36; // 从ID 36开始

    for (const tool of uniqueTools) {
      const tutorial = convertToTutorial(tool, startId);
      tutorials.push(tutorial);
      console.log(`✅ 转换: ${tool.title} -> ID: ${startId}`);
      startId++;
    }

    // 读取现有的tutorials.ts文件
    const tutorialsPath = path.join(__dirname, '..', 'src', 'data', 'tutorials.ts');
    const tutorialsContent = await fs.readFile(tutorialsPath, 'utf8');

    // 找到数组的结束位置
    const arrayEndIndex = tutorialsContent.lastIndexOf('];');

    if (arrayEndIndex === -1) {
      throw new Error('无法找到tutorials数组的结束位置');
    }

    // 在数组末尾添加新的教程
    const beforeEnd = tutorialsContent.substring(0, arrayEndIndex);
    const afterEnd = tutorialsContent.substring(arrayEndIndex);

    // 检查是否需要添加逗号
    const needsComma = beforeEnd.trim().endsWith('}');
    const separator = needsComma ? ',\n' : '';

    // 组合新内容
    const newContent = beforeEnd + separator + tutorials.join(',\n') + '\n' + afterEnd;

    // 备份并保存
    const backupPath = `${tutorialsPath}.backup-${Date.now()}`;
    await fs.writeFile(backupPath, tutorialsContent);
    console.log(`\n📦 备份创建: ${backupPath}`);

    await fs.writeFile(tutorialsPath, newContent);
    console.log(`✅ 成功添加 ${tutorials.length} 个教程到 tutorials.ts`);

    // 保存转换记录
    const conversionLog = {
      timestamp: new Date().toISOString(),
      converted: uniqueTools.length,
      startId: 36,
      endId: startId - 1,
      titles: uniqueTools.map(t => t.title)
    };

    await fs.writeFile(
      path.join(__dirname, '..', 'conversion-log.json'),
      JSON.stringify(conversionLog, null, 2)
    );

    console.log('\n✨ 转换完成！');
    console.log('\n📝 下一步：');
    console.log('1. 运行 npm run dev 测试');
    console.log('2. 检查教程页面显示是否正常');
    console.log('3. 根据需要优化教程内容');

  } catch (error) {
    console.error('❌ 错误:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();