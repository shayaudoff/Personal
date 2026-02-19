/* ── CONFIG ─────────────────────────────────── */
const CONTACT_PHONE  = '+18452760867';
const INSTAGRAM_URL  = 'https://instagram.com/shya_udf/';
const WHATSAPP_URL   = `https://wa.me/${CONTACT_PHONE.replace(/\D/g, '')}`;
const PUBLIC_KEY     = 'vaKSM9weRLDJcMVac';
const SERVICE_ID     = 'service_xccl9pp';
const TEMPLATE_ID    = 'template_hk6j6tb';
const MODE_STORAGE_KEY = 'stalker_mode_v1';

/* ── MODE CONFIG ────────────────────────────── */
const modeConfig = {
  curious: {
    subtitle: 'Welcome to the curiosity audit. Answer carefully. Or don\'t. We\'re watching either way.',
    verdictHeading: 'Verdict',
    verdictSubheading: 'Run a case check. It is dramatic, not judicial.',
    monitorText: 'Live session active — scroll depth being logged. Professionally.',
    rules: [
      'Lurk responsibly.',
      'Screenshots are permanent.',
      'If you wanted attention, there are faster protocols.',
      "Don't overthink the timeline.",
      "Be cool. It's free.",
    ],
    responses: {
      curious:      'Calm curiosity. Solid opening posture. Very relatable.',
      'heard-name': 'Reasonable. Good names travel. Bad ones travel faster.',
      research:     'Respect. Evidence before conclusions. You prepared.',
      vibe:         'Vibe check accepted. Status: no red flags. Yet.',
      accident:     'Understood. The five-second scroll trail suggests intention.',
      'not-stalking':'Statement filed. Confidence noted. Eye contact maintained.',
    }
  },
  fan: {
    subtitle: 'Support energy detected. Keep it stylish, honest, and not too much.',
    verdictHeading: 'Verdict: Support File',
    verdictSubheading: 'You are being graded for commitment and composure.',
    monitorText: 'Fan mode active — enthusiasm metrics enabled. Keep it classy.',
    rules: [
      'Lurk with style, not noise.',
      'Screenshots are permanent.',
      'If you wanted attention, there are faster protocols.',
      'Support loudly, spiral quietly.',
      'Keep timelines clean and claims cleaner.',
    ],
    responses: {
      curious:      'Appreciated. Curious fans are top tier. Gold star.',
      'heard-name': 'Respect. Word of mouth did its job. Tell them thanks.',
      research:     'Disciplined fan behavior. You studied the material.',
      vibe:         'Vibe check passed. Energy is premium. Carry on.',
      accident:     'Even accidents can be loyal. Noted and appreciated.',
      'not-stalking':'Correct. This is high-effort support. We see it.',
    }
  },
  investigator: {
    subtitle: 'Case file open. Keep statements measurable and claims sourced.',
    verdictHeading: 'Verdict: Case Review',
    verdictSubheading: 'Controlled humor. Strictly no real surveillance.',
    monitorText: 'Investigator mode — evidence collection in progress. Do not tamper.',
    rules: [
      'Lurk responsibly.',
      'Screenshots are permanent.',
      'Document first, theorize second.',
      'If you wanted attention, there are faster protocols.',
      'Be cool. It is still free.',
      'Conclusions must match evidence volume.',
    ],
    responses: {
      curious:      'Intent logged: low-risk curiosity. Proceed.',
      'heard-name': 'Source attribution accepted. Continue investigation.',
      research:     'Method approved. Proceed with caution and good notes.',
      vibe:         'Signal stable. No escalation. Status: clear.',
      accident:     'Accident claim archived as insufficient. Try again.',
      'not-stalking':'Statement recorded. Credibility: moderate. File open.',
    }
  }
};

const verdictLines = [
  "Verdict: you're here on purpose. The URL didn't find itself.",
  'Verdict: curiosity confirmed. You read three paragraphs before reconsidering.',
  'Verdict: this was not an accidental click path. We checked.',
  'Verdict: investigative instincts detected. Strong career in lurking ahead.',
  'Verdict: you read more than most people. That says a lot.',
  'Verdict: strong attention to detail. Screenshot game probably immaculate.',
  'Verdict: subtle stalking, clean execution. Respectful form.',
  'Verdict: you came for context and stayed for evidence.',
  'Verdict: this level of focus is almost professional. Almost.',
  'Verdict: you wanted the full file, not the summary. And here you are.',
];

