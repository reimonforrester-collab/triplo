console.log("triplo UI cargada");

document.addEventListener("DOMContentLoaded", () => {
  const map = L.map("map", {
    zoomControl: false,
    attributionControl: false  // Desactiva texto y logo
  }).setView([43.54, -5.66], 13);

  const MAPTILER_KEY = "XjdqCCjtAO2oZ02TFnHB";
  
  // Estilo streets-v2 original (normal)
  const tileUrl = "https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=" + MAPTILER_KEY;
  
  L.tileLayer(tileUrl, {
    minZoom: 1,
    maxZoom: 18,
    crossOrigin: true
  }).addTo(map);

  // Eliminar cualquier control remanente
  map.removeControl(map.attributionControl);
});