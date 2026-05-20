
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const info = document.getElementById('details');
const status = document.getElementById('systemStatus');
const companyInfo = {

  bergbau: {
    title: 'Bergbau Sachsen',
    role: 'Rohstoffe',
    text: 'Liefert Erze, Metalle und Rohstoffe.',
    color: '#a855f7'
  },

  gemac: {
    title: 'GEMAC Chemnitz',
    role: 'Sensorik',
    text: 'Neigungssensoren und Diagnosesysteme.',
    color: '#38bdf8'
  },

  i2s: {
    title: 'i2S Dresden',
    role: 'Sensorik',
    text: 'Intelligente industrielle Sensorsysteme.',
    color: '#0ea5e9'
  },

  micromac: {
    title: '3D-Micromac AG',
    role: 'Lasertechnik',
    text: 'Lasersysteme und Sensorfertigung.',
    color: '#06b6d4'
  },

  flowlogix: {
    title: 'FlowLogiX',
    role: 'KI Analyse',
    text: 'Digital Twins und Produktionsanalyse.',
    color: '#22c55e'
  },

  kontron: {
    title: 'Kontron AIS',
    role: 'Datenverarbeitung',
    text: 'Verarbeitung industrieller Sensordaten.',
    color: '#10b981'
  },

  wesoba: {
    title: 'WESOBA',
    role: 'Maschinenbau',
    text: 'Robotik und Sondermaschinen.',
    color: '#f97316'
  },

  xenon: {
    title: 'XENON',
    role: 'Automation',
    text: 'Automatisierungsanlagen.',
    color: '#fb923c'
  },

  siemens: {
    title: 'Siemens Energy',
    role: 'Energieanlagen',
    text: 'Turbinen und Energieinfrastruktur.',
    color: '#f59e0b'
  },

  sunfire: {
    title: 'Sunfire',
    role: 'Wasserstoff',
    text: 'Nachhaltige Energieversorgung.',
    color: '#eab308'
  }

};

const relations = [

  // Rohstoffe -> Sensorik
  ['bergbau', 'gemac', 'Materialüberwachung'],
  ['bergbau', 'i2s', 'Maschinendaten'],
  ['bergbau', 'micromac', 'Präzisionsbearbeitung'],

  // Sensorik -> KI
  ['gemac', 'flowlogix', 'Sensordaten'],
  ['gemac', 'kontron', 'Diagnosedaten'],
  ['i2s', 'flowlogix', 'Messdaten'],
  ['i2s', 'kontron', 'Realtime Daten'],
  ['micromac', 'flowlogix', 'Laserdaten'],

  // KI -> Maschinenbau
  ['flowlogix', 'xenon', 'Automatisierung'],
  ['flowlogix', 'wesoba', 'Produktionsoptimierung'],
  ['kontron', 'xenon', 'Steuerdaten'],
  ['kontron', 'siemens', 'Industrieinterfaces'],

  // Energie
  ['sunfire', 'siemens', 'Wasserstoffenergie'],
  ['sunfire', 'xenon', 'Energieversorgung'],
  ['sunfire', 'wesoba', 'Nachhaltige Produktion'],

  // Maschinenbau
  ['xenon', 'wesoba', 'Produktionssystem'],
  ['siemens', 'xenon', 'Energieinfrastruktur']

];

let nodes = [];

const blocks = document.querySelectorAll('.block');

blocks.forEach(block => {

  block.addEventListener('dragstart', e => {
    e.dataTransfer.setData('type', block.dataset.type);
  });

});

canvas.addEventListener('dragover', e => e.preventDefault());

canvas.addEventListener('drop', e => {

  const type = e.dataTransfer.getData('type');

  nodes.push({
    x: e.clientX,
    y: e.clientY,
    type
  });

  showInfo(type);
  draw();

});

canvas.addEventListener('click', e => {

  const clickedNode = nodes.find(node => {

    const dx = node.x - e.clientX;
    const dy = node.y - e.clientY;

    return Math.sqrt(dx **2 + dy **2) < 38;
  });

  if(clickedNode) {
    showInfo(clickedNode.type);
  }

});

function showInfo(type) {

  const company = companyInfo[type];

  info.innerHTML = `
    <strong style="font-size:18px">
      ${company.title}
    </strong>

    <br>

    <span style="color:${company.color}">
      ${company.role}
    </span>

    <br><br>

    ${company.text}
  `;
}

function getColor(type) {
  return companyInfo[type].color;
}

function drawGrid() {

  ctx.strokeStyle = 'rgba(255,255,255,0.03)';

  for(let x = 0; x < canvas.width; x += 60) {

    ctx.beginPath();
    ctx.moveTo(x,0);
    ctx.lineTo(x,canvas.height);
    ctx.stroke();
  }

  for(let y = 0; y < canvas.height; y += 60) {

    ctx.beginPath();
    ctx.moveTo(0,y);
    ctx.lineTo(canvas.width,y);
    ctx.stroke();
  }
}

function drawConnections() {

  relations.forEach(rel => {

    const a = nodes.find(n => n.type === rel[0]);
    const b = nodes.find(n => n.type === rel[1]);

    if(a && b) {

      const gradient = ctx.createLinearGradient(
        a.x,
        a.y,
        b.x,
        b.y
      );

      gradient.addColorStop(0, getColor(a.type));
      gradient.addColorStop(1, getColor(b.type));

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 4;
      ctx.stroke();

      const midX = (a.x + b.x) / 2;
      const midY = (a.y + b.y) / 2;

      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';

      ctx.fillText(rel[2], midX, midY - 10);
    }

  });

}

function drawNodes() {

  nodes.forEach(node => {

    const company = companyInfo[node.type];

    ctx.beginPath();

    ctx.arc(node.x, node.y, 38, 0, Math.PI * 2);

    ctx.fillStyle = company.color;

    ctx.shadowColor = company.color;
    ctx.shadowBlur = 25;

    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.fillStyle = 'white';

    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'center';

    ctx.fillText(
      company.title.split(' ')[0],
      node.x,
      node.y + 4
    );

  });

}

function checkSystem() {

  const types = nodes.map(n => n.type);

  const complete =
    types.includes('bergbau') &&
    types.includes('gemac') &&
    types.includes('flowlogix') &&
    types.includes('xenon') &&
    types.includes('sunfire');

  if(complete) {

    status.innerHTML =
      '✔ Vernetztes Industrie-Ökosystem aktiv';

    status.style.color = '#22c55e';

    info.innerHTML = `
      <strong style="font-size:18px">
        Industrie-Netzwerk Sachsen
      </strong>

      <br><br>

      Rohstoffe aus Sachsen werden verarbeitet,
      Sensorik überwacht Maschinen,
      KI analysiert Produktionsdaten,
      Automatisierung steuert Produktionssysteme
      und nachhaltige Energie versorgt die Industrie.

      <br><br>

      Dadurch entsteht ein intelligentes,
      vernetztes Industrie-Ökosystem.
    `;

  } else {

    status.innerHTML =
      '⚠ Netzwerk unvollständig';

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

window.addEventListener('resize', () => {

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  draw();

});

draw();
