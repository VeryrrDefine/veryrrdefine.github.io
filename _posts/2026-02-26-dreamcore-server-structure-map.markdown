---
layout: post
title: "Dreamcore Server Structure Map"
date: 2026-02-26 20:46:45 +0800
mathjax: true
mermaid: true
---

<div class="mermaid">
flowchart LR

A[出生点] --> 1[泳池1]
1-->1_1[有墙壁的走廊]-->1_2[10几个假按钮的地方]--上楼-->9inf[图书馆]

9inf-->2[泳池2]

2--马拉松黑色房间-->6[神似Level6的地方]
2--上楼在某个角落附近的断层楼梯-->1
6--找神秘光源-->2
6--找问号-->redbrick[红砖迷宫]
2--马拉松白色房间-->road3[草原有道路，结尾有房子的那种]
2--开头右转左边可以<br/>看到的草方块那边-->road3
road3-->upstairsinfinite[上楼梯，旁边有浮起来的泳池方块]
upstairsinfinite-->9inf
2--巨大黑洞-->level9like[神似Level9的地方]-->darkhall[神秘暗走廊]
2-->parkour[跑酷圣地]
parkour-->2
darkhall-->2
2-->fastslider[滑滑梯]
fastslider-->2

</div>
