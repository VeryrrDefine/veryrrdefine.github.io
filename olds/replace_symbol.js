var els = document.querySelectorAll(".replace_symbols");
for (const element of els) {
  element.innerHTML = element.innerHTML
    .replace(/\\psi/g, "ψ")
    .replace(/\\W/g, "Ω")
    .replace(/\\w/g, "ω")
    .replace(/\\phi/g, "φ")
    .replace(/\\eps/g, "ε")
    .replace(/\\zet/g, "ζ");
}
