console.log("TRIPLO Experimental cargado");

document.addEventListener("DOMContentLoaded", () => {
  const mapSearch = L.map("map", {
    zoomControl: false,
    attributionControl: false
  }).setView([43.54, -5.66], 13);
  
  const mapResults = L.map("mapResults", {
    zoomControl: false,
    attributionControl: false
  }).setView([43.54, -5.66], 13);
  
  const MAPTILER_KEY = "XjdqCCjtAO2oZ02TFnHB";
  const tileUrl = `https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`;
  
  L.tileLayer(tileUrl, { minZoom: 1, maxZoom: 18, crossOrigin: true }).addTo(mapSearch);
  L.tileLayer(tileUrl, { minZoom: 1, maxZoom: 18, crossOrigin: true }).addTo(mapResults);
  
  let fromMarker = null;
  let routeLines = {};
  
  function switchState(toState) {
    const fromState = document.querySelector('.state.active');
    const toEl = document.querySelector(`.${toState}`);
    
    if (fromState.classList.contains('state-search') && toState === 'state-results') {
      animateLogoTransition();
      setTimeout(() => {
        fromState.classList.remove('active');
        toEl.classList.add('active');
        gsap.fromTo(toEl, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        setTimeout(() => {
          mapSearch.invalidateSize();
          mapResults.invalidateSize();
          drawRoutesOnResults();
          selectRoute('fastest');
        }, 300);
      }, 700);
    } else {
      gsap.to(fromState, {
        duration: 0.3,
        opacity: 0,
        onComplete: () => {
          fromState.classList.remove('active');
          toEl.classList.add('active');
          gsap.fromTo(toEl, { opacity: 0 }, { opacity: 1, duration: 0.4 });
          setTimeout(() => {
            mapSearch.invalidateSize();
            mapResults.invalidateSize();
          }, 300);
        }
      });
    }
  }
  
  function animateLogoTransition() {
    const slogan = document.querySelector('.state-search .slogan');
    const triangle = document.querySelector('.state-search .triangle');
    const brand = document.querySelector('.state-search .brand');
    
    gsap.to(slogan, { duration: 0.2, opacity: 0 });
    
    const triangleClone = triangle.cloneNode(true);
    const brandClone = brand.cloneNode(true);
    
    triangleClone.style.cssText = 'position:fixed; z-index:9999; pointer-events:none;';
    brandClone.style.cssText = 'position:fixed; z-index:9999; pointer-events:none; color:' + 
                               getComputedStyle(brand).color + '; font-size:' + 
                               getComputedStyle(brand).fontSize + '; font-weight:600;';
    
    const triRect = triangle.getBoundingClientRect();
    const brandRect = brand.getBoundingClientRect();
    
    triangleClone.style.top = triRect.top + 'px';
    triangleClone.style.left = triRect.left + 'px';
    brandClone.style.top = brandRect.top + 'px';
    brandClone.style.left = brandRect.left + 'px';
    
    document.body.appendChild(triangleClone);
    document.body.appendChild(brandClone);
    
    const compactTriangle = document.querySelector('.triangle-small');
    const compactBrand = document.querySelector('.brand-small');
    const destTriRect = compactTriangle.getBoundingClientRect();
    const destBrandRect = compactBrand.getBoundingClientRect();
    
    gsap.to(triangleClone, {
      duration: 0.6,
      top: destTriRect.top + 'px',
      left: destTriRect.left + 'px',
      borderLeftWidth: '12px',
      borderRightWidth: '12px',
      borderBottomWidth: '20px',
      ease: "power2.inOut",
      onComplete: () => triangleClone.remove()
    });
    
    gsap.to(brandClone, {
      duration: 0.6,
      top: destBrandRect.top + 'px',
      left: destBrandRect.left + 'px',
      fontSize: '24px',
      ease: "power2.inOut",
      onComplete: () => brandClone.remove()
    });
  }
  
  function drawRoutesOnResults() {
    Object.values(routeLines).forEach(line => {
      if (line && mapResults.hasLayer(line)) mapResults.removeLayer(line);
    });
    
    const routes = {
      fastest: [[-5.68,43.53],[-5.66,43.54],[-5.64,43.55],[-5.62,43.545],[-5.60,43.535]],
      balanced: [[-5.68,43.53],[-5.665,43.535],[-5.65,43.545],[-5.63,43.54],[-5.61,43.53],[-5.60,43.535]],
      scenic: [[-5.68,43.53],[-5.67,43.525],[-5.66,43.52],[-5.64,43.525],[-5.62,43.53],[-5.60,43.535]]
    };
    
    routeLines = {};
    Object.keys(routes).forEach(routeKey => {
      const color = routeKey === 'fastest' ? '#2ecc71' : 
                    routeKey === 'balanced' ? '#f1c40f' : '#e74c3c';
      
      const latLngs = routes[routeKey].map(coord => [coord[1], coord[0]]);
      routeLines[routeKey] = L.polyline(latLngs, { 
        color: color, 
        weight: 4, 
        opacity: routeKey === 'fastest' ? 1 : 0.4
      }).addTo(mapResults);
    });
    
    const bounds = Object.values(routeLines).map(line => line.getBounds());
    const groupBounds = bounds.reduce((acc, b) => acc.extend(b), bounds[0]);
    mapResults.fitBounds(groupBounds, { padding: [60,60], maxZoom: 13 });
  }
  
  document.getElementById("searchBtn").addEventListener("click", () => {
    const searchBtn = document.getElementById("searchBtn");
    const originalText = searchBtn.textContent;
    searchBtn.textContent = "Searching...";
    searchBtn.disabled = true;
    
    setTimeout(() => {
      switchState('state-results');
      searchBtn.textContent = originalText;
      searchBtn.disabled = false;
    }, 800);
  });
  
  document.getElementById("backBtn").addEventListener("click", () => {
    switchState('state-search');
  });
  
  function selectRoute(routeType) {
    document.querySelectorAll('.compact-route').forEach(card => {
      card.classList.remove('active');
      if (card.dataset.route === routeType) card.classList.add('active');
    });
    
    Object.keys(routeLines).forEach(key => {
      if (routeLines[key]) {
        routeLines[key].setStyle({ 
          weight: key === routeType ? 6 : 4,
          opacity: key === routeType ? 1 : 0.4
        });
      }
    });
  }
  
  document.querySelectorAll('.compact-route').forEach(card => {
    card.addEventListener('click', function() {
      selectRoute(this.dataset.route);
    });
  });
  
  document.getElementById("selectRouteBtn").addEventListener("click", () => {
    const selected = document.querySelector('.compact-route.active');
    if (selected) alert(`✅ "${selected.dataset.route}" route selected!`);
    else alert("Please select a route first");
  });
  
  document.querySelector(".geolocate-btn").addEventListener("click", function() {
    const fromInput = document.getElementById("fromInput");
    if (!navigator.geolocation) return alert("Geolocation not supported");
    
    fromInput.placeholder = "Detecting...";
    fromInput.disabled = true;
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
          const data = await res.json();
          fromInput.value = data.display_name || "My location";
        } catch { fromInput.value = "My location"; }
        
        if (fromMarker) mapSearch.removeLayer(fromMarker);
        fromMarker = L.marker([lat, lon]).addTo(mapSearch).bindPopup(`<b>Your location</b>`).openPopup();
        mapSearch.setView([lat, lon], 15);
        fromInput.placeholder = "From";
        fromInput.disabled = false;
      },
      () => {
        alert("Location access denied");
        fromInput.placeholder = "From";
        fromInput.disabled = false;
      }
    );
  });
  
  window.addEventListener('resize', () => {
    mapSearch.invalidateSize();
    mapResults.invalidateSize();
  });
});