let state = null;
let macroChart = null;
let progressChart = null;

const navButtons = document.querySelectorAll('.navBtn');
const sections = document.querySelectorAll('.section');
const form = document.getElementById('intakeForm');

function showSection(id) {
  sections.forEach(s => s.classList.toggle('active', s.id === id));
  navButtons.forEach(b => b.classList.toggle('active', b.dataset.target === id));
}

navButtons.forEach(btn => btn.addEventListener('click', () => showSection(btn.dataset.target)));

document.getElementById('searchBox').addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase().trim();
  const cards = document.querySelectorAll('.miniCard, .logItem');
  cards.forEach(el => {
    const txt = el.textContent.toLowerCase();
    el.style.display = txt.includes(q) ? '' : 'none';
  });
});

function readForm() {
  const fd = new FormData(form);
  const payload = {};
  for (const [k, v] of fd.entries()) payload[k] = v;
  return payload;
}

function setPill(el, level, text) {
  el.className = 'pill ' + level;
  el.textContent = text;
}

function renderThumbs(containerId, arr) {
  const el = document.getElementById(containerId);
  el.innerHTML = '';
  arr.slice(0, 4).forEach(() => {
    const t = document.createElement('div');
    t.className = 'thumb';
    el.appendChild(t);
  });
}

function updatePreview(profile) {
  const meal = profile.meal_photos || [];
  const body = profile.body_photos || [];
  const rep = profile.reports || [];
  document.getElementById('mealCount').textContent = meal.length;
  document.getElementById('bodyCount').textContent = body.length;
  document.getElementById('reportCount').textContent = rep.length;
  document.getElementById('mealPreviewText').textContent = meal.length ? meal.join(', ') : 'No meal photos uploaded.';
  document.getElementById('bodyPreviewText').textContent = body.length ? body.join(', ') : 'No body photos uploaded.';
  document.getElementById('reportPreviewText').textContent = rep.length ? rep.join(', ') : 'No reports uploaded.';
  renderThumbs('mealThumbs', meal);
  renderThumbs('bodyThumbs', body);
  renderThumbs('reportThumbs', rep);
}

function renderHistory(rows) {
  const html = rows.map(r => `
    <tr>
      <td>${r.created_at}</td>
      <td>${r.user_name}</td>
      <td><span class="pill ${r.risk_level}">${r.risk_level.toUpperCase()}</span></td>
      <td>${r.summary}</td>
    </tr>
  `).join('') || '<tr><td colspan="4" class="muted">No history available.</td></tr>';
  document.getElementById('historyTable').innerHTML = html;
  document.getElementById('profileHistory').innerHTML = html;
}

function renderAudit(rows) {
  const items = rows.map(r => `
    <div class="miniCard">
      <div class="logItemTitle">${r.created_at} • ${r.user_name}</div>
      <div class="metricPair"><span>Risk</span><span><span class="pill ${r.risk_level}">${r.risk_level.toUpperCase()}</span></span></div>
      <div style="height:8px"></div>
      <div class="muted small">${r.summary}</div>
    </div>
  `).join('') || '<div class="miniCard">No audit log yet.</div>';
  document.getElementById('auditLogList').innerHTML = items;
}

function renderExplanation(result) {
  document.getElementById('explainCalcList').innerHTML = (result.explanation.calculations || []).map(x => `<div class="miniCard">${x}</div>`).join('');
  document.getElementById('explainRuleList').innerHTML = (result.explanation.rules_triggered || []).map(x => `<div class="miniCard">${x}</div>`).join('');
  document.getElementById('explainHistory').innerHTML = `
    <tr><td>${new Date().toLocaleString()}</td><td><span class="pill ${result.risk_level}">${result.risk_level.toUpperCase()}</span></td><td>${result.explanation.decision_summary}</td></tr>
  `;
}

function renderAlert(result) {
  const risk = result.risk_level;
  const flags = result.safety_flags || [];
  const alertBox = document.getElementById('alertBox');
  const alertList = document.getElementById('alertList');
  const actionBox = document.getElementById('actionBox');

  if (risk === 'critical') {
    alertBox.className = 'warningBox';
    alertBox.innerHTML = `<strong>Critical risk detected.</strong><div style="height:8px"></div>This plan is blocked until professional review.`;
    actionBox.innerHTML = 'Recommend medical consultation before any automated diet or workout plan.';
  } else if (risk === 'high') {
    alertBox.className = 'warningBox';
    alertBox.innerHTML = `<strong>High risk detected.</strong><div style="height:8px"></div>Use caution and review with a professional.`;
    actionBox.innerHTML = 'Restrict aggressive changes. Prefer supervised adjustments.';
  } else if (risk === 'moderate') {
    alertBox.className = 'successBox';
    alertBox.innerHTML = `<strong>Moderate caution.</strong><div style="height:8px"></div>Proceed with a conservative plan.`;
    actionBox.innerHTML = 'Proceed carefully. Keep plan gradual and monitor symptoms.';
  } else {
    alertBox.className = 'successBox';
    alertBox.innerHTML = `<strong>Low risk.</strong><div style="height:8px"></div>No major safety flags detected.`;
    actionBox.innerHTML = 'Proceed with the generated plan.';
  }

  alertList.innerHTML = flags.map(f => `<div class="miniCard">${f}</div>`).join('') || '<div class="miniCard">No alerts.</div>';
  document.getElementById('riskNarrative').textContent = flags.join(' • ');
}

