/**
 * CivicLens — dashboard.js
 * Drop-in replacement. Backend API calls are preserved exactly.
 * Only the rendering layer is updated to match the new design system.
 */

const API_BASE = '/api'; // ← keep whatever your original value was

// Chart.js global defaults
Chart.defaults.font.family = "'DM Mono', monospace";
Chart.defaults.color = '#8A8A86';
Chart.defaults.borderColor = '#E0DDD7';

let mainChartInstance = null;
let trendChartInstance = null;
let currentData = null;

// ─── Data Fetching ────────────────────────────────────────────────────────────

async function loadChartData() {
  const sector = document.getElementById('sectorFilter')?.value || '';
  const year   = document.getElementById('yearFilter')?.value   || '2024';
  const state  = document.getElementById('stateFilter')?.value  || '';

  showLoading(true);

  try {
    const params = new URLSearchParams({ sector, year });
    if (state) params.append('state', state);

    const res  = await fetch(`${API_BASE}/budget?${params.toString()}`);
    const data = await res.json();

    currentData = data;
    renderMainChart(data);
    updateSidebarStats(data);

  } catch (err) {
    console.error('Failed to fetch chart data:', err);
    showError('Could not load data. Please check your connection and try again.');
  } finally {
    showLoading(false);
  }
}

async function processNLQuery(query) {
  showLoading(true);
  try {
    const res  = await fetch(`${API_BASE}/query`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ query }),
    });
    const data = await res.json();

    currentData = data;
    renderMainChart(data);
    updateSidebarStats(data);
    if (data.aiInsight) setAIInsight(data.aiInsight);

  } catch (err) {
    console.error('NL query failed:', err);
    showError('Could not process query. Please try again.');
  } finally {
    showLoading(false);
  }
}

async function fetchAIInsight() {
  if (!currentData) return;

  const insightEl = document.getElementById('aiInsightText');
  insightEl.innerHTML = '<span style="opacity:0.6;">Generating analysis…</span>';

  try {
    const res  = await fetch(`${API_BASE}/explain`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ data: currentData }),
    });
    const result = await res.json();
    setAIInsight(result.insight || result.message || 'Analysis complete.');
  } catch (err) {
    console.error('AI insight error:', err);
    document.getElementById('aiInsightText').textContent = 'Could not generate insight. Please try again.';
  }
}

// ─── Chart Rendering ──────────────────────────────────────────────────────────

function renderMainChart(data) {
  const ctx = document.getElementById('mainChart');
  if (!ctx) return;

  if (mainChartInstance) { mainChartInstance.destroy(); mainChartInstance = null; }

  let labels, datasets;

  if (data && data.labels && data.datasets) {
    labels   = data.labels;
    datasets = data.datasets;
  } else if (Array.isArray(data)) {
    labels   = data.map(d => d.state || d.label || d.name || '');
    datasets = [{ label: data[0]?.category || 'Spending', data: data.map(d => d.value || d.amount || 0) }];
  } else {
    console.warn('Unexpected data shape:', data);
    return;
  }

  const palette = ['#E8A020', '#00B4B4', '#E85A20', '#7B61FF', '#22863A'];

  const styledDatasets = datasets.map((ds, i) => ({
    ...ds,
    backgroundColor:      palette[i % palette.length],
    borderColor:          palette[i % palette.length],
    borderRadius:         4,
    borderSkipped:        false,
    hoverBackgroundColor: lightenHex(palette[i % palette.length], 15),
  }));

  updateChartLegend(styledDatasets);

  mainChartInstance = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: styledDatasets },
    options: {
      indexAxis:  'y',
      responsive: true,
      animation: {
        duration: 800,
        easing:   'easeOutQuart',
        delay: (ctx) => ctx.dataIndex * 60,
      },
      plugins: {
        legend:  { display: false },
        tooltip: {
          backgroundColor: '#1A1A18',
          titleColor:      '#F5F2ED',
          bodyColor:       '#9A9A96',
          padding:         12,
          cornerRadius:    8,
          titleFont:  { family: "'Inter', sans-serif", weight: '600', size: 13 },
          bodyFont:   { family: "'DM Mono', monospace", size: 12 },
          callbacks: {
            label: (ctx) => ` ₹${formatNumber(ctx.parsed.x)} (×1,00,000)`,
          },
        },
      },
      scales: {
        x: {
          grid:   { color: 'rgba(224,221,215,0.6)' },
          border: { display: false },
          ticks:  { callback: (v) => formatNumber(v), maxTicksLimit: 6, font: { size: 11 } },
        },
        y: {
          grid:   { display: false },
          border: { display: false },
          ticks:  { font: { size: 12, weight: '500' }, color: '#4A4A48' },
        },
      },
    },
  });
}

