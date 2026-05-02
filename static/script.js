// ===========================
// NAVBAR SCROLL EFFECT
// ===========================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===========================
// CHART.JS - DISTRIBUTION CHART (Donut)
// Data is injected from Flask/Python via the template
// ===========================
const distributionCtx = document.getElementById('distributionChart').getContext('2d');

new Chart(distributionCtx, {
  type: 'doughnut',
  data: {
    labels: CHART_CLASS_DISTRIBUTION.labels,
    datasets: [{
      data: CHART_CLASS_DISTRIBUTION.counts,
      backgroundColor: CHART_CLASS_DISTRIBUTION.colors,
      borderColor: CHART_CLASS_DISTRIBUTION.borderColors,
      borderWidth: 2,
      hoverOffset: 10
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#44403c',
          font: { size: 10, family: 'Nunito' },
          boxWidth: 12,
          padding: 10,
          generateLabels: function(chart) {
            const data = chart.data;
            return data.labels.map((label, i) => ({
              text: `${label.split(' (')[0]}: ${data.datasets[0].data[i].toLocaleString()}`,
              fillStyle: data.datasets[0].backgroundColor[i],
              strokeStyle: data.datasets[0].borderColor[i],
              lineWidth: 2,
              index: i
            }));
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const pct = ((context.parsed / total) * 100).toFixed(1);
            return ` ${context.parsed.toLocaleString()} images (${pct}%)`;
          }
        },
        backgroundColor: 'rgba(10, 22, 40, 0.95)',
        titleColor: '#f0f4ff',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(0, 229, 200, 0.2)',
        borderWidth: 1
      }
    },
    animation: { animateRotate: true, duration: 1200 }
  }
});

// ===========================
// CHART.JS - ACCURACY BAR CHART
// Data is injected from Flask/Python via the template
// ===========================
const accuracyCtx = document.getElementById('accuracyChart').getContext('2d');

new Chart(accuracyCtx, {
  type: 'bar',
  data: {
    labels: CHART_PER_CLASS_ACCURACY.labels,
    datasets: [{
      label: 'EfficientNet Accuracy (%)',
      data: CHART_PER_CLASS_ACCURACY.efficientnet,
      backgroundColor: [
        'rgba(16,185,129,0.75)',
        'rgba(239,68,68,0.75)',
        'rgba(59,130,246,0.75)',
        'rgba(245,158,11,0.75)',
        'rgba(139,92,246,0.75)',
        'rgba(236,72,153,0.75)',
        'rgba(6,182,212,0.75)'
      ],
      borderColor: [
        '#10b981','#ef4444','#3b82f6','#f59e0b','#8b5cf6','#ec4899','#06b6d4'
      ],
      borderWidth: 1.5,
      borderRadius: 8,
      borderSkipped: false
    }, {
      label: 'U-Net + EfficientNet (%)',
      data: CHART_PER_CLASS_ACCURACY.unetEfficientnet,
      backgroundColor: 'rgba(0, 229, 200, 0.18)',
      borderColor: '#00e5c8',
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 50,
        max: 100,
        grid: { color: 'rgba(0,0,0,0.06)' },
        ticks: { color: '#78716c', font: { size: 11, family: 'Nunito' }, callback: v => v + '%' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#78716c', font: { size: 11, family: 'Nunito' } }
      }
    },
    plugins: {
      legend: {
        labels: { color: '#44403c', font: { size: 11, family: 'Nunito' }, boxWidth: 14 }
      },
      tooltip: {
        backgroundColor: 'rgba(10, 22, 40, 0.95)',
        titleColor: '#f0f4ff',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(0, 229, 200, 0.2)',
        borderWidth: 1,
        callbacks: {
          label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y}%`
        }
      }
    },
    animation: { duration: 1200 }
  }
});

// ===========================
// INTERSECTION OBSERVER — Reveal on Scroll
// ===========================
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -60px 0px' };

// Animated progress rings
const ringObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const circle = entry.target.querySelector('.ring-fill');
      if (circle) {
        const pct = parseFloat(circle.dataset.pct);
        const circumference = 2 * Math.PI * 50; // r=50
        const offset = circumference * (1 - pct / 100);
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = offset;
      }
      ringObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.metric-ring').forEach(el => ringObserver.observe(el));

// Challenge bars
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.challenge-bar').forEach(bar => {
        const w = bar.style.getPropertyValue('--w');
        bar.style.width = w;
      });
      barObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

const challengeSection = document.querySelector('.challenge-bars');
if (challengeSection) barObserver.observe(challengeSection);

// Fade-in cards on scroll
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, (parseInt(entry.target.dataset.delay) || 0));
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('[data-aos="fade-up"]').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  fadeObserver.observe(el);
});

// ===========================
// SVG GRADIENT DEFS FOR RINGS
// ===========================
const svgNS = 'http://www.w3.org/2000/svg';
document.querySelectorAll('.metric-ring svg').forEach((svg, idx) => {
  const defs = document.createElementNS(svgNS, 'defs');
  const grad = document.createElementNS(svgNS, 'linearGradient');
  grad.setAttribute('id', `ringGrad${idx}`);
  grad.setAttribute('x1', '0%'); grad.setAttribute('y1', '0%');
  grad.setAttribute('x2', '100%'); grad.setAttribute('y2', '100%');
  const stop1 = document.createElementNS(svgNS, 'stop');
  stop1.setAttribute('offset', '0%'); stop1.setAttribute('stop-color', '#00e5c8');
  const stop2 = document.createElementNS(svgNS, 'stop');
  stop2.setAttribute('offset', '100%'); stop2.setAttribute('stop-color', '#7c3aed');
  grad.appendChild(stop1); grad.appendChild(stop2);
  defs.appendChild(grad);
  svg.insertBefore(defs, svg.firstChild);
  const fill = svg.querySelector('.ring-fill');
  if (fill && !fill.classList.contains('seg-fill') && !fill.classList.contains('mel-fill') && !fill.classList.contains('auc-fill')) {
    fill.setAttribute('stroke', `url(#ringGrad${idx})`);
  }
});

// ===========================
// ACTIVE NAV LINK ON SCROLL
// ===========================
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) current = section.getAttribute('id');
  });
  navLinkEls.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === `#${current}`) {
      a.style.color = 'var(--accent-teal)';
    }
  });
});

// ===========================
// PIPELINE NODES STAGGER ANIMATION
// ===========================
const pipelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nodes = entry.target.querySelectorAll('.pipeline-node');
      nodes.forEach((node, i) => {
        node.style.opacity = '0';
        node.style.transform = 'translateY(20px)';
        node.style.transition = `opacity 0.5s ease ${i * 0.12}s, transform 0.5s ease ${i * 0.12}s`;
        setTimeout(() => {
          node.style.opacity = '1';
          node.style.transform = 'translateY(0)';
        }, 100 + i * 120);
      });
      pipelineObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

const pipelineFlow = document.querySelector('.pipeline-flow');
if (pipelineFlow) pipelineObserver.observe(pipelineFlow);

console.log('%c🧬 SkinAI — Skin Cancer DL Project (Flask)', 'color: #00e5c8; font-size: 18px; font-weight: bold;');
console.log('%cDataset: HAM10000 | 10,015 images | 7 classes | Powered by Python/Flask', 'color: #94a3b8; font-size: 12px;');