const evidenceLog = [
  'Subject loaded page at {time}.',
  'Subject selected intent: "{intent}".',
  'Subject ran background check. Voluntarily.',
  'Subject clicked "Say Hi" panel — interest confirmed.',
  'Subject read the Rules of Engagement in full.',
  'Subject is still here. Noted.',
  'Subject attempted emergency exit. Returned.',
  'Subject examined Q&A section. Asking questions about the Q&A section.',
  'Subject scrolled past the footer. Impressive commitment.',
];

const redFlagPool = [
  'Read the fine print on the form.',
  'Hovered on the emergency exit button before deciding not to use it.',
  'Switched modes more than once. Very suspicious.',
  'Pressed every intent button.',
  'Scrolled back up after reaching the bottom.',
  'Actually read this red flag section.',
  'Spent more than 2 minutes on this page.',
  'Ran the background check more than once.',
];

/* ── DOM REFS ─────────────────────────────── */
const modeTabs         = document.querySelectorAll('.mode-tab');
const modeSubtitle     = document.getElementById('modeSubtitle');
const verdictHeading   = document.getElementById('verdictHeading');
const verdictSubheading= document.getElementById('verdictSubheading');
const rulesList        = document.getElementById('rulesList');
const monitorText      = document.getElementById('monitorText');
const intentButtons    = document.querySelectorAll('.stalker-intent-btn');
const resultCard       = document.getElementById('intentResult');
const resultText       = document.getElementById('intentResultText');
const lurkFill         = document.getElementById('lurkFill');
const lurkValue        = document.getElementById('lurkValue');
const lurkLabel        = document.getElementById('lurkLabel');
const lurkTrack        = document.querySelector('.stalker-meter-track');
const caseFileCard     = document.getElementById('caseFileCard');
const caseIntent       = document.getElementById('caseIntent');
const caseLurk         = document.getElementById('caseLurk');
const caseBtns         = document.getElementById('caseBtns');
const runVerdictBtn    = document.getElementById('runVerdict');
const verdictOutput    = document.getElementById('verdictOutput');
const verdictStatus    = document.getElementById('verdictStatus');
const verdictLine      = document.getElementById('verdictLine');
const verdictDisclaimer= document.getElementById('verdictDisclaimer');
const sayHiBtn         = document.getElementById('sayHiBtn');
const sayHiPanel       = document.getElementById('sayHiPanel');
const dmLink           = document.getElementById('dmLink');
const textLink         = document.getElementById('textLink');
const fastExitInstagram= document.getElementById('fastExitInstagram');
const emergencyExit    = document.getElementById('emergencyExit');
const leadForm         = document.getElementById('leadForm');
const leadName         = document.getElementById('leadName');
const leadNameError    = document.getElementById('leadNameError');
const leadPhone        = document.getElementById('leadPhone');
const leadEmail        = document.getElementById('leadEmail');
const leadInsta        = document.getElementById('leadInsta');
const leadReason       = document.getElementById('leadReason');
const leadConsent      = document.getElementById('leadConsent');
const leadSubmit       = document.getElementById('leadSubmit');
const leadPhoneError   = document.getElementById('leadPhoneError');
const leadContactError = document.getElementById('leadContactError');
const leadReasonError  = document.getElementById('leadReasonError');
const leadStatus       = document.getElementById('leadStatus');
const leadTextAction   = document.getElementById('leadTextAction');
const firstNameField   = document.getElementById('firstName');
const lastNameField    = document.getElementById('lastName');
const emailField       = document.getElementById('email');
const reasonField      = document.getElementById('reason');
const mobileToggle     = document.getElementById('mobileToggle');
const sidePanel        = document.getElementById('sidePanel');
const closePanel       = document.getElementById('closePanel');
const toast            = document.getElementById('stalkerToast');
const scrollProgress   = document.getElementById('scrollProgress');
const clickCounter     = document.getElementById('clickCount');
const btnCounter       = document.getElementById('btnCount');
const scrollDepthEl    = document.getElementById('scrollDepth');
const evidenceTicker   = document.getElementById('evidenceTicker');
const redFlagList      = document.getElementById('redFlagList');

/* ── STATE ────────────────────────────────── */
let currentMode     = getInitialMode();
let selectedIntent  = null;
let lurkLevel       = 12;
let verdictIndex    = 0;
let verdictBusy     = false;
let lastVerdictLine = 'none';
let totalClicks     = 0;
let totalBtns       = 0;
let maxScrollDepth  = 0;
let redFlagIndex    = 0;
let emergencyCount  = 0;
const eventLog      = [];