function renderTrendChart(data) {
  const ctx = document.getElementById('trendChart');
  if (!ctx) return;

  if (trendChartInstance) { trendChartInstance.destroy(); trendChartInstance = null; }

  const palette = ['#E8A020', '#00B4B4'];

  const styledDatasets = (data.datasets || []).map((ds, i) => ({
    ...ds,
    borderColor:     palette[i % palette.length],
    backgroundColor: palette[i % palette.length] + '20',
    borderWidth:  2,
    pointRadius:  4,
    pointHoverRadius: 6,
    tension:      0.3,
    fill:         true,
  }));

  trendChartInstance = new Chart(ctx, {
    type: 'line',
    data: { labels: data.labels || [], datasets: styledDatasets },
    options: {
      responsive: true,
      animation:  { duration: 700, easing: 'easeOutQuart' },
      plugins: {
        legend:  { display: false },
        tooltip: { backgroundColor: '#1A1A18', titleColor: '#F5F2ED', bodyColor: '#9A9A96', padding: 12, cornerRadius: 8 },
      },
      scales: {
        x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 11 } } },
        y: { grid: { color: 'rgba(224,221,215,0.5)' }, border: { display: false }, ticks: { callback: (v) => '₹' + formatNumber(v), font: { size: 11 } } },
      },
    },
  });

  const card = document.getElementById('secondaryChart');
  if (card) card.style.display = 'block';
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────

function updateChartLegend(datasets) {
  const legend = document.getElementById('chartLegend');
  if (!legend) return;
  legend.innerHTML = datasets.map(ds => `
    <div class="legend-item">
      <div class="legend-dot" style="background:${ds.backgroundColor};"></div>
      <span>${ds.label || ''}</span>
    </div>
  `).join('');
}

function updateSidebarStats(data) {
  let highest = '—', total = '—', count = '—';

  if (Array.isArray(data) && data.length) {
    const sorted = [...data].sort((a, b) => (b.value || 0) - (a.value || 0));
    highest = sorted[0]?.state || sorted[0]?.label || '—';
    const sum = data.reduce((acc, d) => acc + (d.value || 0), 0);
    total = '₹' + formatNumber(sum);
    count = `${data.length} / 36`;
  } else if (data?.labels) {
    count   = `${data.labels.length} / 36`;
    highest = data.labels[0] || '—';
  }

  setEl('statHighest', highest);
  setEl('statTotal',   total);
  setEl('statCount',   count);
}

function setAIInsight(text) {
  const el = document.getElementById('aiInsightText');
  if (el) el.innerHTML = text.replace(/\n/g, '<br/>');
}

function showLoading(show) {
  const loader = document.getElementById('loadingState');
  const chart  = document.getElementById('chartCard');
  if (loader) loader.style.display = show ? 'block' : 'none';
  if (chart)  chart.style.display  = show ? 'none'  : 'block';
}

function showError(msg) {
  const el = document.getElementById('aiInsightText');
  if (el) el.innerHTML = `<span style="color:#c0392b;">⚠ ${msg}</span>`;
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function formatNumber(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(0)     + 'K';
  return String(Math.round(n));
}

function lightenHex(hex, pct) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r   = Math.min(255, (num >> 16) + pct);
  const g   = Math.min(255, ((num >> 8) & 0xff) + pct);
  const b   = Math.min(255, (num & 0xff) + pct);
  return `rgb(${r},${g},${b})`;
}

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  loadChartData();
});