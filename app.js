const info = document.getElementById("info");

function setModeText(mode) {
  if (mode === "comoda") {
    info.textContent =
      "Modo CÓMODO / SEGURO: prioriza vías tranquilas, carriles bici y pistas buenas, aunque tarde más.";
  } else if (mode === "equilibrada") {
    info.textContent =
      "Modo EQUILIBRADO: mezcla tiempo razonable con comodidad. Evita carreteras chungas cuando se puede.";
  } else if (mode === "rapida") {
    info.textContent =
      "Modo RÁPIDO: intenta ir por la opción con menos tiempo, aceptando más tráfico si compensa.";
  }
}

document.querySelectorAll(".modes button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const mode = btn.dataset.mode;
    setModeText(mode);
    console.log("Modo seleccionado:", mode);
  });
});
