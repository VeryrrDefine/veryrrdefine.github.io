/**
 * @typedef {([]|ThirdTerm)} Term
 * @typedef {([Term, Term, Term])} ThirdTerm
 * @typedef {([number, number, number])} MatrixRow
 * @typedef {(MatrixRow[])} Matrix
 */

/**
 * @type {[]}
 */
const ZERO = [];
/**
 * @type {[[],[],[]]}
 */
const ONE = [[], [], []];
/**
 * @type {[[],[[],[],[]],[]]}
 */
const OMEGA = [[], ONE, []];
/**
 * @type {[[[],[],[]],[],[]]}
 */
const OMEGA1 = [ONE, [], []];
/**
 * @type {[[],[[[],[],[]],[],[]],[]]}
 */
const EPSILON0 = [[], OMEGA1, []];

/**
 * 判断一个序数是否为0
 * @param {Term|number} a
 * @returns {a is []}
 */
function isZero(a) {
  return a.length == 0;
}

/**
 * 判断一个序数是否有限
 * @param {Term} a
 */
function isOrdinalFinite(a) {
  return isZero(a) || (isZero(a[0]) && isZero(a[1]));
}

/**
 * 求一个序数由多少个单项相加而成
 * @param {Term} a
 * @returns {number} 单项数
 */
function length1(a) {
  return isZero(a) ? 0 : 1 + length1(a[2]);
}

/**
 * 判断两个序数是否全等
 * 甚至也可以判断两个矩阵列是否全等
 * @param {Term| number} a
 * @param {Term| number} b
 * @returns {boolean} 是否全等
 */
function eq(a, b) {
  if (typeof a == "number") {
    return a == b;
  }
  if (isZero(a) || isZero(b)) {
    return isZero(a) == isZero(b);
  }
  return eq(a[0], b[0]) && eq(a[1], b[1]) && eq(a[2], b[2]);
}

/**
 * 判断a是否小于b
 * @param {Term|number} a
 * @param {Term|number} b
 * @returns {boolean} a是否小于b
 */
function lt(a, b) {
  if (isZero(b)) {
    return false;
  }
  if (isZero(a)) {
    return true;
  }
  if (!eq(a[0], b[0])) {
    return lt(a[0], b[0]);
  }
  if (!eq(a[1], b[1])) {
    return lt(a[1], b[1]);
  }
  return lt(a[2], b[2]);
}

/**
 * 判断a是否大于b
 * @param {Term|number} a
 * @param {Term|number} b
 * @returns {boolean} a是否大于b
 */
function gt(a, b) {
  return !(lt(a, b) || eq(a, b));
}

//Ω_a的简写
function omega(a) {
  if (isZero(a)) return "ω";
  if (eq(a, ONE)) return "Ω";
  return `Ω<sub>${termToString(a)}</sub>`;
}
//将ψa(x)(a>0)转化为Ω_a^b*c的形式
function g(a) {
  if (isZero(a)) {
    return [[], []];
  }
  if (isZero(a[0])) {
    return [log(a), []];
  }
  let [p, s] = separate(a[1], [succ(a[0]), [], []]);
  let [q, r] = separate(s, [a[0], [], []]);
  //令x=p+q+r,其中p每一项大于ψb+1(0),q每一项大于ψb(0)
  let second = exp(r);
  let first = add(ONE, p);
  let ptr = q;
  while (!isZero(ptr)) {
    ((first = add(first, exp(sub(log(ptr), [a[0], [], []])))), (ptr = ptr[2]));
  }
  return [first, second];
}

/**
 * ω^a1+ω^a2+...+ω^an的首项ω^a1
 *
 * 相当于把加法部分换成0
 *
 * 1的首项ω^0,则返回1
 *
 * OMEGA [0, 1, 0]的首项为ω^1，则返回[0,1,0]
 *
 * @param {Term} a
 * @returns {Term}
 */
function firstTerm(a) {
  if (isZero(a)) {
    return [];
  }
  return [a[0], a[1], []];
}

/**
 * ω^a1+ω^a2+...+ω^an的末项ω^an
 * @param {Term} a
 * @returns {Term}
 */
function lastTerm(a) {
  if (isZero(a)) {
    return [];
  }
  if (isZero(a[2])) {
    return a;
  }
  return lastTerm(a[2]);
}

//ψa(b)
function psi(a) {}

