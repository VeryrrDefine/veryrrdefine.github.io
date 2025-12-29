const OMEGA = "p(p(0))";
const OMEGA1 = "p(P(0))";
const ONE = "p(0)";
const T = "P(0)";
function eq(a, b) {
  if (typeof a == "number") {
    return a == b;
  }
  return eq(a[0], b[0]) && eq(a[1], b[1]) && eq(a[2], b[2]);
}

// FROM COCF PROGRAM

function paren(x, n) {
  console.log();
  let q = x[n] == "(" ? 1 : -1;
  let i = n;
  let t = 0;
  while (1) {
    t += x[i] == "(" ? 1 : x[i] == ")" ? -1 : 0;
    if (!t) {
      break;
    }
    i += q;
  }
  return i;
}

function splitTermTo1stAndRest(x) {
  console.log();
  let m = paren(x, 1);
  return [x.slice(0, m + 1), x.slice(m + 2) || "0"];
}

function splitTermToLastAndPrevious(x) {
  console.log();
  let m = paren(x, x.length - 1);
  return [x.slice(0, m - 2) || "0", x.slice(m - 1)];
}

function terms(x) {
  console.log();
  if (x == "0") {
    return [];
  }
  return [splitTermTo1stAndRest(x)[0]].concat(
    terms(splitTermTo1stAndRest(x)[1])
  );
}

function getPpArgument(x) {
  console.log();
  return splitTermTo1stAndRest(x)[0].slice(2, -1);
}

function lt(x, y) {
  console.log();
  if (y == "0") {
    return false;
  }
  if (x == "0") {
    return true;
  }
  if (x[0] == "p" && y[0] == "P") {
    return true;
  }
  if (x[0] == "P" && y[0] == "p") {
    return false;
  }
  if (getPpArgument(x) != getPpArgument(y)) {
    return lt(getPpArgument(x), getPpArgument(y));
  }
  return lt(splitTermTo1stAndRest(x)[1], splitTermTo1stAndRest(y)[1]);
}

function add(x, y) {
  if (x == "0") {
    return y;
  }
  if (y == "0") {
    return x;
  }
  if (lt(splitTermTo1stAndRest(x)[0], splitTermTo1stAndRest(y)[0])) {
    return y;
  }
  let z = splitTermTo1stAndRest(x)[0];
  let w = add(splitTermTo1stAndRest(x)[1], y);
  if (w != "0") {
    return z + "+" + w;
  }
  return z;
}

function sub(x, y) {
  if (x == "0") {
    return "0";
  }
  if (y == "0") {
    return x;
  }
  if (lt(splitTermTo1stAndRest(y)[0], splitTermTo1stAndRest(x)[0])) {
    return x;
  }
  return sub(splitTermTo1stAndRest(x)[1], splitTermTo1stAndRest(y)[1]);
}

function splitT(x) {
  return split(x, T);
}

function exp(a) {
  if (a[0] == "P") {
    return `P(${sub(a, T)})`;
  }
  if (lt(a, "p(p(P(0)))")) {
    return `p(${a})`;
  }
  let [x, y] = splitT(getPpArgument(a));
  let p = split(y, `p(${add(x, T)})`)[0];
  return "p(" + add(x, add(p, sub(a, "p(" + add(x, p) + ")"))) + ")";
}

function log(a) {
  if (a == "0") {
    return "0";
  }
  if (a[0] == "P") {
    return add(T, getPpArgument(a));
  }
  let [x, y] = splitT(getPpArgument(a));
  let [p, q] = split(y, `p(${add(x, T)})`);
  if (x == "0" && p == "0") {
    return q;
  }
  let m = add(`p(${add(x, p)})`, q);
  return m;
}

function div(a, b) {
  // only works when b is a.p.
  if (lt(a, b)) {
    return "0";
  }
  return add(exp(sub(log(a), log(b))), div(splitTermTo1stAndRest(a)[1], b));
}

