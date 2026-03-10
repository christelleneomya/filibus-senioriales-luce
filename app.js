const CONFIG = {
  refreshMs: 30000
};

function pad(n) {
  return String(n).padStart(2, "0");
}

function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent =
    `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function updateUpdatedAt() {
  const now = new Date();
  document.getElementById("updatedAt").textContent =
    `Mise à jour : ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function minutesLabel(minutes) {
  if (minutes <= 0) return "à l'approche";
  if (minutes === 1) return "1 min";
  return `${minutes} min`;
}

function renderTimes(containerId, departures) {
  const container = document.getElementById(containerId);

  if (!departures || departures.length === 0) {
    container.innerHTML = `<div class="empty">Aucun passage</div>`;
    return;
  }

  const now = new Date();

  container.innerHTML = departures.slice(0,3).map((dep,index)=>{

    const future = new Date(now.getTime() + dep.minutes * 60000);

    const h = String(future.getHours()).padStart(2,'0');
    const m = String(future.getMinutes()).padStart(2,'0');

    return `
      <div class="time-card ${index===0 ? "main":""}">
        <div class="time-value">${h}:${m}</div>
        <div class="wait-value">${dep.minutes} min</div>
      </div>
    `;
  }).join("");
}

async function loadDepartures() {
  try {
    const response = await fetch("/api/departures");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    renderTimes("departures-a-chartres", data.a1 || []);
    renderTimes("departures-6-chartres", data.six2 || []);
    renderTimes("departures-a-luce", data.a2 || []);
    renderTimes("departures-6-luce", data.six1 || []);

    updateUpdatedAt();
    document.getElementById("statusLeft").textContent = "● Service OK";
    document.getElementById("statusRight").textContent = "● Réseau OK";
  } catch (error) {
    document.getElementById("departures-a-chartres").innerHTML =
      `<div class="error">Erreur de chargement</div>`;
    document.getElementById("departures-6-chartres").innerHTML =
      `<div class="error">Erreur de chargement</div>`;
    document.getElementById("departures-a-luce").innerHTML =
      `<div class="error">Erreur de chargement</div>`;
    document.getElementById("departures-6-luce").innerHTML =
      `<div class="error">Erreur de chargement</div>`;

    document.getElementById("statusLeft").textContent = "● Service indisponible";
    document.getElementById("statusRight").textContent = "● Vérifier la connexion";
    console.error(error);
  }
}

updateClock();
setInterval(updateClock, 1000);

loadDepartures();
setInterval(loadDepartures, CONFIG.refreshMs);