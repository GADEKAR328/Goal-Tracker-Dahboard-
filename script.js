/* ══════════════════════════════════════════
   Goal Tracker Pro — Yogesh Gadekar
   script.js
   ══════════════════════════════════════════ */

/* ── Profile state ── */
function savePfState() {
  try {
    const pf = {
      name:      document.getElementById('pf-name').value,
      dob:       document.getElementById('pf-dob').value,
      gender:    document.getElementById('pf-gender').value,
      objective: document.getElementById('pf-objective').value
    };
    localStorage.setItem('gtd_profile_v1', JSON.stringify(pf));
  } catch (e) {}
}

function loadPfState() {
  try {
    const s = localStorage.getItem('gtd_profile_v1');
    if (!s) return;
    const pf = JSON.parse(s);
    if (pf.name)      document.getElementById('pf-name').value = pf.name;
    if (pf.dob)       { document.getElementById('pf-dob').value = pf.dob; updateAge(); }
    if (pf.gender)    document.getElementById('pf-gender').value = pf.gender;
    if (pf.objective) document.getElementById('pf-objective').value = pf.objective;
  } catch (e) {}
}

function updateAge() {
  savePfState();
  const dob   = document.getElementById('pf-dob').value;
  const num   = document.getElementById('age-num');
  const msg   = document.getElementById('restart-msg');
  if (!dob) { num.textContent = '—'; msg.style.display = 'none'; return; }
  const b = new Date(dob), t = new Date();
  let age = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) age--;
  num.textContent       = age >= 0 ? age : '—';
  msg.style.display     = age >= 0 ? 'block' : 'none';
}

['pf-name', 'pf-objective'].forEach(id => {
  document.getElementById(id).addEventListener('input', savePfState);
});


/* ── Task / state data ── */
const TASKS = [
  "Plan Daily Tasks", "Check Emails & Reply", "Update Project Status", "Client Follow-up",
  "Team Standup Meeting", "Work on Priority Task", "Learn New Skill (15-30 min)",
  "Review Pending Work", "Data Entry / Reporting", "Clean Workspace", "Track Expenses",
  "Backup Important Files", "Health Break / Walk", "Read Industry News", "End-of-Day Review"
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const SEED = Array.from({ length: TASKS.length }, () => [0, 0, 0, 0, 0, 0, 0]);

// Clear any old stale seed data from previous version
try {
  const old = localStorage.getItem('gtd_yg_v3');
  if (old) {
    const parsed = JSON.parse(old);
    const hasOldSeed = parsed[0] && parsed[0][0] === 1;
    if (hasOldSeed) localStorage.removeItem('gtd_yg_v3');
  }
} catch (e) {}

let state;
try {
  const s = localStorage.getItem('gtd_yg_v3');
  state = s ? JSON.parse(s) : SEED.map(r => [...r]);
} catch (e) {
  state = SEED.map(r => [...r]);
}

function saveState() {
  try {
    localStorage.setItem('gtd_yg_v3', JSON.stringify(state));
    const n = new Date();
    document.getElementById('autosave-lbl').textContent =
      'Last saved at ' + fmtTime(n) + ' — all progress stored locally';
    showToast('✔ Progress saved');
  } catch (e) {}
}


/* ── Toast ── */
let tTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(tTimer);
  tTimer = setTimeout(() => t.classList.remove('show'), 2000);
}


/* ── Time helpers ── */
function fmtTime(d) {
  let h = d.getHours(), m = d.getMinutes(), s = d.getSeconds();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') + ' ' + ampm;
}

function fmtTimeShort(d) {
  let h = d.getHours(), m = d.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return { hm: h + ':' + String(m).padStart(2, '0'), ampm };
}


/* ── Live Clock ── */
function updateClock() {
  const n = new Date();
  const { hm, ampm } = fmtTimeShort(n);
  document.getElementById('clock-hm').textContent   = hm;
  document.getElementById('clock-ampm').textContent = ampm;
  document.getElementById('clock-day').textContent  = n.toLocaleDateString('en-IN', { weekday: 'long' });
  document.getElementById('clock-date').textContent = n.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}
setInterval(updateClock, 1000);
updateClock();


/* ── 24-hr Day Ring ── */
const rc = document.getElementById('dayRingCanvas');
const rx = rc.getContext('2d');