function updateProfileCard(profile, result) {
  document.getElementById('profileName').textContent = profile.name;
  document.getElementById('profileMeta').textContent = `${profile.age} years • ${profile.sex} • ${profile.height_cm} cm • ${profile.weight_kg} kg`;
  document.getElementById('profAge').textContent = profile.age;
  document.getElementById('profWeight').textContent = `${profile.weight_kg} kg`;
  document.getElementById('profHeight').textContent = `${profile.height_cm} cm`;
  document.getElementById('profActivity').textContent = profile.activity_level;
  document.getElementById('profDiet').textContent = profile.diet_preference;
  document.getElementById('profGoal').textContent = profile.goal;
  document.getElementById('topUserName').textContent = profile.name;
  document.getElementById('topUserRole').textContent = `${profile.goal.replace('_', ' ')} • ${profile.activity_level}`;
  document.getElementById('statStatus').textContent = result.status;
  document.getElementById('riskUpdated').textContent = `Last update: ${new Date().toLocaleTimeString()}`;
}

function updateAnalysis(result) {
  document.getElementById('bmiVal').textContent = result.bmi;
  document.getElementById('bmrVal').textContent = result.bmr;
  document.getElementById('bmrFormulaVal').textContent = result.bmr_formula;
  document.getElementById('tdeeVal').textContent = result.tdee;
  document.getElementById('calVal').textContent = result.target_calories;
  document.getElementById('proteinVal').textContent = `${result.macro_plan.protein_g} g`;
  document.getElementById('fatVal').textContent = `${result.macro_plan.fat_g} g`;
  document.getElementById('carbVal').textContent = `${result.macro_plan.carbs_g} g`;
  document.getElementById('statusVal').textContent = result.risk_level.toUpperCase();
  document.getElementById('goalCalories').textContent = `${result.target_calories} kcal`;
  document.getElementById('goalLabel').textContent = result.status;
  document.getElementById('macroText').textContent = `${result.macro_plan.protein_g} / ${result.macro_plan.fat_g} / ${result.macro_plan.carbs_g}`;

  setPill(document.getElementById('riskPill'), result.risk_level, `Risk: ${result.risk_level.toUpperCase()}`);
  setPill(document.getElementById('inputStatusPill'), result.risk_level === 'low' ? 'low' : result.risk_level, `Input Status: ${result.status}`);
  document.getElementById('riskBig').textContent = result.risk_level.charAt(0).toUpperCase() + result.risk_level.slice(1);
  document.getElementById('riskSmall').textContent = result.status;
}

function updateCharts(result) {
  const macroCtx = document.getElementById('macroChart');
  if (macroChart) macroChart.destroy();
  macroChart = new Chart(macroCtx, {
    type: 'doughnut',
    data: {
      labels: ['Protein', 'Fat', 'Carbs'],
      datasets: [{
        data: [result.macro_plan.protein_g, result.macro_plan.fat_g, result.macro_plan.carbs_g],
        borderWidth: 0,
      }],
    },
    options: {
      plugins: { legend: { labels: { color: '#dbe6ff' } } },
      cutout: '68%',
      maintainAspectRatio: false,
    }
  });

  const progCtx = document.getElementById('progressChart');
  if (progressChart) progressChart.destroy();
  progressChart = new Chart(progCtx, {
    type: 'line',
    data: {
      labels: ['Initial', 'Week 1', 'Week 2', 'Week 3', 'Latest'],
      datasets: [{
        label: 'Calories trend',
        data: [result.tdee + 150, result.tdee + 80, result.tdee + 40, result.tdee, result.target_calories],
        tension: 0.35,
        fill: true,
      }]
    },
    options: {
      plugins: { legend: { labels: { color: '#dbe6ff' } } },
      scales: {
        x: { ticks: { color: '#9aa8c7' }, grid: { color: 'rgba(255,255,255,.05)' } },
        y: { ticks: { color: '#9aa8c7' }, grid: { color: 'rgba(255,255,255,.05)' } }
      }
    }
  });
}

function updateRecommendationTables(result) {
  const meals = result.meal_plan || [];
  const workouts = result.workout_plan || [];
  document.getElementById('mealTable').innerHTML = meals.map(d => `
    <tr>
      <td>${d.day}</td><td>${d.breakfast}</td><td>${d.lunch}</td><td>${d.dinner}</td><td>${d.snack}</td>
    </tr>
  `).join('') || '<tr><td colspan="5" class="muted">No meal plan generated yet.</td></tr>';
  document.getElementById('workoutTable').innerHTML = workouts.map(d => `
    <tr><td>${d.day}</td><td>${d.focus}</td><td>${d.plan}</td></tr>
  `).join('') || '<tr><td colspan="3" class="muted">No workout plan generated yet.</td></tr>';
}