/* ── INIT ─────────────────────────────────── */
init();

function init() {
  if (window.emailjs) window.emailjs.init(PUBLIC_KEY);

  dmLink.href           = INSTAGRAM_URL;
  fastExitInstagram.href = INSTAGRAM_URL;
  textLink.href         = WHATSAPP_URL;
  if (leadTextAction) leadTextAction.href = WHATSAPP_URL;

  bindNav();
  bindModeTabs();
  bindIntentButtons();
  bindVerdict();
  bindCtaAndExits();
  bindLeadForm();
  bindScrollTracking();
  bindGlobalClickCount();
  bindListHoverFlags();

  logEvent('page_loaded', 'stalker evaluation initialized');
  applyMode(currentMode);
  renderLurkLevel();
  updateEvidenceTicker('Subject loaded page at ' + new Date().toLocaleTimeString() + '.');
}

/* ── NAV ──────────────────────────────────── */
function bindNav() {
  mobileToggle?.addEventListener('click', () => {
    sidePanel.classList.add('open');
    logEvent('mobile_menu_open', 'opened');
  });
  closePanel?.addEventListener('click', () => {
    sidePanel.classList.remove('open');
  });
  document.addEventListener('click', (e) => {
    if (sidePanel.classList.contains('open') &&
        !sidePanel.contains(e.target) &&
        !mobileToggle.contains(e.target)) {
      sidePanel.classList.remove('open');
    }
  });
}

/* ── MODE TABS ────────────────────────────── */
function bindModeTabs() {
  modeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const mode = tab.dataset.mode;
      if (!mode || mode === currentMode || !modeConfig[mode]) return;
      currentMode = mode;
      localStorage.setItem(MODE_STORAGE_KEY, currentMode);
      logEvent('mode_changed', mode);
      applyMode(currentMode);
      showToast(`Mode switched: ${mode}. The vibe has shifted.`);
      addRedFlag('Switched modes. Clearly undecided.');
      increaseLurkLevel(5);
    });
  });
}

/* ── INTENT BUTTONS ───────────────────────── */
function bindIntentButtons() {
  intentButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedIntent = btn.dataset.intent || null;
      intentButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const response = modeConfig[currentMode].responses[selectedIntent] || 'Intent noted.';
      resultText.textContent = response;
      reveal(resultCard);
      resultCard.classList.add('is-shaking');
      setTimeout(() => resultCard.classList.remove('is-shaking'), 600);

      logEvent('intent_clicked', `${btn.textContent.trim()} | mode=${currentMode}`);
      updateEvidenceTicker(`Subject selected intent: "${btn.textContent.trim()}".`);
      increaseLurkLevel();
      renderCaseFile();

      totalBtns++;
      btnCounter.textContent = totalBtns;
    });
  });
}

/* ── VERDICT ──────────────────────────────── */
function bindVerdict() {
  if (!runVerdictBtn) return;
  runVerdictBtn.addEventListener('click', () => {
    if (verdictBusy) return;
    verdictBusy = true;
    runVerdictBtn.disabled = true;
    logEvent('verdict_clicked', `mode=${currentMode}`);
    updateEvidenceTicker('Subject ran background check. Voluntarily.');
    if (verdictIndex > 0) addRedFlag('Ran the background check more than once.');

    verdictLine.textContent = '';
    verdictDisclaimer.textContent = '';

    // Animated loading dots
    let step = 0;
    const steps = ['Scanning records', 'Cross-referencing scroll data', 'Consulting the algorithm', 'Finalizing verdict'];
    const dotsHtml = ' <span class="loading-dots"><span>.</span><span>.</span><span>.</span></span>';
    const ticker = setInterval(() => {
      verdictStatus.innerHTML = steps[step % steps.length] + dotsHtml;
      step++;
    }, 320);

    setTimeout(() => {
      clearInterval(ticker);
      lastVerdictLine = verdictLines[verdictIndex % verdictLines.length];
      verdictStatus.textContent = 'Background check complete ✅';
      verdictLine.textContent = lastVerdictLine;
      verdictDisclaimer.textContent = "Relax. I can't actually do that. This is a website, not a federal agency. The lurk meter is just vibes.";
      verdictIndex++;
      verdictBusy = false;
      runVerdictBtn.disabled = false;
      reveal(verdictOutput);
      increaseLurkLevel(6);
      logEvent('verdict_shown', lastVerdictLine);
    }, 1100);
  });
}

