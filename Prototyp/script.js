const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const info = document.getElementById('details');
const status = document.getElementById('systemStatus');

// ======================= ERWEITERTE FIRMENINFOS =======================
const companyInfo = {
  bergbau: {
    title: 'Bergbau Sachsen',
    role: 'Rohstoffe',
    text: 'Liefert Erze, Metalle und Rohstoffe für die sächsische Industrie.',
    products: ['Eisenerz', 'Metalle (Kupfer, Zinn)', 'Industrieminerale'],
    logo: 'logos/Sachsen.png',
    lat: 50.91516750977242,
    lng: 13.345313731179036,
    color: '#a855f7'
  },
  gemac: {
    title: 'GEMAC Chemnitz',
    role: 'Sensorik',
    text: 'Neigungssensoren und Diagnosesysteme für anspruchsvolle Umgebungen.',
    products: ['Neigungssensoren', 'IMUs', 'Feldbus-Diagnosesysteme'],
    logo: 'logos/gemac.png',
    color: '#38bdf8'
  },
  i2s: {
    title: 'i2S Dresden',
    role: 'Sensorik',
    text: 'Intelligente industrielle Sensorsysteme für Echtzeit-Monitoring.',
    products: ['Smart Sensors', 'Datenvorverarbeitung', 'Industrielle Messtechnik'],
    logo: 'logos/i2s.png',
    color: '#0ea5e9'
  },
  micromac: {
    title: '3D-Micromac AG',
    role: 'Lasertechnik',
    text: 'Lasersysteme und Sensorfertigung auf Mikroebene.',
    products: ['Laser-Mikrobearbeitung', 'Präzisionsanlagen', 'Sensorfertigung'],
    logo: 'logos/3dmicromac.png',
    color: '#06b6d4'
  },
  flowlogix: {
    title: 'FlowLogiX',
    role: 'KI Analyse',
    text: 'Digital Twins und KI-gestützte Produktionsanalyse.',
    products: ['Digital Twin Plattform', 'KI-Analyse Engine', 'Echtzeit-Dashboard'],
    logo: 'logos/flowlogix.png',
    color: '#22c55e'
  },
  kontron: {
    title: 'Kontron AIS',
    role: 'Datenverarbeitung',
    text: 'Verarbeitung industrieller Sensordaten am Edge.',
    products: ['Edge Gateways', 'Industrie-PCs', 'Datenlogger'],
    logo: 'logos/kontron.png',
    color: '#10b981'
  },
  wesoba: {
    title: 'WESOBA',
    role: 'Maschinenbau',
    text: 'Robotik und Sondermaschinen für die Automobil- und Elektroindustrie.',
    products: ['Roboterzellen', 'Sondermaschinen', 'Automatisierungslösungen'],
    logo: 'logos/wesoba.png',
    color: '#f97316'
  },
  xenon: {
    title: 'XENON',
    role: 'Automation',
    text: 'Automatisierungsanlagen und Steuerungssysteme für intelligente Fabriken.',
    products: ['Steuerungssysteme', 'Robotik-Integration', 'Produktionsanlagen'],
    logo: 'logos/xenon.png',
    color: '#fb923c'
  },
  siemens: {
    title: 'Siemens Energy',
    role: 'Energieanlagen',
    text: 'Turbinen, Netzleittechnik und Energiemanagement für die Industrie.',
    products: ['Gasturbinen', 'Netzleittechnik', 'Energiemanagement-Systeme'],
    logo: 'logos/siemens.png',
    color: '#f59e0b'
  },
  sunfire: {
    title: 'Sunfire',
    role: 'Wasserstoff',
    text: 'Nachhaltige Energieversorgung durch Elektrolyseure und Brennstoffzellen.',
    products: ['Elektrolyseure', 'Brennstoffzellen', 'Power-to-X Anlagen'],
    logo: 'logos/sunfire.png',
    color: '#eab308'
  }
};

const relations = [
  ['bergbau', 'gemac', 'Materialüberwachung'],
  ['bergbau', 'i2s', 'Maschinendaten'],
  ['bergbau', 'micromac', 'Präzisionsbearbeitung'],
  ['gemac', 'flowlogix', 'Sensordaten'],
  ['gemac', 'kontron', 'Diagnosedaten'],
  ['i2s', 'flowlogix', 'Messdaten'],
  ['i2s', 'kontron', 'Realtime Daten'],
  ['micromac', 'flowlogix', 'Laserdaten'],
  ['flowlogix', 'xenon', 'Automatisierung'],
  ['flowlogix', 'wesoba', 'Produktionsoptimierung'],
  ['kontron', 'xenon', 'Steuerdaten'],
  ['kontron', 'siemens', 'Industrieinterfaces'],
  ['sunfire', 'siemens', 'Wasserstoffenergie'],
  ['sunfire', 'xenon', 'Energieversorgung'],
  ['sunfire', 'wesoba', 'Nachhaltige Produktion'],
  ['xenon', 'wesoba', 'Produktionssystem'],
  ['siemens', 'xenon', 'Energieinfrastruktur']
];