function updateProgressAndComparison(result) {
  document.getElementById('trendWeight').textContent = `${result.bmi} BMI context`;
  document.getElementById('trendWorkout').textContent = result.risk_level === 'critical' ? 'Paused' : 'On track';
  document.getElementById('trendMeal').textContent = result.risk_level === 'critical' ? 'Paused' : 'Active';
  document.getElementById('weightBar').style.width = result.risk_level === 'low' ? '78%' : result.risk_level === 'moderate' ? '64%' : result.risk_level === 'high' ? '42%' : '18%';
  document.getElementById('workoutBar').style.width = result.risk_level === 'low' ? '76%' : result.risk_level === 'moderate' ? '60%' : result.risk_level === 'high' ? '35%' : '12%';
  document.getElementById('mealBar').style.width = result.risk_level === 'low' ? '80%' : result.risk_level === 'moderate' ? '62%' : result.risk_level === 'high' ? '40%' : '14%';
  document.getElementById('recentComparison').innerHTML = `
    <div class="miniCard">
      <div class="logItemTitle">Latest recommendation</div>
      <div class="metricPair"><span>Calories</span><span>${result.target_calories} kcal</span></div>
      <div class="metricPair"><span>Risk</span><span><span class="pill ${result.risk_level}">${result.risk_level.toUpperCase()}</span></span></div>
    </div>
  `;
  document.getElementById('progressOverviewList').innerHTML = `
    <div class="miniCard"><div class="logItemTitle">Weight overview</div><div class="muted small">BMI ${result.bmi} as latest reference.</div></div>
    <div class="miniCard"><div class="logItemTitle">Workout overview</div><div class="muted small">${result.workout_plan.length} workout days suggested.</div></div>
    <div class="miniCard"><div class="logItemTitle">Meal overview</div><div class="muted small">${result.meal_plan.length} meal days suggested.</div></div>
  `;
}

async function loadLogs() {
  const res = await fetch('/api/logs?limit=12');
  const rows = await res.json();
  renderHistory(rows);
  renderAudit(rows);
}

async function submitForm(ev) {
  ev.preventDefault();
  const payload = readForm();
  document.getElementById('formErrors').style.display = 'none';
  document.getElementById('formErrors').innerHTML = '';

  document.getElementById('mealCount').textContent = (payload.meal_photos || '').split(',').filter(Boolean).length;
  document.getElementById('bodyCount').textContent = (payload.body_photos || '').split(',').filter(Boolean).length;
  document.getElementById('reportCount').textContent = (payload.reports || '').split(',').filter(Boolean).length;
  document.getElementById('mealPreviewText').textContent = payload.meal_photos || 'No meal photos uploaded.';
  document.getElementById('bodyPreviewText').textContent = payload.body_photos || 'No body photos uploaded.';
  document.getElementById('reportPreviewText').textContent = payload.reports || 'No reports uploaded.';

  const res = await fetch('/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok || !data.ok) {
    const box = document.getElementById('formErrors');
    box.style.display = 'block';
    box.innerHTML = `<strong>Validation errors</strong><div style="height:8px"></div>` + (data.errors || ['Request failed']).map(x => `<div class="miniCard">${x}</div>`).join('');
    return;
  }

  state = data;
  const profile = data.profile;
  const result = data.result;

  updatePreview(profile);
  updateProfileCard(profile, result);
  updateAnalysis(result);
  updateRecommendationTables(result);
  renderExplanation(result);
  renderAlert(result);
  updateProgressAndComparison(result);
  updateCharts(result);

  document.getElementById('riskNarrative').textContent = (result.safety_flags || []).join(' • ');
  document.getElementById('riskUpdated').textContent = `Last update: ${new Date().toLocaleTimeString()}`;
  document.getElementById('explainHistory').innerHTML = `
    <tr><td>${new Date().toLocaleString()}</td><td><span class="pill ${result.risk_level}">${result.risk_level.toUpperCase()}</span></td><td>${result.explanation.decision_summary}</td></tr>
  `;
  document.getElementById('topUserName').textContent = profile.name;
  document.getElementById('topUserRole').textContent = `${profile.goal.replace('_', ' ')} • ${profile.activity_level}`;
  setPill(document.getElementById('riskPill'), result.risk_level, `Risk: ${result.risk_level.toUpperCase()}`);
  setPill(document.getElementById('inputStatusPill'), result.risk_level === 'low' ? 'low' : result.risk_level, `Input Status: ${result.status}`);

  await loadLogs();
  showSection('analysis');
}

document.getElementById('refreshLogsBtn').addEventListener('click', loadLogs);
form.addEventListener('submit', submitForm);

loadLogs();