/* ── CTA / EXITS ──────────────────────────── */
function bindCtaAndExits() {
  sayHiBtn?.addEventListener('click', () => {
    const open = sayHiPanel.classList.contains('is-visible');
    if (open) {
      sayHiPanel.classList.remove('is-visible');
      sayHiPanel.setAttribute('aria-hidden', 'true');
    } else {
      sayHiPanel.setAttribute('aria-hidden', 'false');
      reveal(sayHiPanel);
      updateEvidenceTicker('Subject clicked "Say Hi" panel. Interest confirmed.');
      showToast('Bold move. Respect.');
      increaseLurkLevel(4);
    }
  });

  emergencyExit?.addEventListener('click', () => {
    emergencyCount++;
    logEvent('emergency_exit', `attempt #${emergencyCount}`);

    if (emergencyCount === 1) {
      emergencyExit.textContent = "🚨 Just kidding, I'm definitely not stalking";
      emergencyExit.classList.add('panic');
      showToast('Nice try. The page is still open.');
    } else if (emergencyCount === 2) {
      emergencyExit.textContent = '🫣 Okay I was a little looking';
      showToast('There it is. We knew.');
      addRedFlag('Clicked emergency exit twice. Did not leave.');
    } else {
      window.location.href = '/';
    }
  });
}

/* ── LEAD FORM ────────────────────────────── */
function bindLeadForm() {
  if (!leadForm) return;

  leadReason.addEventListener('change', () => logEvent('dropdown_changed', leadReason.value || 'none'));
  leadName.addEventListener('change', () => logEvent('field_edited', 'name'));
  leadPhone.addEventListener('change', () => logEvent('field_edited', 'phone'));
  leadEmail.addEventListener('change', () => logEvent('field_edited', 'email'));
  leadInsta.addEventListener('change', () => logEvent('field_edited', 'instagram_handle'));
  leadConsent.addEventListener('change', () => logEvent('consent_toggled', leadConsent.checked ? 'checked' : 'unchecked'));

  leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearLeadErrors();
    leadStatus.textContent = '';

    const nameRaw     = leadName.value.trim();
    const phoneRaw    = leadPhone.value.trim();
    const emailRaw    = leadEmail.value.trim();
    const instaRaw    = leadInsta.value.trim();
    const phoneDigits = phoneRaw.replace(/\D/g, '');
    const hasPhone    = phoneRaw.length > 0;
    const hasEmail    = emailRaw.length > 0;
    const hasInsta    = instaRaw.length > 0;
    const phoneValid  = !hasPhone || (/^\+?[\d\s().-]{10,}$/.test(phoneRaw) && phoneDigits.length >= 10);
    const emailValid  = !hasEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw);
    const instaValid  = !hasInsta || /^@?[A-Za-z0-9._]{1,30}$/.test(instaRaw);
    const hasValidContactMethod = (hasPhone && phoneValid) || (hasEmail && emailValid) || (hasInsta && instaValid);
    const reasonOk    = Boolean(leadReason.value);
    let valid = true;

    if (!nameRaw)    { leadNameError.textContent = 'Name is required.'; valid = false; }
    if (!phoneValid) { leadPhoneError.textContent = 'Enter a valid phone number. A real one.'; valid = false; }
    if (!emailValid) { leadContactError.textContent = 'Enter a valid email address.'; valid = false; }
    if (!instaValid) { leadContactError.textContent = 'Enter a valid Instagram handle (letters, numbers, dots, underscores).'; valid = false; }
    if (!hasValidContactMethod) {
      leadContactError.textContent = 'Add at least one valid contact method (phone, email, or Instagram). I cannot reach out to vibes.';
      valid = false;
    }
    if (!reasonOk)   { leadReasonError.textContent = 'Select a reason. Honesty is free.'; valid = false; }

    logEvent('submit_attempt', `valid=${valid} | mode=${currentMode} | intent=${selectedIntent||'none'} | lurk=${lurkLevel}%`);
    if (!valid) return;

    populateTemplateFields();
    leadSubmit.disabled = true;
    leadSubmit.textContent = 'Sending…';

    try {
      await window.emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, leadForm);
      logEvent('submit_result', 'success');
      leadStatus.textContent = "Received. Bold move. If you're feeling it, just text me too.";
      reveal(leadStatus);
      showLeadTextAction();
      showToast('Message sent. Nice work.');
    } catch (err) {
      logEvent('submit_result', `failure: ${err?.text || err?.message || 'unknown'}`);
      leadStatus.textContent = "That didn't go through. Don't overcomplicate it — just text.";
      reveal(leadStatus);
      showLeadTextAction();
    } finally {
      leadSubmit.disabled = false;
      leadSubmit.textContent = '📤 Send It';
    }
  });
}

