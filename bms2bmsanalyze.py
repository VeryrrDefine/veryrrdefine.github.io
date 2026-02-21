import re
from typing import List, Union

def toArrayMatrix(r: str) -> List[List[int]]:
    """
    将BMS字符串表示转换为二维整数矩阵。
    支持带括号的格式（如 "(1,2)(3,4)"）和不带括号的字母格式（如 "ab cd"）。
    """
    r = r.strip()
    if not r:
        return []
    # 判断是否包含括号
    has_paren = '(' in r and ')' in r
    if has_paren:
        t = toArrayMatrix2(r)
    else:
        t = toArray3(r)
    
    # 计算每行最后一个非零元素的索引（从右向左找第一个非零，索引从0开始）
    lengths = []
    for row in t:
        last = -1
        for i in range(len(row) - 1, -1, -1):
            if row[i] != 0:
                last = i
                break
        lengths.append(last + 1)  # 非零个数（如果全零则为0）
    
    max_len = max(lengths) if lengths else 0
    max_len = max(max_len, 1)  # 至少为1
    
    # 裁剪或填充每行到相同长度
    result = []
    for row in t:
        new_row = row[:max_len]
        if len(new_row) < max_len:
            new_row.extend([0] * (max_len - len(new_row)))
        result.append(new_row)
    return result


def toArrayMatrix2(r: str) -> List[List[int]]:
    """
    解析带括号的BMS格式，如 "(1,2)(3,4)" 或 "(1^2,3)"。
    返回二维整数列表。
    """
    # 移除逗号和括号周围的空格
    r = re.sub(r'\s*,\s*', ',', r)
    r = re.sub(r'\s*\)\s*', ')', r)
    r = re.sub(r'\s*\(\s*', '(', r)
    
    result = []
    current = ""
    depth = 0
    for ch in r:
        if ch == '(':
            depth += 1
            if depth == 1:
                current = ""
        elif ch == ')':
            depth -= 1
            if depth == 0 and current is not None:
                # 处理括号内的内容
                nums = getRepeat(current)
                result.append(nums)
        else:
            if depth > 0:
                current += ch
    return result if result else [[0]]


def getRepeat(r: str) -> List[int]:
    """
    解析括号内的逗号分隔值，支持 "^" 表示重复，如 "2^3" 表示 [2,2,2]。
    """
    r = r.strip()
    if not r:
        return [0]
    parts = r.split(',')
    result = []
    for p in parts:
        if '^' in p:
            base, repeat = p.split('^')
            base_val = int(base.strip()) if base.strip() else 0
            repeat_val = int(repeat.strip()) if repeat.strip() else 0
            result.extend([base_val] * repeat_val)
        else:
            trimmed = p.strip()
            if trimmed:
                val = int(trimmed) if trimmed else 0
                result.append(val)
    return result if result else [0]


def toArray3(r: str) -> List[List[int]]:
    """
    解析不带括号的字母格式，如 "ab cd" 或 "a,b c"。
    每个字母转换为数字（a=10, b=11, ...），空格或逗号分隔行。
    """
    # 按空白或逗号分割
    tokens = re.split(r'[,\s]+', r)
    tokens = [t for t in tokens if t]  # 过滤空字符串
    result = []
    for token in tokens:
        row = []
        if ',' in token:
            # 如果 token 本身包含逗号，则按逗号分割
            subparts = token.split(',')
            for sub in subparts:
                sub = sub.strip()
                if sub:
                    # 每个子部分可能是单个字母或多个字母？按原逻辑，这里每个子部分作为一个整体转换？
                    # 但原代码中，如果包含逗号，则分割后对每个子部分调用 letterToNumber，而 letterToNumber 只处理单个字母，
                    # 所以这里假设每个子部分是单个字母。如果有多个字母，则会被当作一个整体转换，可能导致错误。
                    # 为保持原意，我们直接对每个子部分调用 letterToNumber。
                    row.append(letterToNumber(sub))
        else:
            # 否则，遍历 token 的每个字符
            for ch in token:
                row.append(letterToNumber(ch))
        if not row:
            row.append(0)
        result.append(row)
    return result if result else [[0]]


def letterToNumber(r: str) -> int:
    """
    将单个字母转换为数字（36进制），如 'a' -> 10, 'b' -> 11。
    非字母或数字字符返回 0。
    """
    try:
        # 转为小写，然后按36进制解析
        return int(r.lower(), 36)
    except ValueError:
        return 0


def toBMSMatrix(r: List[List[int]]) -> str:
    """
    将二维整数矩阵转换为BMS字符串格式。
    例如：[[1,2],[3,4]] -> "(1,2)(3,4)"
    """
    return ''.join(f"({','.join(map(str, row))})" for row in r)


def toLatexMatrix(r: List[List[int]]) -> str:
    """
    将二维整数矩阵转换为LaTeX矩阵格式（按列输出）。
    例如：[[1,2],[3,4]] -> \begin{pmatrix}1 & 3 \\ 2 & 4\end{pmatrix}
    """
    if not r or not any(row for row in r):
        return "\\begin{pmatrix}\\end{pmatrix}"
    # 转置矩阵，使每行对应原矩阵的一列
    cols = list(zip(*r))
    lines = []
    for col in cols:
        lines.append(" & ".join(map(str, col)))
    body = " \\\\ ".join(lines)
    return f"\\begin{{{body}}}\\end{{pmatrix}}"