function mul(a, b) {
  // only works when a is a.p.
  if (b == "0") {
    return "0";
  }
  return add(exp(add(log(a), log(b))), mul(a, splitTermTo1stAndRest(b)[1]));
}

/**
 * Split a to a1>=x, a2<x
 * @param {*} a
 * @param {*} x
 * @returns
 */
function split(a, x) {
  if (a == "0") {
    return ["0", "0"];
  }
  if (lt(a, x)) {
    return ["0", a];
  }
  if (lt(splitTermTo1stAndRest(a)[0], x)) {
    return ["0", a];
  }
  return [
    add(splitTermTo1stAndRest(a)[0], split(splitTermTo1stAndRest(a)[1], x)[0]),
    split(splitTermTo1stAndRest(a)[1], x)[1],
  ];
}

function hasRest(x) {
  // "does it need parentheses when you write something*x"
  if (lt(x, OMEGA)) {
    return false;
  }
  let pAboveT = x[0] == "p" ? `p(${splitT(getPpArgument(x))[0]})` : T;
  let logord = null;
  let ordNoMul = null;
  if (pAboveT == ONE) {
    pAboveT = OMEGA;
    logord = log(x);
    ordNoMul = exp(logord);
  } else {
    logord = div(log(x), pAboveT);
    ordNoMul = exp(mul(pAboveT, logord));
  }
  let ordMulFactor = div(x, ordNoMul);
  let rest = sub(x, mul(ordNoMul, ordMulFactor));
  if (rest != "0") {
    return true;
  }
  return false;
} // I could make it do up to K if I wanted, but I'm running low on time... since tomorrow I'm going to Korea (19 Dec 2025)
// also does not handle I(ψ(T^M),1) because it's too complicated
function display(ordinal, y) {
  //if(!y){return 'X'}
  //console.log(x);
  if (ordinal == "0") {
    return "0";
  }
  if (/^(p\(0\)\+)*p\(0\)$/.test(ordinal)) {
    return ((ordinal.length + 1) / 5).toString();
  }
  let psiT = ordinal[0] == "p" ? `p(${splitT(getPpArgument(ordinal))[0]})` : T;
  let logOrdinal = null;
  let ordinalFirstTerm = null;
  console.log(psiT);

  // if is not Ω
  if (psiT == ONE) {
    // ω
    psiT = OMEGA;
    logOrdinal = log(ordinal);
    ordinalFirstTerm = splitTermTo1stAndRest(ordinal)[0];
  } else {
    logOrdinal = div(log(ordinal), psiT);
    ordinalFirstTerm = `${psiT == T ? "P" : "p"}(${
      split(getPpArgument(ordinal), psiT)[0]
    })`;
  }
  let ordinalMul = div(ordinal, ordinalFirstTerm);
  let addition = sub(
    ordinal,
    mul(ordinalFirstTerm, div(ordinal, ordinalFirstTerm))
  );
  //console.log(f,g,h,'',c,d);
  if (ordinalMul == ONE && addition == "0") {
    if (exp(ordinal) != ordinal) {
      if (ordinal == OMEGA) {
        return "ω";
      }
      if (lt(ordinal, OMEGA1)) {
        return `ω<sup>${display(log(ordinal))}</sup>`;
      }
      return `${display(psiT)}<sup>${display(logOrdinal)}</sup>`;
    }
    if (ordinal == T) {
      return "T";
    }
    //获取p内最后一项的ω指数除以T
    //得到x p(ω^(Tx))，相当于p(T^x)
    let argTExponent = div(
      log(splitTermToLastAndPrevious(getPpArgument(ordinal))[1]),
      T
    );
    //获取最后一项的T^x
    let lastTpowX = exp(mul(T, argTExponent));
    lastTpowX = div(getPpArgument(ordinal), lastTpowX);
    //console.log(arg(x),k,m)
    //T^x中的x分成T*?=x, y<T两部分
    let lastTpowXsplitedT = splitT(lastTpowX);
    let l = null;
    if (lastTpowXsplitedT[0] == "0") {
      l = "0";
    } else {
      // T^x乘以指数分出的T再套个p
      // 相当于 p(T^x * Tx)
      l = "p(" + mul(lastTpowX, lastTpowXsplitedT[0]) + ")";
    }
    console.log("l", l);
    let r = "p(" + mul(lastTpowX, add(lastTpowXsplitedT[0], T)) + ")";
    let [a, b] = split(lastTpowXsplitedT[1], r);
    a = "p(" + mul(lastTpowX, a) + ")";
    //console.log(k,r,l,a,b)
    if (a == ONE) {
      a = "0";
    }
    l = add(l, add(a, b));
    let admMain = "";
    if (
      splitTermToLastAndPrevious(getPpArgument(ordinal))[1][0] == "P" &&
      b != "0"
    ) {
      if (argTExponent == ONE) {
        admMain = "Ω";
      } else if (argTExponent == "p(0)+p(0)") {
        admMain = "I";
      } else if (lt(argTExponent, "p(P(P(p(P(P(P(0)))))))")) {
        admMain = `I(${display(sub(argTExponent, "p(0)+p(0)"))},x)`;
      } else if (argTExponent == T) {
        admMain = "M";
      }
      if (admMain == "") {
        return `ψ(${display(getPpArgument(ordinal))})`;
      }
      if (l == ONE) {
        return admMain.replace("x", "0");
      }
      if (admMain.includes("x")) {
        return admMain.replace("x", display(l));
      }
      return `${admMain}<sub>${display(l)}</sub>`;
    }
    return `ψ(${display(getPpArgument(ordinal))})`;
  }
  let finRes = display(ordinalFirstTerm);
  //console.log(f,h,c,d)
  if (ordinalMul != ONE) {
    if (!hasRest(ordinalMul)) {
      finRes += display(ordinalMul);
    } else {
      finRes += `&sdot;(${display(ordinalMul)})`;
    }
  }
  if (addition != "0") {
    finRes += "+" + display(addition);
  }
  return finRes;
}