/* ── SCROLL TRACKING ──────────────────────── */
function bindScrollTracking() {
  window.addEventListener('scroll', () => {
    const docHeight   = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled    = Math.min(100, Math.round((window.scrollY / docHeight) * 100));
    const progress    = (window.scrollY / docHeight) * 100;

    if (scrollProgress) scrollProgress.style.width = `${progress}%`;
    if (scrollDepthEl)  scrollDepthEl.textContent   = `${scrolled}%`;

    if (scrolled > maxScrollDepth) {
      maxScrollDepth = scrolled;
      if (scrolled >= 50 && maxScrollDepth < 51) {
        showToast('Halfway through. Still here. Respect.');
        increaseLurkLevel(4);
      }
      if (scrolled >= 90 && maxScrollDepth < 91) {
        showToast('You read everything. You are the intended audience.');
        addRedFlag('Scrolled past 90% of the page. Full commitment.');
        increaseLurkLevel(8);
      }
    }
  }, { passive: true });
}

/* ── GLOBAL CLICK COUNT ───────────────────── */
function bindGlobalClickCount() {
  document.addEventListener('click', () => {
    totalClicks++;
    if (clickCounter) clickCounter.textContent = totalClicks;

    // Milestone toasts
    if (totalClicks === 10)  showToast('10 clicks. You are engaged.');
    if (totalClicks === 20)  showToast('20 clicks. This is a whole thing now.');
    if (totalClicks === 30)  { showToast('30 clicks. We should hang out honestly.'); increaseLurkLevel(10); }
  });
}

/* ── LIST HOVER FLAGS ─────────────────────── */
function bindListHoverFlags() {
  let rulesHovered = false;
  rulesList?.addEventListener('mouseover', () => {
    if (!rulesHovered) {
      rulesHovered = true;
      addRedFlag('Read the Rules of Engagement section in full.');
    }
  });
}

/* ── POPULATE TEMPLATE ────────────────────── */
function populateTemplateFields() {
  const full  = leadName.value.trim();
  const parts = full ? full.split(/\s+/) : [];
  firstNameField.value = parts.length ? parts[0] : 'Stalker';
  lastNameField.value  = parts.length > 1 ? parts.slice(1).join(' ') : 'Lead';
  emailField.value     = leadEmail.value.trim() || 'stalker@local.invalid';
  if (!leadPhone.value.trim()) {
    leadPhone.value = leadEmail.value.trim() || leadInsta.value.trim() || 'contact-provided-in-report';
  }
  reasonField.value    = buildReport();
}

function buildReport() {
  const now = new Date().toISOString();
  const el  = getIntentLabel();
  const lines = eventLog.map((e, i) => `${i+1}) ${e.ts} | ${e.type} | ${e.detail}`);
  return [
    '[STALKER EVALUATION REPORT]',
    `timestamp: ${now}`,
    'page: stalker',
    `mode: ${currentMode}`,
    `intent: ${el}`,
    `lurk_level: ${lurkLevel}%`,
    `max_scroll: ${maxScrollDepth}%`,
    `total_clicks: ${totalClicks}`,
    `verdict_last: ${lastVerdictLine}`,
    `phone: ${leadPhone.value.trim()}`,
    `email: ${leadEmail.value.trim() || 'none'}`,
    `instagram_handle: ${leadInsta.value.trim() || 'none'}`,
    `text_consent: ${leadConsent.checked ? 'yes' : 'no'}`,
    `name: ${leadName.value.trim() || 'none'}`,
    `dropdown_reason: ${leadReason.value || 'none'}`,
    '---',
    'Event timeline:',
    ...lines
  ].join('\n');
}

function getIntentLabel() {
  if (!selectedIntent) return 'none';
  const b = document.querySelector(`.stalker-intent-btn[data-intent="${selectedIntent}"]`);
  return b ? b.textContent.trim() : selectedIntent;
}

