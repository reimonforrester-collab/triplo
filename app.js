// ---------- utilidades UI ----------

const toastEl = document.getElementById("toast");
function showToast(msg, ms = 2000) {
  toastEl.textContent = msg;
  toastEl.classList.add("visible");
  setTimeout(() => toastEl.classList.remove("visible"), ms);
}

const fromBtn = document.getElementById("from-btn");
const toBtn = document.getElementById("to-btn");
const optionsBtn = document.getElementById("options-btn");

let mode = "from"; // qué punto se va a fijar con el próximo clic en el mapa

function setMode(newMode) {
  mode = newMode;
  fromBtn.classList.toggle("active", mode === "from");
  toBtn.classList.toggle("active", mode === "to");
}

// inicial
setMode("from");

// Añadimos contenedores para el texto dinámico
[fromBtn, toBtn].forEach((btn) => {
  const span = document.createElement("span");
  span.className = "value";
  span.textContent = "Tap on the map to set this point";
  btn.appendChild(span);
});

// ---------- MAPA (OpenStreetMap + Leaflet) ----------

const map = L.map("map").setView([43.5453, -5.6615], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

let fromMarker = null;
let toMarker = null;
let routeLine = null;

// actualizar texto de botón con coords
function updateBtnLabel(btn, latlng) {
  const span = btn.querySelector(".value");
  span.textContent = `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`;
}

// dibujar línea recta entre from y to (prototipo)
function updateRouteLine() {
  if (fromMarker && toMarker) {
    const latlngs = [fromMarker.getLatLng(), toMarker.getLatLng()];
    if (!routeLine) {
      routeLine = L.polyline(latlngs, { color: "orange" }).addTo(map);
    } else {
      routeLine.setLatLngs(latlngs);
    }
    map.fitBounds(routeLine.getBounds(), { padding: [20, 20] });
  }
}

// clic en el mapa: fija from/to según el modo actual
map.on("click", (e) => {
  const latlng = e.latlng;

  if (mode === "from") {
    if (fromMarker) map.removeLayer(fromMarker);
    fromMarker = L.marker(latlng, { draggable: true }).addTo(map);
    fromMarker.bindPopup("From").openPopup();
    updateBtnLabel(fromBtn, latlng);

    fromMarker.on("dragend", () => {
      updateBtnLabel(fromBtn, fromMarker.getLatLng());
      updateRouteLine();
    });

    setMode("to");
    showToast("Now tap on the map to set TO");
  } else {
    if (toMarker) map.removeLayer(toMarker);
    toMarker = L.marker(latlng, { draggable: true }).addTo(map);
    toMarker.bindPopup("To").openPopup();
    updateBtnLabel(toBtn, latlng);

    toMarker.on("dragend", () => {
      updateBtnLabel(toBtn, toMarker.getLatLng());
      updateRouteLine();
    });

    setMode("from");
    showToast("Route updated. Drag markers to adjust.");
  }

  updateRouteLine();
});

// Botones inferiores

fromBtn.addEventListener("click", () => {
  setMode("from");
  showToast("Tap on the map to set FROM");
});

toBtn.addEventListener("click", () => {
  setMode("to");
  showToast("Tap on the map to set TO");
});

optionsBtn.addEventListener("click", () => {
  showToast("Options: aquí meteremos modos Triplo y preferencias.");
});
