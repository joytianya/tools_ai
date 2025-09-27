#!/usr/bin/env python3

import re
import json
import shutil
from datetime import datetime
from pathlib import Path

# 需要从工具类移除的内容标题列表
TITLES_TO_REMOVE = [
    '调qing一点通 – 晚熟青年',
    '法律相关电子书',
    '全国独家研学手册',
    '冷眼观爱 七天找到女朋友',
    '生财宝典（100位生财高手的判断路径和经验）',
    '怎样打开自学之门',
    '完全图解恋爱心理学',
    '如何让你爱的人爱上你',
    '欧阳春晓：6周维密薄肌线条弹力带普拉提',
    '如何利用下班时间写作',
    '步某非烟第1-4季 合集',
    '大学同学提升幸福感实用教程'
]

def backup_file(file_path):
    """备份文件"""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_path = f"{file_path}.backup_{timestamp}"
    shutil.copy2(file_path, backup_path)
    print(f"✅ 备份创建成功: {backup_path}")
    return backup_path

def extract_tool_objects(content):
    """提取所有工具对象"""
    tools = []

    # 找到 tools 数组的开始和结束
    match = re.search(r'export const tools:\s*Tool\[\]\s*=\s*\[(.*?)\];', content, re.DOTALL)
    if not match:
        raise ValueError("无法找到 tools 数组")

    tools_content = match.group(1)

    # 使用更智能的方式解析对象
    current_obj = []
    brace_count = 0
    in_string = False
    string_char = None
    in_template = False

    for i, char in enumerate(tools_content):
        # 处理字符串
        if not in_string and not in_template and char in ["'", '"']:
            in_string = True
            string_char = char
        elif in_string and char == string_char and tools_content[i-1] != '\\':
            in_string = False
            string_char = None

        # 处理模板字符串
        if not in_string and char == '`':
            in_template = not in_template

        # 只在非字符串中计算括号
        if not in_string and not in_template:
            if char == '{':
                if brace_count == 0:
                    current_obj = []
                brace_count += 1
            elif char == '}':
                brace_count -= 1

        current_obj.append(char)

        # 完成一个对象
        if brace_count == 0 and current_obj and current_obj[0] == '{':
            obj_str = ''.join(current_obj)
            # 提取标题
            title_match = re.search(r'title:\s*[\'"`]([^\'"`]+)[\'"`]', obj_str)
            if title_match:
                tools.append({
                    'title': title_match.group(1),
                    'content': obj_str.strip()
                })
            current_obj = []

    return tools

def filter_tools(tools, titles_to_remove):
    """分离要保留和要移除的工具"""
    tools_to_keep = []
    tools_to_remove = []

    for tool in tools:
        if tool['title'] in titles_to_remove:
            tools_to_remove.append(tool)
            print(f"  ✂️ 移除: {tool['title']}")
        else:
            tools_to_keep.append(tool)

    return tools_to_keep, tools_to_remove

def rebuild_tools_file(original_content, tools_to_keep):
    """重建 tools.ts 文件"""
    # 重建工具数组内容
    tools_content = ',\n  '.join([tool['content'] for tool in tools_to_keep])

    # 替换原有的 tools 数组
    new_content = re.sub(
        r'export const tools:\s*Tool\[\]\s*=\s*\[(.*?)\];',
        f'export const tools: Tool[] = [\n  {tools_content}\n];',
        original_content,
        flags=re.DOTALL
    )

    return new_content

def save_removed_tools(tools_to_remove, output_path):
    """保存移除的工具"""
    # 转换为更易读的格式
    removed_data = []
    for tool in tools_to_remove:
        # 尝试提取更多信息
        description_match = re.search(r'description:\s*[\'"`]([^\'"`]+)[\'"`]', tool['content'])
        category_match = re.search(r'category:\s*[\'"`]([^\'"`]+)[\'"`]', tool['content'])

        removed_data.append({
            'title': tool['title'],
            'description': description_match.group(1) if description_match else '',
            'category': category_match.group(1) if category_match else '',
            'original_content': tool['content']
        })

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(removed_data, f, ensure_ascii=False, indent=2)

    print(f"✅ 已保存 {len(removed_data)} 个移除的工具到: {output_path}")

def main():
    """主函数"""
    print("🚀 开始批量调整内容分类...\n")

    # 设置路径
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    tools_file = project_root / 'src' / 'data' / 'tools.ts'

    if not tools_file.exists():
        print(f"❌ 错误: 找不到文件 {tools_file}")
        return

    try:
        # 1. 备份原文件
        print("📦 步骤 1: 备份原文件")
        backup_file(tools_file)

        # 2. 读取文件内容
        print("\n📖 步骤 2: 读取并解析文件")
        with open(tools_file, 'r', encoding='utf-8') as f:
            original_content = f.read()

        # 3. 提取所有工具对象
        print("\n🔍 步骤 3: 提取工具对象")
        all_tools = extract_tool_objects(original_content)
        print(f"  找到 {len(all_tools)} 个工具")

        # 4. 分离要保留和移除的工具
        print("\n✂️ 步骤 4: 识别要移除的内容")
        tools_to_keep, tools_to_remove = filter_tools(all_tools, TITLES_TO_REMOVE)

        # 5. 重建文件内容
        print("\n🔨 步骤 5: 重建文件内容")
        new_content = rebuild_tools_file(original_content, tools_to_keep)

        # 6. 保存修改后的文件
        print("\n💾 步骤 6: 保存修改")
        with open(tools_file, 'w', encoding='utf-8') as f:
            f.write(new_content)

        # 7. 保存移除的内容
        if tools_to_remove:
            removed_file = project_root / 'removed-tools-detailed.json'
            save_removed_tools(tools_to_remove, removed_file)

        # 统计信息
        print("\n✨ 分类调整完成！")
        print(f"📊 统计:")
        print(f"  - 原有工具: {len(all_tools)} 个")
        print(f"  - 移除工具: {len(tools_to_remove)} 个")
        print(f"  - 保留工具: {len(tools_to_keep)} 个")

        if len(tools_to_remove) < len(TITLES_TO_REMOVE):
            not_found = set(TITLES_TO_REMOVE) - set([t['title'] for t in tools_to_remove])
            print(f"\n⚠️  未找到以下标题:")
            for title in not_found:
                print(f"    - {title}")

        print("\n📝 下一步建议：")
        print("1. 检查 removed-tools-detailed.json 文件")
        print("2. 将内容转换为教程格式")
        print("3. 添加到 tutorials.ts 文件")
        print("4. 运行 npm run dev 测试变更")

    except Exception as e:
        print(f"❌ 错误: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()