/* ── MODE APPLY ───────────────────────────── */
function applyMode(mode) {
  const cfg = modeConfig[mode];

  modeTabs.forEach(tab => {
    const active = tab.dataset.mode === mode;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-pressed', active ? 'true' : 'false');
  });

  swapCopy(modeSubtitle, cfg.subtitle);
  swapCopy(verdictHeading, cfg.verdictHeading);
  swapCopy(verdictSubheading, cfg.verdictSubheading);
  if (monitorText) monitorText.textContent = cfg.monitorText;
  replaceRules(cfg.rules);

  if (selectedIntent) {
    resultText.textContent = cfg.responses[selectedIntent] || 'Intent noted.';
    reveal(resultCard);
  }

  const isInvestigator = mode === 'investigator';
  caseFileCard.hidden = !isInvestigator;
  if (isInvestigator) reveal(caseFileCard);
  renderCaseFile();
}

function replaceRules(rules) {
  rulesList.innerHTML = '';
  rules.forEach(r => { const li = document.createElement('li'); li.textContent = r; rulesList.appendChild(li); });
  reveal(rulesList);
}

function swapCopy(el, text) {
  if (!el) return;
  el.classList.add('copy-fade');
  el.textContent = text;
  reveal(el);
}

/* ── LURK LEVEL ───────────────────────────── */
function lurkLevelText(n) {
  if (n <= 15)  return 'Harmless curiosity';
  if (n <= 30)  return 'Mildly suspicious';
  if (n <= 50)  return 'Suspicious but acceptable';
  if (n <= 70)  return 'Professional lurker';
  if (n <= 90)  return 'Elite stalking operations';
  if (n < 100)  return 'Full commitment. Respect.';
  return 'Alright. We see you. We respect you.';
}

function renderLurkLevel() {
  lurkFill.style.width = `${lurkLevel}%`;
  lurkValue.textContent = `${lurkLevel}%`;
  lurkLabel.textContent = lurkLevelText(lurkLevel);
  lurkTrack.setAttribute('aria-valuenow', String(lurkLevel));

  // Color shift
  lurkFill.classList.remove('suspicious', 'busted');
  if (lurkLevel > 60) lurkFill.classList.add('suspicious');
  if (lurkLevel > 85) lurkFill.classList.add('busted');

  if (caseLurk) caseLurk.textContent = `${lurkLevel}%`;
  renderCaseFile();
}

function increaseLurkLevel(amount) {
  const inc = amount ?? (Math.floor(Math.random() * 12) + 7);
  lurkLevel = Math.min(100, lurkLevel + inc);

  // Pop animation on value
  lurkValue.classList.remove('pop');
  void lurkValue.offsetWidth;
  lurkValue.classList.add('pop');
  setTimeout(() => lurkValue.classList.remove('pop'), 400);

  renderLurkLevel();
}

function renderCaseFile() {
  if (currentMode !== 'investigator') return;
  if (caseIntent) caseIntent.textContent = getIntentLabel();
  if (caseLurk)   caseLurk.textContent   = `${lurkLevel}%`;
  if (caseBtns)   caseBtns.textContent   = `${totalBtns}`;
}

/* ── RED FLAGS ────────────────────────────── */
function addRedFlag(text) {
  if (!redFlagList) return;
  const li = document.createElement('li');
  li.textContent = text;
  li.style.opacity = '0';
  li.style.transform = 'translateX(-8px)';
  redFlagList.appendChild(li);
  requestAnimationFrame(() => {
    li.style.transition = 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)';
    li.style.opacity    = '1';
    li.style.transform  = 'translateX(0)';
  });
}

/* ── EVIDENCE TICKER ──────────────────────── */
function updateEvidenceTicker(msg) {
  if (!evidenceTicker) return;
  evidenceTicker.style.opacity = '0';
  setTimeout(() => {
    evidenceTicker.textContent = msg;
    evidenceTicker.style.opacity = '1';
  }, 200);
}

/* ── TOAST ────────────────────────────────── */
let toastTimer = null;
function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ── REVEAL ───────────────────────────────── */
function reveal(el) {
  if (!el) return;
  el.classList.remove('is-visible');
  requestAnimationFrame(() => el.classList.add('is-visible'));
}

/* ── HELPERS ──────────────────────────────── */
function logEvent(type, detail) {
  eventLog.push({ ts: new Date().toISOString(), type, detail });
}

function showLeadTextAction() {
  if (!leadTextAction) return;
  leadTextAction.hidden = false;
  reveal(leadTextAction);
}

function clearLeadErrors() {
  if (leadNameError) leadNameError.textContent = '';
  leadPhoneError.textContent = '';
  if (leadContactError) leadContactError.textContent = '';
  leadReasonError.textContent = '';
}

function getInitialMode() {
  const stored = localStorage.getItem(MODE_STORAGE_KEY);
  return (stored && modeConfig[stored]) ? stored : 'curious';
}