function drawRing() {
  const n    = new Date();
  const secs = n.getHours() * 3600 + n.getMinutes() * 60 + n.getSeconds();
  const pct  = secs / 86400;
  const cx = 79, cy = 79, R = 70, lw = 16;

  rx.clearRect(0, 0, 158, 158);

  // Background track
  rx.beginPath();
  rx.arc(cx, cy, R, 0, Math.PI * 2);
  rx.lineWidth = lw;
  rx.strokeStyle = '#e2e8f0';
  rx.stroke();

  // Progress arc
  const g = rx.createLinearGradient(0, 0, 158, 158);
  g.addColorStop(0,   '#1e3a5f');
  g.addColorStop(0.5, '#0d9488');
  g.addColorStop(1,   '#6d28d9');
  rx.beginPath();
  rx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct);
  rx.lineWidth = lw;
  rx.strokeStyle = g;
  rx.lineCap = 'round';
  rx.stroke();

  // Hour tick marks
  for (let i = 0; i < 24; i++) {
    const a     = -Math.PI / 2 + (Math.PI * 2 / 24) * i;
    const inner = R - lw / 2 - 2, outer = R + lw / 2 + 2;
    rx.beginPath();
    rx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
    rx.lineTo(cx + Math.cos(a) * outer, cy + Math.sin(a) * outer);
    rx.strokeStyle = i < Math.floor(pct * 24) ? 'rgba(30,58,95,0.5)' : 'rgba(0,0,0,0.08)';
    rx.lineWidth = 1;
    rx.lineCap = 'butt';
    rx.stroke();
  }

  // Dot at progress tip
  const ta = -Math.PI / 2 + Math.PI * 2 * pct;
  const dx = cx + Math.cos(ta) * R, dy = cy + Math.sin(ta) * R;
  rx.beginPath();
  rx.arc(dx, dy, 5, 0, Math.PI * 2);
  rx.fillStyle = '#fff';
  rx.shadowColor = '#0d9488';
  rx.shadowBlur = 10;
  rx.fill();
  rx.shadowBlur = 0;

  // Center text
  rx.fillStyle = '#1e3a5f';
  rx.font = 'bold 18px Times New Roman';
  rx.textAlign = 'center';
  rx.textBaseline = 'middle';
  rx.fillText(Math.round(pct * 100) + '%', cx, cy - 8);
  rx.font = 'italic 11px Times New Roman';
  rx.fillStyle = '#64748b';
  rx.fillText('elapsed', cx, cy + 10);

  // Time unit displays
  const h = n.getHours(), m = n.getMinutes(), s = n.getSeconds();
  const pad = v => String(v).padStart(2, '0');
  document.getElementById('tu-h').textContent       = pad(h % 12 || 12);
  document.getElementById('tu-m').textContent       = pad(m);
  document.getElementById('tu-s').textContent       = pad(s);
  document.getElementById('day-pct-big').textContent = Math.round(pct * 100) + '%';
}
setInterval(drawRing, 1000);
drawRing();


/* ── Stats helpers ── */
function colStats() {
  return DAYS.map((_, di) => {
    const comp = state.reduce((s, r) => s + r[di], 0);
    return { comp, pend: TASKS.length - comp, pct: comp / TASKS.length };
  });
}

function rowPct(ti) {
  return state[ti].reduce((s, v) => s + v, 0) / 7;
}


/* ── KPI Cards ── */
function updateKPIs() {
  const st       = colStats();
  const avgPct   = st.reduce((s, d) => s + d.pct, 0) / 7;
  const totalComp = st.reduce((s, d) => s + d.comp, 0);
  const totalPend = st.reduce((s, d) => s + d.pend, 0);
  const best     = st.reduce((b, d) => d.pct > b.pct ? d : b, st[0]);
  const bestIdx  = st.indexOf(best);

  document.getElementById('kpi-comp').textContent     = Math.round(avgPct * 100) + '%';
  document.getElementById('kpi-pend').textContent     = Math.round((1 - avgPct) * 100) + '%';
  document.getElementById('kpi-total').textContent    = totalComp + totalPend;
  document.getElementById('kpi-comp-sub').textContent = totalComp + ' tasks done';
  document.getElementById('kpi-pend-sub').textContent = totalPend + ' tasks left';
  document.getElementById('kpi-best').textContent     = Math.round(best.pct * 100) + '%';
  document.getElementById('kpi-best-day').textContent = DAYS[bestIdx];
  document.getElementById('kpi-avg').textContent      = (totalComp / 7).toFixed(1);
  document.getElementById('kpi-score').textContent    = Math.round(avgPct * 100) + '%';
  document.getElementById('dc-val').textContent       = Math.round(avgPct * 100) + '%';
}


/* ── Daily Summary ── */
function updateSummary() {
  const st = colStats();
  const g  = document.getElementById('summary-grid');
  g.innerHTML = '';
  st.forEach((s, i) => {
    const cls = s.pct >= 0.7 ? 'hi' : s.pct >= 0.4 ? 'mid' : 'lo';
    g.innerHTML += `
      <div class="sum-card">
        <div class="sum-day">${DAYS[i]}</div>
        <div class="sum-pct ${cls}">${Math.round(s.pct * 100)}%</div>
        <div class="sum-detail">✓${s.comp} ✗${s.pend}</div>
      </div>`;
  });
}


/* ── Charts ── */
let donutChart, lineChart;
const DAY_COLS = ['#c0392b','#b7791f','#16a34a','#0d9488','#1d4ed8','#6d28d9','#be185d'];

