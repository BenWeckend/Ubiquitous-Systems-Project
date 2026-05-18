const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const info = document.getElementById('details');
const status = document.getElementById('systemStatus');

const companyInfo = {
  material: {
    title: 'Erz & Rohstoffe',
    text: 'Sachsen besitzt eine lange Bergbau-Tradition. Rohstoffe bilden die Grundlage moderner Industrieprozesse und High-Tech-Produktion.'
  },
  sensor: {
    title: 'Unternehmen z: Sensorik',
    text: 'Sensorik-Unternehmen aus Sachsen erfassen Temperatur, Druck oder Materialdaten in Echtzeit und liefern Daten für intelligente Systeme.'
  },
  software: {
    title: 'Unternehmen x: Datenanalyse',
    text: 'Analyseplattformen interpretieren Produktionsdaten und optimieren Prozesse in Echtzeit:ein zentraler Bestandteil von Industrie 4.0.'
  },
  machine: {
    title: 'Unternehmen y: Maschinenbau',
    text: 'Maschinenbauunternehmen in Sachsen nutzen Daten und Automatisierung, um effiziente Produktionsprozesse umzusetzen.'
  }
};

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

function showInfo(type) {
  info.innerHTML = `
    <strong>${companyInfo[type].title}</strong><br><br>
    ${companyInfo[type].text}
  `;
}

function getColor(type) {
  switch(type) {
    case 'material': return '#a855f7';
    case 'sensor': return '#38bdf8';
    case 'software': return '#22c55e';
    case 'machine': return '#f97316';
  }
}

function drawGrid() {
  ctx.strokeStyle = 'rgba(255,255,255,0.03)';

  for(let x = 0; x < canvas.width; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x,0);
    ctx.lineTo(x,canvas.height);
    ctx.stroke();
  }

  for(let y = 0; y < canvas.height; y += 50) {
    ctx.beginPath();
    ctx.moveTo(0,y);
    ctx.lineTo(canvas.width,y);
    ctx.stroke();
  }
}

function drawConnections() {
  for(let i = 0; i < nodes.length; i++) {
    for(let j = i + 1; j < nodes.length; j++) {

      const gradient = ctx.createLinearGradient(
        nodes[i].x,
        nodes[i].y,
        nodes[j].x,
        nodes[j].y
      );

      gradient.addColorStop(0, getColor(nodes[i].type));
      gradient.addColorStop(1, getColor(nodes[j].type));

      ctx.beginPath();
      ctx.moveTo(nodes[i].x, nodes[i].y);
      ctx.lineTo(nodes[j].x, nodes[j].y);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }
}

function drawNodes() {
  nodes.forEach(node => {

    ctx.beginPath();
    ctx.arc(node.x, node.y, 34, 0, Math.PI * 2);
    ctx.fillStyle = getColor(node.type);
    ctx.shadowColor = getColor(node.type);
    ctx.shadowBlur = 20;
    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(node.type.toUpperCase(), node.x, node.y + 4);
  });
}

function checkSystem() {
  const types = nodes.map(n => n.type);

  const complete =
    types.includes('material') &&
    types.includes('sensor') &&
    types.includes('software') &&
    types.includes('machine');

  if(complete) {
    status.innerHTML = '✔ Vernetzte Produktionskette aktiv';
    status.style.color = '#22c55e';

    info.innerHTML = `
      <strong>Industrieprozess aktiv</strong><br><br>
      Rohstoffe werden verarbeitet, Sensoren erfassen Daten,
      KI analysiert Produktionsabläufe und Maschinen reagieren
      in Echtzeit. Dadurch entsteht ein intelligentes,
      vernetztes Industriesystem in Sachsen.
    `;
  } else {
    status.innerHTML = '⚠ System unvollständig';
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