/**
 * 序数相加
 * @param {Term} a
 * @param {Term} b
 * @returns {Term}
 */
function add(a, b) {
  if (isZero(a)) {
    return b;
  }
  if (isZero(b)) {
    return a;
  }
  if (lt(firstTerm(a), firstTerm(b))) {
    return b;
  }
  return [a[0], a[1], add(a[2], b)];
}

/**
 * 序数后继
 * @param {Term} a
 * @returns {Term}
 */
function succ(a) {
  return add(a, ONE);
}

/**
 * 序数左减，即a-b为满足b+c=a的序数c(若不存在为0)
 * @param {Term} a
 * @param {Term} b
 * @returns {Term}
 */
function sub(a, b) {
  if (isZero(a)) {
    return [];
  }
  if (isZero(b)) {
    return a;
  }
  if (gt(firstTerm(a), firstTerm(b))) {
    return a;
  }
  return sub(a[2], b[2]);
}

/**
 * 将a分为大于b和小于b两段
 * @param {Term} a
 * @param {Term} b
 * @returns {[Term, Term]}
 */
function separate(a, b) {
  if (isZero(a)) {
    return [[], []];
  }
  if (lt(firstTerm(a), b)) {
    return [[], a];
  }
  return [[a[0], a[1], separate(a[2], b)[0]], separate(a[2], b)[1]];
}

/**
 * 将a的标准式中所有小于ψb(0)的项全部截断
 * @param {Term} a
 * @param {Term} b
 * @returns {Term}
 */
function truncate(a, b) {
  if (isZero(a)) {
    return [];
  }
  if (isZero(truncate(a[2], b)) && lt(firstTerm(a), [b, [], []])) {
    return [];
  }
  return [a[0], a[1], truncate(a[2], b)];
}

/**
 *序数ω^a，自动化为标准式
设a=ψb(p+d)+e,其中b的每一项都大于等于ψb+1(0)
则该函数返回的是ψb(p+{a-ψb(p)})
注意到当d<ψb+1(0)时,ψb(c+d)=ψb(c)*ω^d
分情况讨论：
1.若d=e=0，则ψb(p)=ψb(...+ψb+1(0))是一个ε点，取指数后不变
2.若d=0,e>0，函数返回ψb(p+e)=ψb(p)*ω^e=ω^(ψb(p)+e)
3.若d>0，函数返回ψb(p+a)=ψb(p)*ω^a=ω^(ψb(p)+a)=ω^a
 * @param {Term} a
 * @returns {Term}

*/
function exp(a) {
  if (lt(a, EPSILON0)) {
    return [[], a, []];
  }
  let p = separate(a[1], [succ(a[0]), [], []])[0];
  return [a[0], add(p, sub(a, [a[0], p, []])), []];
}

/**
 *
 * log_ω(a),即满足ω^b<=a的最大序数b
 *
 * @param {Term} a
 * @returns {Term}
 */
function log(a) {
  if (isZero(a)) {
    return [];
  }
  let [p, q] = separate(a[1], [succ(a[0]), [], []]);
  //同上，设a=ψb(p+q)+e,其中b的每一项都大于等于ψb+1(0)
  if (isZero(a[0]) && isZero(p)) {
    //此时a=ψ(q)+e,q<Ω,若为标准式则一定有a<ε0
    if (!lt(a[1], EPSILON0)) {
      //q>=ε0
      if (eq(log(q), q) && isZero(q[2]) && lt(a[1], OMEGA1)) {
        return firstTerm(a);
      }
      //q是ε点,q是ω的幂,q<Ω
    }
    return q;
  }
  let m = add([a[0], p, []], q); //m=ψb(p)+q,ω^m=ψb(p+q)
  if (!lt(a[1], [a[0], [succ(a[0]), [], []], []])) {
    //p+q>=ψb(ψb+1(0))
    if (eq(log(a[1]), a[1]) && isZero(a[2]) && lt(a[1], [succ(a[0]), [], []])) {
      return firstTerm(a);
    }
    //p+q是ε点,a是ω的幂,p+q<ψb+1(0)
  }
  return m;
}

/**
 * 化为可读的字符串
 * @param {Term} q
 * @returns {string}
 */
