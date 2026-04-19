---
layout: post
title: "形式逻辑"
date: 2026-04-19 17:22:00 +0800
mathjax: true
---

## 前言

大家可能见过这个式子：
$$ p\rightarrow q\rightarrow r $$

这个就是形式逻辑里的命题。

这是某个高中的教辅里的目录，可以看到有“充分条件”和“必要条件”，以及全称量词与存在量词。

![](/assets/imgs/文档_2026-04-19_172525.jpg)。
充分条件，例如$p\rightarrow q$,p就是q的充分条件。q是p的必要条件

我们有一些等价关系：
原命题等价于逆否命题:

$$
(p \rightarrow q)\leftrightarrow (\neg q \rightarrow \neg p)
$$

注意这里并不是公理。

我们学过“证明”，有条件和结论，如“如果a^2=b^2, 则a^4=b^4”
可以表述为$$ \forall a\in \mathbb R\forall b\in \mathbb R(a^2=b^2\rightarrow a^4=b^4) $$

同样的还有逆命题: $a\rightarrow b$的逆命题是$b\rightarrow a$。
$a$的否命题是$\neg a$。
原命题的否命题等价于逆命题$\neg (a\rightarrow b)\leftrightarrow (b\rightarrow a)$。

## 9个公理

形式逻辑里有命题逻辑和一阶逻辑。
命题逻辑的4个公理:

$$\text{[mp]}(p\rightarrow q), p \vdash q$$

这里的$a, b, c\vdash d$类似于$a\rightarrow(b\rightarrow(c\rightarrow d))$。

$$\text{[a1]}\vdash p\rightarrow(q\rightarrow p)$$

$$\text{[a2]}\vdash (p\rightarrow(q\rightarrow r))\rightarrow((p\rightarrow q)\rightarrow(p\rightarrow r))$$

$$\text{[a3]}\vdash (\neg p\rightarrow\neg q)\rightarrow(q\rightarrow r)$$

此外还有一阶逻辑的5个公理
$$\text{[a4]}(\forall\$0(p))\rightarrow(p^{\$0\rightarrow\$2}) $$

$x代表任意一个变量，p<sup>&#x24;0→&#x24;2</sup>表示将p中的$0替换成$2。

$$\text{[a5]}(\forall\$0(p\rightarrow q))\rightarrow(\forall\$0(p)\rightarrow\forall\$0(q))$$

$$\text{[a6]}(p_{\$0}\rightarrow(\forall\$0(p_{\$0})))$$

p<sub>$0</sub>表示p中不包含自由出现的$0

$$\text{[a7]}\$0=\$0$$

$$\text{[a8]}(\$0=\$1)\rightarrow(p\rightarrow p^{\$0\rightarrow\$1, \text{any times}})$$

存在等价于（否 对于所有x 否 xxxx）即$$\exists\$0(p)\leftrightarrow\neg\forall\$0(\neg p)$$。