// END COCF

function P(M, r, n) {
  if (r == -1) {
    return n - 1;
  }
  let q = P(M, r - 1, n);
  while (q > -1 && M[q][r] >= M[n][r]) {
    q = P(M, r - 1, q);
  }
  return q;
}

function C(M, n) {
  let X = [];
  for (let i = 0; i < M.length; i++) {
    if (P(M, 0, i) == n) {
      X.push(i);
    }
  }
  return X;
}

function CR(M, n) {
  let X = [];
  for (let i = 0; i < M.length; i++) {
    if (P(M, 0, i) == n) {
      X.push(i);
      X = X.concat(CR(M, i));
    }
  }
  return X;
}

function D(M, n) {
  let X = 0;
  for (let i = 0; i < M.length; i++) {
    if (P(M, 0, i) == n && M[i][1] > 0) {
      X++;
    }
  }
  return X;
}

function upgrade(M, n) {
  if (M[n][1] == 0 || M[n][2] == 1 || n + 1 == M.length) {
    return [0, null];
  }
  let m = P(M, 1, n);
  let L = [M[m][0] + 1, M[n][1], M[m][2] + 1];
  if (P(M, 1, n) == P(M, 1, n + 1) && eq(M[n + 1], L)) {
    return [1, n + 1];
  }
  let q = n;
  let p = n;
  while (q != -1) {
    q = P(M, 0, q);
    if (P(M, 1, n) == P(M, 1, q) && eq(M[q], L) && M[n + 1][0] > M[q][0]) {
      if (M[p][2] == 1) {
        return [2, q];
      }
      return [1, q];
    }
    p = q;
  }
  return [0, null];
}

