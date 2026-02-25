---
layout: post
title: "大数库"
date: 2026-02-25 11:45:14 +0800
categories: googology
mathjax: true
---

增量游戏圈是一个小众的圈子，因此大部分可获取到的js/ts代码都是开源的（RBNR, RI, C2S除外）。

第一个应用于增量圈的大数库是Patashu的`break_infinity.js`，于2017年11月8日11:51提交了第一个commit。

`break_infinity.js`大体结构由sign, mantissa和exponent组成，

对应的是$\mathrm{sign}\times \mathrm{mantissa}\times10^{\mathrm{exponent}}$,极限是$(10-2^{-49})\times10^{2^{1024}-2^{971}}\approx10^{1.79\times10^{308}}$

后来Patashu开发了`break_eternity.js`，于2019年5月14日13:54提交了第一个commit。

`break_eternity.js`大体结构由sign, layer和magnitude组成，layer表示指数塔的层数，magnitude表示指数塔的最顶端数字，极限是$10\uparrow\uparrow(2^{1024})$。

接下来是Naruyoko的`OmegaNum.js`, 于2019年5月27日提交了第一个commit。
使用了数组array，实现类似于$H_{\w^{a_1}b_1+\w^{a_2}b_2+\w^{a_3}b_3+\cdots}(10)$的结构。
而`ExpantaNum.js`(2020年2月7日)将序数的前面添加了$\w^\w\times\mathrm{layer}$。

以上这些大数库出现的时间比较早，大概是开发者需求不断变高。

然后是`PowiainiaNum.js`，2024年10月4日首次在原增量游戏讨论群里亮相。2024年10月5日提交了第一个commit。
和`OmegaNum.js`相似，实现类似于$H_{\w^{\alpha_1}b_1+\w^{\alpha_2}b_2+\w^{\alpha_3}b_3+\cdots}(10)$的结构。
将原先$\alpha_1$限定在$\omega$序数以下的结构扩展到了$\omega^3$以下的序数结构。

`PowiainaNum.js`由于是新生的，目前仍不完善。

2025年10月30日，我发现了大数库和序数库的规律，并推测可以实现一个增长率为$EBO$的大数库，取决于序数库的强度。

![聊天记录](/assets/imgs/image.png)

实际上，大数库最难做的是运算，**特别是逆运算**。

我认为大数库做的越多就越没有意义，~~因为实际上可以打表~~
