console.log("js loaded")
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


// skills-js
const skillsData = {
  languages: [
    { name: "C++", level: "high" },
    { name: "C", level: "high" },
    { name: "JavaScript", level: "mid" },
    { name: "Java", level: "mid" },
    { name: "PHP", level: "low" },
    { name: "Python", level: "low" },
  ],
  frameworks: [
    { name: "React.js", level: "mid" },
    { name: "Node.js", level: "mid" },
    { name: "Express.js", level: "mid" },
    { name: "Tailwind CSS", level: "mid" },
  ],
  tools: [
    { name: "Git", level: "mid" },
    { name: "MySQL", level: "mid" },
    { name: "MongoDB", level: "low" },
  ],
  systems: [
    { name: "Linux", level: "mid" },
    { name: "Blender", level: "mid" },
    { name: "Bash", level: "low" },
    { name: "Unity", level: "low" },
  ],
};
const sizeMap = { high: 140, mid: 100, low: 75 };

const titleMap = {
  languages: "Languages",
  frameworks: "Frameworks & Libraries",
  tools: "Databases & Tools",
  systems: "Systems & Platforms",
};

function placeBubbles(skills) {
  const container = document.getElementById("bubbles-container");
  container.innerHTML = "";

  const placed = [];

  skills.forEach((skill, i) => {
    const size = sizeMap[skill.level];
    const bubble = document.createElement("div");
    bubble.classList.add("bubble");
    bubble.textContent = skill.name;
    bubble.style.width = size + "px";
    bubble.style.height = size + "px";

    // simple scatter with overlap avoidance
    let x, y, attempts = 0;
    do {
      x = Math.random() * (460 - size);
      y = Math.random() * (300 - size);
      attempts++;
    } while (
      attempts < 100 &&
      placed.some(
        (p) =>
          Math.abs(p.x - x) < (p.size + size) / 2 + 16 &&
          Math.abs(p.y - y) < (p.size + size) / 2 + 16
      )
    );

    placed.push({ x, y, size });
    bubble.style.left = x + "px";
    bubble.style.top = y + "px";

    container.appendChild(bubble);

    // staggered pop-in animation
    setTimeout(() => bubble.classList.add("visible"), i * 80);
  });
}

// open modal
document.querySelectorAll(".skill-category").forEach((card) => {
  card.addEventListener("click", () => {
    const category = card.dataset.category;
    document.getElementById("modal-title").textContent = titleMap[category];
    placeBubbles(skillsData[category]);
    document.getElementById("skills-modal").classList.add("active");
  });
});

// close modal
document.querySelector(".modal-close").addEventListener("click", () => {
  document.getElementById("skills-modal").classList.remove("active");
});

document.getElementById("skills-modal").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) {
    document.getElementById("skills-modal").classList.remove("active");
  }
});

// Graph Canvas
const canvas = document.getElementById('graph-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// create dots
const DOT_COUNT = 80;
const dots = [];

function createDots() {
  for (let i = 0; i < DOT_COUNT; i++) {
    dots.push({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  vx: (Math.random() - 0.5) * 0.4,
  vy: (Math.random() - 0.5) * 0.4,
  radius: Math.random() * 2 + 1,
  glowTimer: 0,        // counts down when glowing
  connections: new Set() // tracks current connections
});
  }
}

createDots();

// draw dots

function drawDots() {
  dots.forEach(dot => {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);

    if (dot.glowTimer > 0) {
      const intensity = dot.glowTimer / 40; // fades as timer counts down
      ctx.fillStyle = `rgba(240, 165, 0, ${intensity})`;
      ctx.shadowColor = 'rgba(240, 165, 0, 0.8)';
      ctx.shadowBlur = 10 * intensity;
      dot.glowTimer--;
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.shadowBlur = 0;
    }

    ctx.fill();
  });

  ctx.shadowBlur = 0;
}

function moveDots() {
  dots.forEach(dot => {
    dot.x += dot.vx;
    dot.y += dot.vy;
    
    // bounce off edges
    if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
    if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;
  });
}


//draw lines

const CONNECTION_DISTANCE = 120;