function mv(M, n, k) {
  // value of upgrader; k is same as in ov
  let S = "0";
  for (i of C(M, n)) {
    if (i > k && k) {
      break;
    }
    if (M[i][2] != 1) {
      continue;
    }
    let q = "0";
    for (j of C(M, i)) {
      if (j > k && k) {
        break;
      }
      q = add(q, ov(M, j, k));
    }
    S = add(S, exp(q));
  }
  let X = C(M, n).filter((x) => M[x][2]);
  let p;
  if (!X.length) {
    p = 1;
  } else if (!CR(M, X.at(-1)).length) {
    p = 1;
  } else {
    p = M[CR(M, X.at(-1)).at(-1)][2];
  }
  if (lt(splitT(S)[1], OMEGA) && p && !k) {
    S = add(S, ONE);
  } // 111 211 311 = ψ(T^2·ω), not ψ(T^2)
  // also, if k!=0, the condition will never be activated, since then it's a fixed point.
  return exp(S);
}

function ov(M, n, k) {
  // k = 3 (31) in 0 111 211 31 2 (-> T, since 31 is chain-upgraded)
  if (n == k) {
    return T;
  }
  if (M[n][2] == 0) {
    return calcMatrix(M, n);
  }
  let S = "0";
  for (let i of C(M, n)) {
    if (i > k && k) {
      break;
    }
    S = add(S, ov(M, i, k));
  }
  return `P(${S})`;
}

function admissible(M, n) {
  if (M[n][1] == 0) {
    return "0";
  }
  if (M[n][2] == 0) {
    let u = upgrade(M, n);
    u = u[0] ? mv(M, u[1], n * (u[0] == 2)) : ONE;
    return add(admissible(M, P(M, 1, n)), u);
  }
  return add(admissible(M, P(M, 1, n)), mv(M, n, 0));
}

function calcMatrix(M, n) {
  let S = "0";
  for (let i of C(M, n)) {
    if (skipped(M, n).includes(i)) {
      continue;
    }
    S = add(S, calcMatrix(M, i));
  }
  return `p(${add(mul(T, admissible(M, n)), S)})`;
}

function skipped(M, n) {
  let S = [];
  let u = [...Array(M.length).keys()].map((x) =>
    upgrade(M, x)[0] == 1 ? upgrade(M, x)[1] : null
  );
  for (let i of C(M, n)) {
    if (M[i][2] && M[n][2]) {
      S.push(i);
      continue;
    }
    if (u.includes(i)) {
      let c = C(M, i);
      if (c.length) {
        if (eq(M[c.at(-1)], [M[i][0] + 1, M[i][1], 1])) {
          S.push(i);
        }
      } // e.g. 0 111 211 21 111 211
      else {
        S.push(i);
        continue;
      }
    }
    if (
      eq(M[i], [M[n][0] + 1, 0, 0]) &&
      upgrade(M, i - 1)[0] == 2 &&
      upgrade(M, i - 1)[1] == n &&
      !C(M, i).length
    ) {
      S.push(i);
      continue;
    }
    S = S.concat(skipped(M, i));
  }
  return S;
}

function _o(M) {
  let S = "0";
  for (let i = 0; i < M.length; i++) {
    if (eq(M[i], [0, 0, 0])) {
      S = add(S, calcMatrix(M, i));
    }
  }
  return S;
}

function _skipped(M) {
  let S = [];
  for (let i = 0; i < M.length; i++) {
    if (eq(M[i], [0, 0, 0])) {
      S = S.concat(skipped(M, i));
    }
  }
  return S;
}

function createTable(X) {
  return X.map(
    (x) => "<tr>" + x.map((y) => "<td>" + y + "</td>").join("") + "</tr>"
  ).join("");
}