function termToString(q) {
  if (isZero(q)) {
    return "0";
  }
  if (isOrdinalFinite(q)) {
    return length1(q).toString();
  }
  let [a, b] = separate(q, firstTerm(q));
  let m = `ψ<sub>${termToString(a[0])}</sub>(${termToString(a[1])})`;
  if (isZero(a[1])) {
    m = omega(a[0]);
  }
  // if(isZero(a[1])){m=`Ω<sub>${termToString(a[0])}</sub>`;}  //a>0时，ψa(0)=Ω_a
  // if(isZero(a[1])&&eq(a[0],ONE)){m=`Ω`;}  //Ω_1简写为Ω
  if (isZero(a[0])) {
    m = `ψ(${termToString(a[1])})`;
  } //ψ0(x)简写为ψ(x)
  if (eq(a[0], []) && eq(a[1], ONE)) {
    m = "ω";
  } //ψ(1)=ω
  else if (lt(a[1], [succ(a[0]), [], []])) {
    let [first, second] = g(a);
    m = omega(a[0]);
    if (gt(first, ONE)) {
      m += `<sup>${termToString(first)}</sup>`;
    }
    if (gt(second, ONE)) m += termToString(second);
  }
  //else if(!eq(log(firstTerm(a)),firstTerm(a))){m=`ω<sup>${termToString(log(a))}</sup>`;}
  //  else if(!le(lastTerm(a[1]),[succ(a[0]),[],[]])&&le(lastTerm(a[1]),[succ(a[0]),[succ(a[0]),[],[]],[]])){
  //    let [f,g]=separate(a[1],[succ(a[0]),[succ(a[0]),[],[]],[]]);
  //  }
  //a的每一项均为q的主项，故一定形如ψb(c)*n，这里计算系数n
  if (length1(a) > 1) {
    m += length1(a);
  }
  if (!isZero(b)) {
    m += `+${termToString(b)}`;
  }
  return m;
}

function getParent(seq, index) {
  if (seq[index] == 0) return NaN;
  return seq[index] - 1 ?? NaN;
}
function childrens(seq, index) {
  let parents = [];
  for (let i = 0; i < seq.length; i++) {
    getParent(seq, i) === index && parents.push(i);
  }
  return parents;
}
function s_childrens(seq, index) {
  let parents = [];
  for (let i = 0; i < seq.length; i++) {
    s_parent(seq, i) === index && parents.push(i);
  }
  return parents;
}
function s_parent(seq, index) {
  if (seq[index] == 0) return NaN;
  let res = seq[index] - 1;
  if (!notsub(seq, index)) res--;
  return res ?? NaN;
}
function notsub(seq, index) {
  const 父项序号 = index;
  坏根序号 = 父项序号;
  坏根值 = seq[坏根序号 - 1];
  坏部 = seq.slice(坏根序号, index);
  白根存在 = 坏部.some((val) => val === 坏根值);
  return seq.slice(seq[index], index).includes(seq[seq[index] - 1]);
}
function delta(seq, index) {
  if (seq[index] == 0) return NaN;
  return index - seq[index] + 1;
}
function inrepeation(seq, index, lastIndex) {
  if (!notsub(seq, lastIndex)) return false;
  const 父项序号 = index;
  坏根序号 = 父项序号;
  return 坏根序号 <= index && index < lastIndex;
}
function affectedBy(seq, index) {
  let aff = [];
  for (let i = 0; i < seq.length; i++) {
    if (seq[i] == 0) continue;
    let start = seq[i] - 1;
    let end = i;
    if (start <= index && index < end) aff.push(i);
  }
  return aff;
}
function level(seq, index) {
  if (seq[index] == 0) return 0;
  if (notsub(seq, index)) return 0;
  else {
    let s = Array.from(seq);
    s[index]--;
    return level(s, index) + 1;
  }
}
/**
 *
 * @param {number[]} seq
 * @param {number} index
 */