function initCharts() {
  const st   = colStats();
  const comp = st.reduce((s, d) => s + d.comp, 0);
  const pend = st.reduce((s, d) => s + d.pend, 0);

  donutChart = new Chart(document.getElementById('donutChart'), {
    type: 'doughnut',
    data: {
      labels: ['Completed', 'Pending'],
      datasets: [{ data: [comp, pend], backgroundColor: ['#0d9488', '#fca5a5'], borderWidth: 2, borderColor: '#fff', hoverOffset: 5 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '64%',
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.parsed} tasks` } } }
    }
  });

  lineChart = new Chart(document.getElementById('lineChart'), {
    type: 'line',
    data: {
      labels: DAYS,
      datasets: [{
        label: '% Completed',
        data: st.map(s => Math.round(s.pct * 100)),
        borderColor: '#1e3a5f', backgroundColor: 'rgba(30,58,95,0.07)',
        tension: 0.42, pointBackgroundColor: DAY_COLS,
        pointRadius: 6, pointHoverRadius: 8, fill: true, borderWidth: 2.5
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ctx.parsed.y + '%' } } },
      scales: {
        y: { min: 0, max: 100, ticks: { callback: v => v + '%', color: '#64748b', font: { size: 11, family: 'Times New Roman' } }, grid: { color: 'rgba(0,0,0,0.05)' }, border: { color: 'transparent' } },
        x: { ticks: { color: '#64748b', font: { size: 11, family: 'Times New Roman' } }, grid: { display: false }, border: { color: 'transparent' } }
      }
    }
  });
}

function updateCharts() {
  const st   = colStats();
  const comp = st.reduce((s, d) => s + d.comp, 0);
  const pend = st.reduce((s, d) => s + d.pend, 0);
  donutChart.data.datasets[0].data = [comp, pend];
  donutChart.update();
  lineChart.data.datasets[0].data = st.map(s => Math.round(s.pct * 100));
  lineChart.update();
}


/* ── Row % bar ── */
function updateRowPct(ti) {
  const pct = Math.round(rowPct(ti) * 100);
  const n   = document.getElementById(`pn-${ti}`);
  const f   = document.getElementById(`pf-${ti}`);
  if (n) n.textContent  = pct + '%';
  if (f) f.style.width  = pct + '%';
}


/* ── Build Task Table ── */
function buildTable() {
  const tbody = document.getElementById('task-tbody');
  tbody.innerHTML = '';

  TASKS.forEach((task, ti) => {
    const tr = document.createElement('tr');
    let html = `<td class="td-task">${task}</td>`;

    DAYS.forEach((_, di) => {
      const id = `cb-${ti}-${di}`;
      html += `<td class="cb-cell col-${di}">
                 <input type="checkbox" id="${id}" ${state[ti][di] ? 'checked' : ''}>
                 <label for="${id}" title="${task} — ${DAYS[di]}">✓</label>
               </td>`;
    });

    const pct = Math.round(rowPct(ti) * 100);
    html += `<td>
               <div class="pct-bar-wrap">
                 <div class="pct-bar"><div class="pct-fill" id="pf-${ti}" style="width:${pct}%"></div></div>
                 <span class="pct-num" id="pn-${ti}">${pct}%</span>
               </div>
             </td>`;

    tr.innerHTML = html;
    tbody.appendChild(tr);

    DAYS.forEach((_, di) => {
      document.getElementById(`cb-${ti}-${di}`).addEventListener('change', function () {
        state[ti][di] = this.checked ? 1 : 0;
        saveState();
        updateRowPct(ti);
        updateKPIs();
        updateSummary();
        updateCharts();
      });
    });
  });
}


/* ── PDF Export ── */
async function downloadPDF() {
  showToast('📄 Generating PDF…');
  const btn = document.getElementById('dl-btn');
  btn.disabled    = true;
  btn.textContent = 'Generating…';

  try {
    await new Promise(r => setTimeout(r, 300));
    const el     = document.getElementById('page-wrap');
    const canvas = await html2canvas(el, {
      scale: 1.8, backgroundColor: '#f4f6f9', useCORS: true,
      scrollY: -window.scrollY, windowWidth: el.scrollWidth, windowHeight: el.scrollHeight
    });
    const { jsPDF } = window.jspdf;
    const pw = 297, ph = 210;
    const pdf   = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const ratio = Math.min(pw / canvas.width, ph / canvas.height);
    const iw    = canvas.width * ratio, ih = canvas.height * ratio;
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.93), 'JPEG', (pw - iw) / 2, (ph - ih) / 2, iw, ih);
    const n = new Date();
    pdf.save(`GoalTracker_Yogesh_${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}.pdf`);
    showToast('✔ PDF downloaded!');
  } catch (err) {
    showToast('⚠ PDF failed — try again');
    console.error(err);
  }

  btn.disabled  = false;
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:15px;height:15px"><path d="M12 3v12M6 12l6 6 6-6M3 19h18"/></svg> Download PDF`;
}


/* ── Initialise ── */
buildTable();
initCharts();
updateKPIs();
updateSummary();
loadPfState();
