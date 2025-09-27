let currentvalue = INPUT.replace(/\s/g, "");
let seq = currentvalue.split(",");
let res = [];
var mainoffset = 0;
for (let i = 0; i < seq.length; i++) {
  let cur = seq[i];
  console.log(cur);
  if (cur.startsWith("+")) {
    console.log("add", mainoffset);
    i++;
    res.push(`(${+cur + mainoffset},${seq[i]})`);
    mainoffset += parseInt(cur.substring(1));
  } else if (cur.startsWith("-")) {
    console.log("sub", mainoffset);
    mainoffset -= parseInt(cur.substring(1));
  } else {
    console.log("ok");
    res.push(`(${+cur + mainoffset},${cur})`);
  }
}
const OUTPUT = res.join("");