let nodes = [];
let draggingNode = null;
let dragOffsetX = 0, dragOffsetY = 0;
let connectionOffset = 0;

// ======================= HILFSFUNKTIONEN =======================
function getNodeAtPosition(x, y) {
  return nodes.find(node => {
    const dx = node.x - x;
    const dy = node.y - y;
    return Math.sqrt(dx*dx + dy*dy) < 38;
  });
}

function getActiveConnections(nodeType, allNodes) {
  const connections = [];
  const nodeTypesInNetwork = allNodes.map(n => n.type);
  relations.forEach(rel => {
    let source, target, label, partnerType;
    if (rel[0] === nodeType && nodeTypesInNetwork.includes(rel[1])) {
      source = rel[0]; target = rel[1]; label = rel[2]; partnerType = target;
      connections.push({ from: source, to: target, label, partnerType });
    } else if (rel[1] === nodeType && nodeTypesInNetwork.includes(rel[0])) {
      source = rel[0]; target = rel[1]; label = rel[2]; partnerType = source;
      connections.push({ from: source, to: target, label, partnerType });
    }
  });
  return connections;
}

// ======================= POPUP MIT GROSSEM LOGO =======================
function showCompanyPopup(node) {
  const company = companyInfo[node.type];
  if (!company) return;

  const activeConns = getActiveConnections(node.type, nodes);

  // HTML für Verbindungen
  let connectionsHtml = '';
  if (activeConns.length === 0) {
    connectionsHtml = '<p style="opacity:0.7; margin-top:0;">Keine aktiven Verbindungen im Netzwerk</p>';
  } else {
    connectionsHtml = '<div style="margin-top:8px;">';
    activeConns.forEach(conn => {
      const partner = companyInfo[conn.partnerType];
      const partnerColor = partner ? partner.color : '#ccc';
      connectionsHtml += `
        <div class="connection-item">
          <span style="display:inline-block; width:14px; height:14px; border-radius:50%; background:${partnerColor};"></span>
          <strong>${partner ? partner.title : conn.partnerType}</strong>
          <span style="margin-left:auto; opacity:0.8;">→ ${conn.label}</span>
        </div>
      `;
    });
    connectionsHtml += '</div>';
  }

  // Produkte-Liste
  const productsList = company.products && company.products.length
    ? `<ul>${company.products.map(p => `<li>${p}</li>`).join('')}</ul>`
    : '<p>Keine Produktangaben</p>';

  // Fallback bei fehlendem Logo (Data-URL mit Firmenfarbe)
  const logoFallback = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='${encodeURIComponent(company.color)}' opacity='0.3'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='white' font-size='14'%3ELogo%3C/text%3E%3C/svg%3E`;

  info.innerHTML = `
    <div class="company-header">
      <img class="company-logo" src="${company.logo}" onerror="this.src='${logoFallback}'" alt="Logo">
      <div class="company-title">
        <h2 style="color:${company.color};">${company.title}</h2>
        <div class="company-role">${company.role}</div>
      </div>
    </div>

    <p>${company.text}</p>

    <h3>📦 Produkte & Technologien</h3>
    ${productsList}

    <h3>🔗 Vernetzte Partner (aktiv)</h3>
    ${connectionsHtml}
  `;
}

// ======================= CANVAS ZEICHNEN =======================
function getColor(type) { return companyInfo[type].color; }

function drawGrid() {
  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  ctx.lineWidth = 1;
  for(let x = 0; x < canvas.width; x += 60) {
    ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); ctx.stroke();
  }
  for(let y = 0; y < canvas.height; y += 60) {
    ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); ctx.stroke();
  }
}

function drawConnections() {
  relations.forEach(rel => {
    const a = nodes.find(n => n.type === rel[0]);
    const b = nodes.find(n => n.type === rel[1]);
    if(a && b) {
      const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      grad.addColorStop(0, getColor(a.type));
      grad.addColorStop(1, getColor(b.type));
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 4;
      ctx.setLineDash([20,15]);
      ctx.lineDashOffset = connectionOffset;
      ctx.stroke();
      ctx.setLineDash([]);
      const midX = (a.x+b.x)/2, midY = (a.y+b.y)/2;
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(rel[2], midX, midY-10);
    }
  });
}

function drawNodes() {
  nodes.forEach(node => {
    const c = companyInfo[node.type];
    ctx.beginPath();
    ctx.arc(node.x, node.y, 38, 0, Math.PI*2);
    ctx.fillStyle = c.color;
    ctx.shadowColor = c.color;
    ctx.shadowBlur = 25;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'white';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(c.title.split(' ')[0], node.x, node.y+4);
  });
}

function checkSystem() {
  const types = nodes.map(n => n.type);
  const complete = types.includes('bergbau') && types.includes('gemac') &&
                   types.includes('flowlogix') && types.includes('xenon') &&
                   types.includes('sunfire');
  if(complete) {
    status.innerHTML = '✔ Vernetztes Industrie-Ökosystem aktiv';
    status.style.color = '#22c55e';
    // Nur wenn kein Popup aktiv ist (also Details keinen Firmenheader haben) – optional
    if (!info.querySelector('.company-header')) {
      info.innerHTML = `
        <strong style="font-size:18px">Industrie-Netzwerk Sachsen</strong><br><br>
        Rohstoffe aus Sachsen werden verarbeitet, Sensorik überwacht Maschinen,
        KI analysiert Produktionsdaten, Automatisierung steuert Produktionssysteme
        und nachhaltige Energie versorgt die Industrie.<br><br>
        Dadurch entsteht ein intelligentes, vernetztes Industrie-Ökosystem.
      `;
    }
  } else {
    status.innerHTML = '⚠ Netzwerk unvollständig';
    status.style.color = '#ef4444';
  }
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawGrid();
  drawConnections();
  drawNodes();
  checkSystem();
}

// ======================= INTERAKTION =======================
const blocks = document.querySelectorAll('.block');
blocks.forEach(block => {
  block.addEventListener('dragstart', e => e.dataTransfer.setData('type', block.dataset.type));
});

canvas.addEventListener('dragover', e => e.preventDefault());
canvas.addEventListener('drop', e => {
  const type = e.dataTransfer.getData('type');
  const block = document.querySelector(
    `.block[data-type="${type}"]`
  );
  if(block) block.remove();
  const newNode = { x: e.clientX, y: e.clientY, type };
  nodes.push(newNode);
  showCompanyPopup(newNode);
  if(companyInfo[type].lat && companyInfo[type].lng ) addCompanyToMap(type);
  draw();
});

canvas.addEventListener('mousedown', e => {
  const n = getNodeAtPosition(e.clientX, e.clientY);
  if(!n) return;
  draggingNode = n;
  dragOffsetX = n.x - e.clientX;
  dragOffsetY = n.y - e.clientY;
});
canvas.addEventListener('mousemove', e => {
  if(!draggingNode) return;
  draggingNode.x = e.clientX + dragOffsetX;
  draggingNode.y = e.clientY + dragOffsetY;
  draw();
});
canvas.addEventListener('mouseup', () => draggingNode = null);
canvas.addEventListener('click', e => {
  const n = getNodeAtPosition(e.clientX, e.clientY);
  if(n) showCompanyPopup(n);
});

// ======================= RESIZE & ANIMATION =======================
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
});

const map = new maplibregl.Map({
  container: "map",
  style: {
    version: 8,
    sources: {
      osm: {
        type: "raster",
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
        tileSize: 256
      }
    },
    layers: [
      {
        id: "osm",
        type: "raster",
        source: "osm"
      }
    ]
  },
  center: [13.344060382241171, 50.92051370161715],
  zoom: 14
});

const markers = new Map();

// set museum as starting point and reference for all other markers
const museumMarker = document.createElement('div');
museumMarker.style.width = "15px";
museumMarker.style.height = "15px";
museumMarker.style.borderRadius = "50%";
museumMarker.style.backgroundColor = 'red';
museumMarker.style.border = "2px solid white";

markers.set('museum', new maplibregl.Marker({element: museumMarker})
  .setLngLat([13.344060382241171, 50.92051370161715])
  .addTo(map)
);

function addCompanyToMap(type) {
  const company = companyInfo[type];
  const marker = new maplibregl.Marker()
    .setLngLat([company.lng, company.lat])
    .addTo(map);

  markers.set(type, marker);

  updateBounds();
}

function removeCompanyFromMap(type) {
  const marker = markers.get(type);

  if (marker) {
    marker.remove();
    markers.delete(type);
  }

  updateBounds();
}

function updateBounds() {
  if (markers.size === 0) return;

  const bounds = new maplibregl.LngLatBounds();

  markers.forEach(marker => {
    bounds.extend(marker.getLngLat());
  });

  map.fitBounds(bounds, {
    padding: 50,
    maxZoom: 14,
    duration: 3000
  });
}

let lastTime = 0;
function animate(time) {
  const dt = time - lastTime;
  lastTime = time;
  const speed = 0.05;
  connectionOffset = (connectionOffset - dt * speed) % 35;
  draw();
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
draw();