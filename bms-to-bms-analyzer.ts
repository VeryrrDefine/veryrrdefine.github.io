function toArrayMatrix(r: string) {
  if (((r = r.trim()), r.length === 0)) return [];
  const e = r.includes("(") && r.includes(")");
  let t = [];
  e ? (t = v4(r)) : (t = b4(r));
  const a = t.map((o) => {
    let h = -1;
    for (let m = o.length - 1; m >= 0; m--)
      if (o[m] !== 0) {
        h = m;
        break;
      }
    return h + 1;
  });
  let n = Math.max(...a);
  return (
    (n = Math.max(n, 1)),
    t.map((o) => {
      const h = o.slice(0, n);
      for (; h.length < n; ) h.push(0);
      return h;
    })
  );
}
function v4(r: string) {
  ((r = r.replace(/\s*,\s*/g, ",")),
    (r = r.replace(/\s*\)\s*/g, ")")),
    (r = r.replace(/\s*\(\s*/g, "(")));
  const e = [];
  let t = "",
    a = 0;
  for (let n = 0; n < r.length; n++) {
    const s = r[n];
    if (s === "(") (a++, a === 1 && (t = ""));
    else if (s === ")") {
      if ((a--, a === 0 && t !== void 0)) {
        const o = g4(t);
        e.push(o);
      }
    } else a > 0 && (t += s);
  }
  return e.length === 0 ? [[0]] : e;
}
function g4(r: string) {
  const e = [];
  if (r.trim() === "") return [0];
  const t = r.split(",");
  for (const a of t)
    if (a.includes("^")) {
      const [n, s] = a.split("^"),
        o = parseInt(n.trim()) || 0,
        h = parseInt(s.trim()) || 0;
      for (let m = 0; m < h; m++) e.push(o);
    } else if (a.trim() !== "") {
      const n = parseInt(a.trim()) || 0;
      e.push(n);
    }
  return e.length > 0 ? e : [0];
}
function b4(r: string) {
  const e = [],
    t = r.split(/[,\s]+/).filter((a) => a.length > 0);
  for (const a of t) {
    const n = [];
    if (a.includes(",")) {
      const s = a.split(",");
      for (const o of s) {
        const h = o.trim();
        if (h.length > 0) {
          const m = letterToNumber(h);
          n.push(m);
        }
      }
    } else
      for (let s = 0; s < a.length; s++) {
        const o = a[s],
          h = letterToNumber(o);
        n.push(h);
      }
    (n.length === 0 && n.push(0), e.push(n));
  }
  return e.length === 0 ? [[0]] : e;
}
function letterToNumber(r: string) {
  const e = r.toLowerCase(),
    t = parseInt(e, 36);
  return isNaN(t) ? 0 : t;
}
function toBMSMatrix(r: number[][]) {
  return r.map((e) => `(${e.map((t) => t.toString()).join(",")})`).join("");
}
function toLatexMatrix(r: number[][]) {
  if (!r || r.length === 0 || r.every((n) => n.length === 0))
    return "\\begin{pmatrix}\\end{pmatrix}";
  let t = "\\begin{pmatrix}";
  const a = r[0].map((n, s) => r.map((o) => o[s]));
  for (let n = 0; n < a.length; n++) {
    const s = a[n];
    s.length !== 0 &&
      ((t += s.map((o) => o.toString()).join(" & ")),
      n < a.length - 1 && (t += " \\\\"));
  }
  return ((t += "\\end{pmatrix}"), t);
}
