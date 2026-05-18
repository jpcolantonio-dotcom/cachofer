// CachoFer Service Worker - Background GPS
const CACHE_NAME = 'cachofer-v7';
const SUPA_URL = "https://jnhwgtvzldxnqyliuyog.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuaHdndHZ6bGR4bnF5bGl1eW9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMjQwMjMsImV4cCI6MjA5NDYwMDAyM30.0dJvN8eVjyB8joit-wrMMp3Hj__EV4EjQMlsrChdfWs";

let gpsInterval = null;
let currentDriverId = null;
let lastSent = 0;

// Install
self.addEventListener('install', e => {
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// Message from app
self.addEventListener('message', e => {
  const { type, driverId } = e.data || {};

  if(type === 'START_GPS' && driverId) {
    currentDriverId = driverId;
    console.log('[SW] GPS tracking started for', driverId);
    startGPS();
  }

  if(type === 'STOP_GPS') {
    currentDriverId = null;
    stopGPS();
    console.log('[SW] GPS tracking stopped');
  }
});

function startGPS() {
  if(gpsInterval) clearInterval(gpsInterval);

  // Usar Periodic Background Sync si está disponible
  // Fallback: setInterval (funciona mientras SW está activo)
  gpsInterval = setInterval(async () => {
    if(!currentDriverId) return;
    const now = Date.now();
    if(now - lastSent < 15000) return;
    lastSent = now;
    await sendGPS();
  }, 16000);
}

function stopGPS() {
  if(gpsInterval) { clearInterval(gpsInterval); gpsInterval = null; }
}

async function sendGPS() {
  if(!currentDriverId) return;

  try {
    // Obtener clientes activos para enviarles la ubicación
    const allClients = await clients.matchAll({ type: 'window' });

    // Pedir al cliente la ubicación actual via postMessage
    for(const client of allClients) {
      client.postMessage({ type: 'REQUEST_LOCATION' });
    }
  } catch(e) {
    console.log('[SW] sendGPS error:', e);
  }
}

// Recibir ubicación del cliente y enviar a Supabase
self.addEventListener('message', async e => {
  const { type, lat, lng, driverId } = e.data || {};

  if(type === 'LOCATION_RESPONSE' && lat && lng && driverId) {
    try {
      await fetch(SUPA_URL + "/rest/v1/drivers?id=eq." + driverId, {
        method: "PATCH",
        headers: {
          "apikey": SUPA_KEY,
          "Authorization": "Bearer " + SUPA_KEY,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          current_lat: lat,
          current_lng: lng,
          location_updated_at: new Date().toISOString(),
          status: "en_ruta"
        })
      });
      console.log('[SW] GPS sent:', lat, lng);
    } catch(e) {
      console.log('[SW] GPS send error:', e);
    }
  }
});

// Background Sync para cuando vuelve la conexión
self.addEventListener('sync', e => {
  if(e.tag === 'gps-sync') {
    e.waitUntil(sendGPS());
  }
});