function drawLines() {
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const dx = dots[i].x - dots[j].x;
      const dy = dots[i].y - dots[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < CONNECTION_DISTANCE) {
        // new connection formed — trigger glow
        if (!dots[i].connections.has(j)) {
          dots[i].connections.add(j);
          dots[j].connections.add(i);
          dots[i].glowTimer = 40; // glow for 40 frames
          dots[j].glowTimer = 40;
        }

        const opacity = 1 - distance / CONNECTION_DISTANCE;
        ctx.beginPath();
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(dots[j].x, dots[j].y);
        ctx.strokeStyle = `rgba(240, 165, 0, ${opacity * 0.4})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

      } else {
        // connection broken — remove from tracking
        dots[i].connections.delete(j);
        dots[j].connections.delete(i);
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  moveDots();
  drawLines();
  drawDots();
  requestAnimationFrame(animate);
}

animate();

// Project Graph Animation
const projectCanvas = document.getElementById('graph-project-canvas');
const pCtx = projectCanvas.getContext('2d');

function resizeProjectCanvas() {
  projectCanvas.width = projectCanvas.offsetWidth;
  projectCanvas.height = projectCanvas.offsetHeight;
}

resizeProjectCanvas();
window.addEventListener('resize', resizeProjectCanvas);

// fixed nodes — positions are percentages of canvas size
const projectNodes = [
  { id: 0,  label: 'A', px: 0.5,  py: 0.08 },
  { id: 1,  label: 'B', px: 0.2,  py: 0.22 },
  { id: 2,  label: 'C', px: 0.78, py: 0.22 },
  { id: 3,  label: 'D', px: 0.08, py: 0.45 },
  { id: 4,  label: 'E', px: 0.42, py: 0.38 },
  { id: 5,  label: 'F', px: 0.72, py: 0.45 },
  { id: 6,  label: 'G', px: 0.25, py: 0.62 },
  { id: 7,  label: 'H', px: 0.58, py: 0.60 },
  { id: 8,  label: 'I', px: 0.88, py: 0.62 },
  { id: 9,  label: 'J', px: 0.15, py: 0.80 },
  { id: 10, label: 'K', px: 0.5,  py: 0.82 },
  { id: 11, label: 'L', px: 0.82, py: 0.82 },
];

// edges — pairs of node ids with weights for Dijkstra
const projectEdges = [
  { from: 0,  to: 1,  weight: 4 },
  { from: 0,  to: 2,  weight: 3 },
  { from: 1,  to: 3,  weight: 2 },
  { from: 1,  to: 4,  weight: 5 },
  { from: 2,  to: 4,  weight: 1 },
  { from: 2,  to: 5,  weight: 6 },
  { from: 3,  to: 6,  weight: 3 },
  { from: 4,  to: 6,  weight: 2 },
  { from: 4,  to: 7,  weight: 4 },
  { from: 5,  to: 7,  weight: 3 },
  { from: 5,  to: 8,  weight: 2 },
  { from: 6,  to: 9,  weight: 5 },
  { from: 6,  to: 10, weight: 3 },
  { from: 7,  to: 10, weight: 2 },
  { from: 7,  to: 11, weight: 4 },
  { from: 8,  to: 11, weight: 1 },
  { from: 9,  to: 10, weight: 3 },
  { from: 10, to: 11, weight: 2 },
];

function getNodePos(node) {
  return {
    x: node.px * projectCanvas.width,
    y: node.py * projectCanvas.height,
  };
}


function drawProjectEdges(highlightedEdges = [], edgeColor = null) {
  projectEdges.forEach(edge => {
    const from = getNodePos(projectNodes[edge.from]);
    const to = getNodePos(projectNodes[edge.to]);
    const isHighlighted = highlightedEdges.some(
      e => (e.from === edge.from && e.to === edge.to) ||
           (e.from === edge.to && e.to === edge.from)
    );

    pCtx.beginPath();
    pCtx.moveTo(from.x, from.y);
    pCtx.lineTo(to.x, to.y);
    pCtx.strokeStyle = isHighlighted
      ? edgeColor || 'rgba(240, 165, 0, 0.9)'
      : 'rgba(255, 255, 255, 0.12)';
    pCtx.lineWidth = isHighlighted ? 2 : 1;
    pCtx.stroke();
  });
}

function drawProjectNodes(visitedIds = [], activeId = null, nodeColor = null) {
  projectNodes.forEach(node => {
    const { x, y } = getNodePos(node);
    const isVisited = visitedIds.includes(node.id);
    const isActive = node.id === activeId;

    // glow for active node
    if (isActive) {
      pCtx.beginPath();
      pCtx.arc(x, y, 16, 0, Math.PI * 2);
      pCtx.fillStyle = nodeColor
        ? nodeColor.replace('1)', '0.15)')
        : 'rgba(240, 165, 0, 0.15)';
      pCtx.fill();
    }

    // node circle
    pCtx.beginPath();
    pCtx.arc(x, y, 8, 0, Math.PI * 2);
    if (isActive) {
      pCtx.fillStyle = nodeColor || 'rgba(240, 165, 0, 1)';
      pCtx.shadowColor = nodeColor || 'rgba(240, 165, 0, 0.8)';
      pCtx.shadowBlur = 15;
    } else if (isVisited) {
      pCtx.fillStyle = nodeColor
        ? nodeColor.replace('1)', '0.5)')
        : 'rgba(240, 165, 0, 0.5)';
      pCtx.shadowBlur = 0;
    } else {
      pCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      pCtx.shadowBlur = 0;
    }
    pCtx.fill();
    pCtx.shadowBlur = 0;

    // node label
    pCtx.font = '11px monospace';
    pCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    pCtx.textAlign = 'center';
    pCtx.textBaseline = 'middle';
    pCtx.fillText(node.label, x, y);
  });
}

function drawAlgoLabel(label) {
  pCtx.font = '11px monospace';
  pCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  pCtx.textAlign = 'left';
  pCtx.textBaseline = 'top';
  pCtx.fillText(label, 10, 10);
}

const GOLD = 'rgba(240, 165, 0, 1)';
const BLUE = 'rgba(41, 121, 255, 1)';
const GREEN = 'rgba(76, 217, 100, 1)';

let animStartNode = 0;
let animTargetNode = 7;

function showStartTarget(start, target, callback) {
  let frame = 0;
  const duration = 60;
  const interval = setInterval(() => {
    pCtx.clearRect(0, 0, projectCanvas.width, projectCanvas.height);
    drawProjectEdges([], null);
    drawProjectNodes([], null, null);

    // glow start node gold
    const startPos = getNodePos(projectNodes[start]);
    pCtx.beginPath();
    pCtx.arc(startPos.x, startPos.y, 16, 0, Math.PI * 2);
    pCtx.fillStyle = 'rgba(240, 165, 0, 0.2)';
    pCtx.fill();
    pCtx.beginPath();
    pCtx.arc(startPos.x, startPos.y, 8, 0, Math.PI * 2);
    pCtx.fillStyle = GOLD;
    pCtx.shadowColor = GOLD;
    pCtx.shadowBlur = 15;
    pCtx.fill();
    pCtx.shadowBlur = 0;

    // glow target node blue
    const targetPos = getNodePos(projectNodes[target]);
    pCtx.beginPath();
    pCtx.arc(targetPos.x, targetPos.y, 16, 0, Math.PI * 2);
    pCtx.fillStyle = 'rgba(41, 121, 255, 0.2)';
    pCtx.fill();
    pCtx.beginPath();
    pCtx.arc(targetPos.x, targetPos.y, 8, 0, Math.PI * 2);
    pCtx.fillStyle = BLUE;
    pCtx.shadowColor = BLUE;
    pCtx.shadowBlur = 15;
    pCtx.fill();
    pCtx.shadowBlur = 0;

    // labels
    drawAlgoLabel('start → target');

    frame++;
    if (frame >= duration) {
      clearInterval(interval);
      callback();
    }
  }, 16);
}

function showStartOnly(start, callback) {
  let frame = 0;
  const interval = setInterval(() => {
    pCtx.clearRect(0, 0, projectCanvas.width, projectCanvas.height);
    drawProjectEdges([], null);
    drawProjectNodes([], null, null);

    const startPos = getNodePos(projectNodes[start]);
    pCtx.beginPath();
    pCtx.arc(startPos.x, startPos.y, 16, 0, Math.PI * 2);
    pCtx.fillStyle = 'rgba(240, 165, 0, 0.2)';
    pCtx.fill();
    pCtx.beginPath();
    pCtx.arc(startPos.x, startPos.y, 8, 0, Math.PI * 2);
    pCtx.fillStyle = GOLD;
    pCtx.shadowColor = GOLD;
    pCtx.shadowBlur = 15;
    pCtx.fill();
    pCtx.shadowBlur = 0;
    drawAlgoLabel('start');

    frame++;
    if (frame >= 60) {
      clearInterval(interval);
      callback();
    }
  }, 16);
}

function runBFS(startNode, targetNode) {
  let bfsVisited = [];
  let bfsQueue = [startNode];
  let bfsEdges = [];

  const interval = setInterval(() => {
    if (bfsQueue.length === 0) {
      clearInterval(interval);
      setTimeout(() => showStartTarget(startNode, targetNode, () => {
        runDijkstra(startNode, targetNode);
      }), 1000);
      return;
    }

    const current = bfsQueue.shift();
    bfsVisited.push(current);

    projectEdges.forEach(edge => {
      let neighbor = null;
      if (edge.from === current && !bfsVisited.includes(edge.to) && !bfsQueue.includes(edge.to)) {
        neighbor = edge.to;
        bfsEdges.push({ from: edge.from, to: edge.to });
      } else if (edge.to === current && !bfsVisited.includes(edge.from) && !bfsQueue.includes(edge.from)) {
        neighbor = edge.from;
        bfsEdges.push({ from: edge.from, to: edge.to });
      }
      if (neighbor !== null) bfsQueue.push(neighbor);
    });

    renderProjectCanvas('BFS', GOLD, bfsVisited, current, bfsEdges);
  }, 500);
}

function runDijkstra(startNode, targetNode) {
  const dist = {};
  const prev = {};
  const unvisited = new Set();

  projectNodes.forEach(n => {
    dist[n.id] = Infinity;
    prev[n.id] = null;
    unvisited.add(n.id);
  });
  dist[startNode] = 0;

  const explorationSteps = [];

  while (unvisited.size > 0) {
    let current = null;
    unvisited.forEach(id => {
      if (current === null || dist[id] < dist[current]) current = id;
    });
    if (dist[current] === Infinity) break;
    unvisited.delete(current);
    explorationSteps.push(current);

    projectEdges.forEach(edge => {
      let neighbor = null;
      let weight = edge.weight;
      if (edge.from === current) neighbor = edge.to;
      else if (edge.to === current) neighbor = edge.from;
      if (neighbor !== null && unvisited.has(neighbor)) {
        const alt = dist[current] + weight;
        if (alt < dist[neighbor]) {
          dist[neighbor] = alt;
          prev[neighbor] = current;
        }
      }
    });
  }

  // reconstruct shortest path to target
  const path = [];
  let current = targetNode;
  while (current !== null) {
    path.unshift(current);
    current = prev[current];
  }

  const pathEdges = [];
  for (let i = 0; i < path.length - 1; i++) {
    pathEdges.push({ from: path[i], to: path[i + 1] });
  }

  // phase 1 — show exploration
  let step = 0;
  const exploreEdges = [];
  const exploreInterval = setInterval(() => {
    if (step >= explorationSteps.length) {
      clearInterval(exploreInterval);

      // phase 2 — show final path in green
      let pathStep = 0;
      const pathInterval = setInterval(() => {
        renderProjectCanvas('Dijkstra — shortest path', GREEN, path.slice(0, pathStep + 1), path[pathStep], pathEdges.slice(0, pathStep));
        pathStep++;
        if (pathStep > path.length) {
          clearInterval(pathInterval);
          setTimeout(() => {
            const nextStart = Math.floor(Math.random() * projectNodes.length);
            let nextTarget;
            do {
              nextTarget = Math.floor(Math.random() * projectNodes.length);
            } while (nextTarget === nextStart);
            showStartOnly(nextStart, () => runBFS(nextStart, nextTarget));
          }, 2500);
        }
      }, 600);
      return;
    }

    const current = explorationSteps[step];

    // add edges from current to already explored nodes
    projectEdges.forEach(edge => {
      const alreadyVisited = explorationSteps.slice(0, step);
      if (edge.from === current && alreadyVisited.includes(edge.to)) {
        exploreEdges.push({ from: edge.from, to: edge.to });
      } else if (edge.to === current && alreadyVisited.includes(edge.from)) {
        exploreEdges.push({ from: edge.from, to: edge.to });
      }
    });

    // stop exploration display when target is reached
    if (current === targetNode) {
      step = explorationSteps.length; 
    }

    renderProjectCanvas('Dijkstra', BLUE, explorationSteps.slice(0, step + 1), current, exploreEdges);
    step++;
  }, 400);
}

function renderProjectCanvas(label, color, visited, active, edges) {
  pCtx.clearRect(0, 0, projectCanvas.width, projectCanvas.height);
  drawProjectEdges(edges, color);
  drawProjectNodes(visited, active, color);
  drawAlgoLabel(label);
}

// kick it off
showStartOnly(animStartNode, () => runBFS(animStartNode, animTargetNode));

// Bug Tracker Canvas
const bugCanvas = document.getElementById('bugtracker-canvas');
const bCtx = bugCanvas.getContext('2d');

function resizeBugCanvas() {
  bugCanvas.width = bugCanvas.offsetWidth;
  bugCanvas.height = bugCanvas.offsetHeight;
}

resizeBugCanvas();
window.addEventListener('resize', resizeBugCanvas);

const bugCategories = [
  { label: 'Critical', color: 'rgba(255, 80, 80, 0.9)',  value: 0, target: 0 },
  { label: 'High',     color: 'rgba(240, 165, 0, 0.9)', value: 0, target: 0 },
  { label: 'Medium',   color: 'rgba(41, 121, 255, 0.9)', value: 0, target: 0 },
  { label: 'Low',      color: 'rgba(76, 217, 100, 0.9)', value: 0, target: 0 },
];

const MAX_BUGS = 100;

function randomizeBugs() {
  bugCategories.forEach(cat => {
    cat.target = Math.floor(Math.random() * MAX_BUGS);
  });
}

function drawBugCanvas() {
  bCtx.clearRect(0, 0, bugCanvas.width, bugCanvas.height);

  const padding = 40;
  const barWidth = (bugCanvas.width - padding * 2) / bugCategories.length;
  const maxHeight = bugCanvas.height - padding * 2;

  // draw label at top
  bCtx.font = '11px monospace';
  bCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  bCtx.textAlign = 'left';
  bCtx.textBaseline = 'top';
  bCtx.fillText('Bug Dashboard', 10, 10);

  bugCategories.forEach((cat, i) => {
    const x = padding + i * barWidth + barWidth * 0.15;
    const w = barWidth * 0.40;
    const barHeight = (cat.value / MAX_BUGS) * maxHeight;
    const y = bugCanvas.height - padding - barHeight;

    // background bar
    bCtx.beginPath();
    bCtx.roundRect(x, bugCanvas.height - padding - maxHeight, w, maxHeight, 4);
    bCtx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    bCtx.fill();

    // filled bar
    bCtx.beginPath();
    bCtx.roundRect(x, y, w, barHeight, 4);
    bCtx.fillStyle = cat.color;
    bCtx.shadowColor = cat.color;
    bCtx.shadowBlur = 8;
    bCtx.fill();
    bCtx.shadowBlur = 0;

    // value on top of bar
    bCtx.font = '10px monospace';
    bCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    bCtx.textAlign = 'center';
    bCtx.textBaseline = 'bottom';
    bCtx.fillText(Math.round(cat.value), x + w / 2, y - 4);

    // label below bar
    bCtx.font = '10px monospace';
    bCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    bCtx.textBaseline = 'top';
    bCtx.fillText(cat.label, x + w / 2, bugCanvas.height - padding + 6);
  });
}

function animateBugBars() {
  let allReached = true;

  bugCategories.forEach(cat => {
    if (Math.abs(cat.value - cat.target) > 0.5) {
      cat.value += (cat.target - cat.value) * 0.05;
      allReached = false;
    } else {
      cat.value = cat.target;
    }
  });

  drawBugCanvas();

  if (allReached) {
    // pause then randomize again
    setTimeout(() => {
      randomizeBugs();
      animateBugBars();
    }, 2000);
  } else {
    requestAnimationFrame(animateBugBars);
  }
}

randomizeBugs();
animateBugBars();

// Process Monitor Canvas
const processCanvas = document.getElementById('process-canvas');
const procCtx = processCanvas.getContext('2d');

function resizeProcessCanvas() {
  processCanvas.width = processCanvas.offsetWidth;
  processCanvas.height = processCanvas.offsetHeight;
}

resizeProcessCanvas();
window.addEventListener('resize', resizeProcessCanvas);

const cpuData = [];
const memData = [];
const MAX_POINTS = 40;

// initialize with random data
for (let i = 0; i < MAX_POINTS; i++) {
  cpuData.push(Math.random() * 60 + 20);
  memData.push(Math.random() * 40 + 30);
}

function drawProcessCanvas() {
  procCtx.clearRect(0, 0, processCanvas.width, processCanvas.height);

  const padding = 30;
  const w = processCanvas.width - padding * 2;
  const h = processCanvas.height - padding * 2;

  // label
  procCtx.font = '11px monospace';
  procCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  procCtx.textAlign = 'left';
  procCtx.textBaseline = 'top';
  procCtx.fillText('Process Monitor', 10, 10);

  // draw grid lines
  for (let i = 0; i <= 4; i++) {
    const y = padding + (h / 4) * i;
    procCtx.beginPath();
    procCtx.moveTo(padding, y);
    procCtx.lineTo(padding + w, y);
    procCtx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    procCtx.lineWidth = 1;
    procCtx.stroke();

    // percentage labels
    procCtx.font = '9px monospace';
    procCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    procCtx.textAlign = 'right';
    procCtx.fillText(`${100 - i * 25}%`, padding - 4, y);
  }

  // draw line function
  function drawLine(data, color) {
    procCtx.beginPath();
    data.forEach((val, i) => {
      const x = padding + (i / (MAX_POINTS - 1)) * w;
      const y = padding + h - (val / 100) * h;
      i === 0 ? procCtx.moveTo(x, y) : procCtx.lineTo(x, y);
    });
    procCtx.strokeStyle = color;
    procCtx.lineWidth = 1.5;
    procCtx.shadowColor = color;
    procCtx.shadowBlur = 6;
    procCtx.stroke();
    procCtx.shadowBlur = 0;
  }

  // draw fill under line
  function drawFill(data, color) {
    procCtx.beginPath();
    data.forEach((val, i) => {
      const x = padding + (i / (MAX_POINTS - 1)) * w;
      const y = padding + h - (val / 100) * h;
      i === 0 ? procCtx.moveTo(x, y) : procCtx.lineTo(x, y);
    });
    procCtx.lineTo(padding + w, padding + h);
    procCtx.lineTo(padding, padding + h);
    procCtx.closePath();
    procCtx.fillStyle = color;
    procCtx.fill();
  }

  drawFill(cpuData, 'rgba(240, 165, 0, 0.04)');
  drawFill(memData, 'rgba(41, 121, 255, 0.04)');
  drawLine(cpuData, 'rgba(240, 165, 0, 0.8)');
  drawLine(memData, 'rgba(41, 121, 255, 0.8)');

  // legend
  procCtx.font = '10px monospace';
  procCtx.textAlign = 'left';

  procCtx.fillStyle = 'rgba(240, 165, 0, 0.8)';
  procCtx.fillText('— CPU', padding, processCanvas.height - 12);

  procCtx.fillStyle = 'rgba(41, 121, 255, 0.8)';
  procCtx.fillText('— MEM', padding + 55, processCanvas.height - 12);
}

function updateProcessData() {
  // add new random value, remove oldest
  const lastCpu = cpuData[cpuData.length - 1];
  const lastMem = memData[memData.length - 1];

  cpuData.push(Math.max(5, Math.min(95, lastCpu + (Math.random() - 0.5) * 10)));
  memData.push(Math.max(5, Math.min(95, lastMem + (Math.random() - 0.5) * 6)));

  cpuData.shift();
  memData.shift();

  drawProcessCanvas();
  setTimeout(updateProcessData, 200);
}

updateProcessData();

// WishGrid Canvas
const wishCanvas = document.getElementById('wishgrid-canvas');
const wCtx = wishCanvas.getContext('2d');

function resizeWishCanvas() {
  wishCanvas.width = wishCanvas.offsetWidth;
  wishCanvas.height = wishCanvas.offsetHeight;
}

resizeWishCanvas();
window.addEventListener('resize', resizeWishCanvas);

const wishItems = [
  { name: 'Mechanical Keyboard', price: '₹8,499', tag: 'Tech' },
  { name: 'Sony WH-1000XM5', price: '₹24,990', tag: 'Audio' },
  { name: 'Desk Lamp', price: '₹1,299', tag: 'Setup' },
  { name: 'RTX 4070', price: '₹58,000', tag: 'Tech' },
];

let wishIndex = 0;
let wishAnimating = false;
let slideOffset = 0;

const CARD_W_RATIO = 0.55;
const CARD_H_RATIO = 0.58;

function drawSingleCard(item, cx, cy, cardW, cardH, offsetX, rotation, alpha) {
  wCtx.save();
  wCtx.translate(cx + offsetX, cy);
  wCtx.rotate(rotation);
  
  const x = -cardW / 2;
  const y = -cardH / 2;
  
  // card background
  wCtx.beginPath();
  wCtx.roundRect(x, y, cardW, cardH, 12);
  wCtx.fillStyle = 'rgba(20, 20, 20,1)';
  wCtx.fill();
  wCtx.globalAlpha = alpha;
  wCtx.strokeStyle = 'rgba(240, 165, 0, 0.25)';
  wCtx.lineWidth = 1;
  wCtx.stroke();

  // image placeholder
  const imgH = cardH * 0.42;
  wCtx.beginPath();
  wCtx.roundRect(x + 12, y + 12, cardW - 24, imgH, 8);
  wCtx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  wCtx.fill();

  wCtx.font = '14px monospace';
  wCtx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  wCtx.textAlign = 'center';
  wCtx.textBaseline = 'middle';
  wCtx.fillText('[ img ]', 0, y + 12 + imgH / 2);

  // tag
  const tagY = y + 12 + imgH + 12;
  wCtx.font = '9px monospace';
  wCtx.fillStyle = 'rgba(240, 165, 0, 0.7)';
  wCtx.textAlign = 'left';
  wCtx.textBaseline = 'top';
  wCtx.fillText(item.tag.toUpperCase(), x + 14, tagY);

  // name
  wCtx.font = '11px monospace';
  wCtx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  wCtx.fillText(item.name, x + 14, tagY + 15);

  // price
  wCtx.font = '11px monospace';
  wCtx.fillStyle = 'rgba(240, 165, 0, 0.9)';
  wCtx.fillText(item.price, x + 14, tagY + 32);

  wCtx.restore();
}

function drawWishStack(slideOffset, tiltAngle = 0) {
  wCtx.clearRect(0, 0, wishCanvas.width, wishCanvas.height);

  const cx = wishCanvas.width / 2;
  const cy = wishCanvas.height / 2;
  const cardW = wishCanvas.width * CARD_W_RATIO;
  const cardH = wishCanvas.height * CARD_H_RATIO;

  const i0 = wishIndex % wishItems.length;
  const i1 = (wishIndex + 1) % wishItems.length;
  const i2 = (wishIndex + 2) % wishItems.length;

  drawSingleCard(wishItems[i2], cx, cy, cardW, cardH, 10, 0.12, 0.4);
  drawSingleCard(wishItems[i1], cx, cy, cardW, cardH, -10, tiltAngle, 0.6);
  drawSingleCard(wishItems[i0], cx, cy, cardW, cardH, slideOffset, 0, 1);

  wCtx.font = '11px monospace';
  wCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  wCtx.textAlign = 'left';
  wCtx.textBaseline = 'top';
  wCtx.fillText('WishGrid', 10, 10);
}

let tiltAngle = 0; 

function animateWishSlide() {
  if (!wishAnimating) return;

  slideOffset -= 8;
  // straighten the next card as current slides out
  tiltAngle = tiltAngle * 0.85;

  if (slideOffset < -wishCanvas.width) {
    wishIndex = (wishIndex + 1) % wishItems.length;
    slideOffset = 0;
    tiltAngle = -0.12; // reset tilt for next incoming card
    wishAnimating = false;
    setTimeout(() => {
      wishAnimating = true;
      animateWishSlide();
    }, 2500);
    return;
  }

  drawWishStack(slideOffset, tiltAngle);
  requestAnimationFrame(animateWishSlide);
}

// initial draw then start cycling
drawWishStack(0, -0.12);
setTimeout(() => {
  tiltAngle = -0.12;
  wishAnimating = true;
  animateWishSlide();
}, 2500);


// Contact Canvas
const contactCanvas = document.getElementById('contact-canvas');
const cCtx = contactCanvas.getContext('2d');

function resizeContactCanvas() {
  contactCanvas.width = contactCanvas.offsetWidth;
  contactCanvas.height = contactCanvas.offsetHeight;
}

resizeContactCanvas();
window.addEventListener('resize', resizeContactCanvas);

const PIXEL_SIZE = 6;
const PIXEL_GAP = 1.5;
const PIXEL_STEP = PIXEL_SIZE + PIXEL_GAP;

let mouseX = -999;
let mouseY = -999;

const activatedPixels = new Map(); // key: "col,row" → { alpha, size, decay }

document.getElementById('contact').addEventListener('mousemove', e => {
  const rect = contactCanvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;

  // activate pixels near cursor
  const cols = Math.floor(contactCanvas.width / PIXEL_STEP);
  const rows = Math.floor(contactCanvas.height / PIXEL_STEP);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * PIXEL_STEP;
      const y = row * PIXEL_STEP;
      const dx = x - mouseX;
      const dy = y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 80) {
        const key = `${col},${row}`;
        const intensity = 1 - dist / 80;
        // only activate if not already fully active
        const existing = activatedPixels.get(key);
        if (!existing || existing.alpha < intensity) {
          activatedPixels.set(key, {
            alpha: intensity,
            size: PIXEL_SIZE + intensity * 3,
            decay: 0.015 + Math.random() * 0.01, // random decay speed
          });
        }
      }
    }
  }
});

document.getElementById('contact').addEventListener('mouseleave', () => {
  mouseX = -999;
  mouseY = -999;
});

function drawContactCanvas() {
  cCtx.clearRect(0, 0, contactCanvas.width, contactCanvas.height);

  const cols = Math.floor(contactCanvas.width / PIXEL_STEP);
  const rows = Math.floor(contactCanvas.height / PIXEL_STEP);

  

  // draw and decay activated pixels
  activatedPixels.forEach((pixel, key) => {
    const [col, row] = key.split(',').map(Number);
    const x = col * PIXEL_STEP;
    const y = row * PIXEL_STEP;

    // interpolate color from white to accent based on alpha
    const r = Math.round(240 * pixel.alpha + 232 * (1 - pixel.alpha));
    const g = Math.round(165 * pixel.alpha + 232 * (1 - pixel.alpha));
    const b = Math.round(0 * pixel.alpha + 232 * (1 - pixel.alpha));

    const offset = (pixel.size - PIXEL_SIZE) / 2;
    cCtx.fillStyle = `rgba(240, 165, 0, ${pixel.alpha})`;
    cCtx.fillRect(x - offset, y - offset, pixel.size, pixel.size);

    // decay
    pixel.alpha -= pixel.decay;
    pixel.size = PIXEL_SIZE + (pixel.size - PIXEL_SIZE) * 0.95;

    if (pixel.alpha <= 0) {
      activatedPixels.delete(key);
    }
  });

  requestAnimationFrame(drawContactCanvas);
}

drawContactCanvas();

// mobile canvas toggles
document.querySelectorAll('.canvas-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const projectItem = btn.closest('.project-item');
    const canvas = projectItem.querySelector('.project-canvas');
    const isOpen = canvas.classList.contains('expanded');

    canvas.classList.toggle('expanded');
    btn.classList.toggle('open');
    btn.textContent = isOpen ? '▾ View Animation' : '▴ Hide Animation';

    // resize canvas after it becomes visible
    if (!isOpen) {
      setTimeout(() => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }, 50);
    }
  });
});