function calc(seq = [0, 1, 0, 0], index = 0, nonsec = false) {
  if (seq.length == 0) return [];
  console.log("Seq", seq, index);
  if (seq.at(-1) == 0) {
    return add(calc(seq.slice(index, -1)), [[], [], []]);
  }
  let child = affectedBy(seq, index);
  let res2 = [];
  for (let i = 0; i < child.length; i++) {
    let flag = false;
    if (
      child[i] == index + 3 &&
      seq[index + 2] == 0 &&
      seq[index + 1] == seq[index + 3] &&
      delta(seq, child[i]) == 3
    ) {
      res2 = add(res2, [[], [[], [], []], []]);
      flag = true;
    }

    if (level(seq, child[i]) == 1 && seq[child[i]] !== 1) {
      res2 = add(res2, [[], [[], [], []], []]);
    } else res2 = succ(res2);
    // res = add(res, b);
  }

  let res = ZERO;
  //   console.log(seq[index]);
  //   if (seq[index] >= 1) {
  //     if (!notsub(seq, index) || seq[seq[index] - 1] == 0) {
  //       let res2 = [[], [], []];
  //       console.log("test", res2);
  //       console.log(seq, index, seq[index], notsub(seq, index));

  //       if (seq[index] == 1) return res2;
  //       if (!notsub(seq, index)) {
  //         console.log("Repeat ω");
  //         res2 = add(res2, [[], [[], [], []], []]);
  //       }
  //       for (let i = index + 1; true; i++) {
  //         if (!seq[i]) break;
  //         res2 = succ(res2);
  //         if (!inrepeation(seq, index, i)) {
  //           break;
  //         }
  //       }
  //       return res2;
  //     }
  //   }

  //   let schild = s_childrens(seq, index).filter((x) => !child.includes(x));
  //   console.log("S Childrens", schild);
  //   let res3 = [];
  //   for (let i = 0; i < schild.length; i++) {
  //     if (schild[i] < 0) continue;
  //     res3 = add(res3, [[], [[], [], []], []]);
  //     // console.log("heyiwei");
  //     // let b = exp(calc(seq, child[i]));
  //     // console.log(termToString(b));
  //     // res = add(res, b);
  //   }
  if (!isZero(res2)) res = add(res, exp(res2));
  // if (!isZero(res3)) res = add(res, exp(res3));
  //   if (seq[index] == 0 && !nonsec) {
  //     let possiblenextsuccessor = seq.indexOf(0, index + 1);
  //     if (possiblenextsuccessor > index) {
  //       let calc2 = calc(seq, possiblenextsuccessor);
  //       res = add(res, calc2);
  //     }
  //   }
  if (nonsec) return res;
  let possiblesuccessors = [];
  let reachedzero = false;
  for (let i = index + 1; i < seq.length; i++) {
    if (seq[i] == 0) {
      if (s_childrens(seq, i).length >= 1 || childrens(seq, i).length >= 1) {
        possiblesuccessors.push(i);
      }
    } else if (reachedzero) break;
  }
  for (let i = 0; i < possiblesuccessors.length; i++) {
    let calc2 = calc(seq, possiblesuccessors[i], 1);
    console.log(termToString(calc2));
    res = add(res, calc2);
  }
  return res;
}

// console.log(termToString(calc()));
function calculate() {
  let M = document.getElementById("input").value;
  let seq = M.split(",").map((x) => Number(x));
  if (seq.filter((x) => isNaN(x)).length >= 1) return;
  document.getElementById("output").innerHTML = termToString(calc(seq, 0));
  let Q =
    '<tr><th class="border">i</th><th class="border">S<sub>i</sub></th><th class="border">calc(S,i,1)</th><th class="border">notsub(S,i) // -1 on expand</th><th class="border">Real parent</th><th class="border">S parent</th><th class="border">Children</th><th class="border">S Children</th><th class="border">Delta</th><th class="border">Affected By</th><th class="border">Level</th>';

  for (let i = 0; i < seq.length; i++) {
    Q += "\n";
    Q += "<tr>";
    let m = [
      i.toString(),
      seq[i],
      termToString(calc(seq, i, true)),
      seq[i] == 0 ? "succ" : notsub(seq, i) ? "copy on expand" : "-1 on expand",
      isNaN(getParent(seq, i)) ? "-" : getParent(seq, i),
      isNaN(s_parent(seq, i)) ? "-" : s_parent(seq, i),
      childrens(seq, i),
      s_childrens(seq, i),
      isNaN(delta(seq, i)) ? "-" : delta(seq, i),
      affectedBy(seq, i),
      level(seq, i),
    ];
    for (let j = 0; j < m.length; j++) {
      Q += '<td class="border">';
      Q += `${m[j]}</td>`;
    }
    Q += "</tr>";
  }
  document.getElementById("output2").innerHTML = Q;
}
document.getElementById("input").value = "0,1,0,0,3,3,3";
calculate();