function calculate() {
  let M = document.getElementById("input").value;
  try {
    M = eval(
      "[" +
        M.replaceAll(")(", "],[").replaceAll("(", "[").replaceAll(")", "]") +
        "]"
    );
  } catch (e) {
    return;
  }
  M = M.map((x) => {
    let y = x.slice();
    while (y.length < 3) {
      y.push(0);
    }
    return y;
  });
  let A = [...Array(M.length).keys()].map((x) => D(M, x));
  if (Math.max(...A) > 15) {
    document.getElementById("output").innerHTML = "Too complex";
    document.getElementById("output3").innerHTML = "";
    let Q =
      '<tr><th class="border">i</th><th class="border" colspan=3>M<sub>i</sub></th><th class="border">calcMatrix(M,i)</th><th class="border">admissible(M,i)</th><th class="border">upgrade(M,i)</th><th class="border">Children</th>';
    for (let i = 0; i < M.length; i++) {
      Q += "<tr>";
      let m = [
        i.toString(),
        "(" + M[i][0] + ",",
        M[i][1] + ",",
        M[i][2] + ")",
        "?",
        "?",
        "?",
        "?",
      ];
      for (let j = 0; j < m.length; j++) {
        if (j == 1 || j == 2 || j == 3) {
          Q += '<td class="nborder">';
        } else {
          Q += '<td class="border">';
        }
        Q += `${m[j]}</td>`;
      }
      Q += "</tr>";
    }
    Q += `<tr><td>Σ</td><td colspan=7>?</td></tr>`;
    document.getElementById("output2").innerHTML = Q;
    return;
  }
  document.getElementById("output").innerHTML = display(_o(M));
  let Q =
    '<tr><th class="border">i</th><th class="border" colspan=3>M<sub>i</sub></th><th class="border">calcMatrix(M,i)</th><th class="border">admissible(M,i)</th><th class="border">upgrade(M,i)</th><th class="border">Children</th>';
  let u = [...Array(M.length).keys()].map((x) => upgrade(M, x)[1]);
  let u1 = [...Array(M.length).keys()]
    .filter((x) => x != null)
    .map((x) => upgrade(M, x)[1] * (-1) ** upgrade(M, x)[0]);
  let s = _skipped(M);
  for (let i = 0; i < M.length; i++) {
    Q += "\n";
    if (eq(M[i], [0, 0, 0])) {
      Q += '<tr style="background-color:cyan">';
    } else if (u.includes(i)) {
      let c = C(M, i);
      if (c.length) {
        if (eq(M[c.at(-1)], [M[i][0] + 1, M[i][1], 1]) && !u1.includes(i)) {
          Q += '<tr style="color:#bbb;background-color:yellow">';
        } else {
          Q += '<tr style="background-color:lime">';
        }
      } else {
        Q += '<tr style="color:#bbb;background-color:yellow">';
      }
    } else if (s.includes(i)) {
      Q += '<tr style="color:#bbb;">';
    } else {
      Q += "<tr>";
    }
    let m = [
      i.toString(),
      "(" + M[i][0] + ",",
      M[i][1] + ",",
      M[i][2] + ")",
      display(calcMatrix(M, i)),
      display(admissible(M, i)),
      upgrade(M, i)[0]
        ? upgrade(M, i)[1].toString() + "*".repeat(upgrade(M, i)[0] - 1)
        : "",
      C(M, i),
    ];
    for (let j = 0; j < m.length; j++) {
      if (j == 1 || j == 2 || j == 3) {
        Q += '<td class="nborder">';
      } else {
        Q += '<td class="border">';
      }
      Q += `${m[j]}</td>`;
    }
    Q += "</tr>";
  }
  Q += `<tr><td>Σ</td><td colspan=7>${""}</td></tr>`;
  document.getElementById("output2").innerHTML = Q;
}
document.getElementById("input").value =
  "(0)(1,1,1)(2,1,1)(3,1,1)(1,1,1)(2,1,1)(3,1)(4,2,1)(5,2,1)(6,2,1)(2,1)(3,2,1)(4,2,1)(5,2,1)";
calculate();
