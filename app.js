const toastEl = document.getElementById("toast");
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("visible");
  setTimeout(() => toastEl.classList.remove("visible"), 2000);
}

const fromBtn = document.getElementById("from-btn");
const toBtn = document.getElementById("to-btn");
const optionsBtn = document.getElementById("options-btn");

let mode = "from";
function setMode(m) {
  mode = m;
}

setMode("from");

const map = L.map("map").setView([43.5453, -5.6615], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

let fromMarker = null;
let toMarker = null;
let routeLine = null;

function updateRoute() {
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

map.on("click", (e) => {
  const latlng = e.latlng;

  if (mode === "from") {
    if (fromMarker) map.removeLayer(fromMarker);
    fromMarker = L.marker(latlng, { draggable: true }).addTo(map);
    fromMarker.on("dragend", updateRoute);
    setMode("to");
    showToast("Select TO");
  } else {
    if (toMarker) map.removeLayer(toMarker);
    toMarker = L.marker(latlng, { draggable: true }).addTo(map);
    toMarker.on("dragend", updateRoute);
    setMode("from");
    showToast("Route updated");
  }

  updateRoute();
});

fromBtn.addEventListener("click", () => {
  setMode("from");
  showToast("Tap map for FROM");
});

toBtn.addEventListener("click", () => {
  setMode("to");
  showToast("Tap map for TO");
});

optionsBtn.addEventListener("click", () => {
  showToast("Options (coming soon)");
});
