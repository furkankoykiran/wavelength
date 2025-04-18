(() => {
    // ───── State ─────
    const state = {
      lang: localStorage.getItem('lang') || 'en',
      theme: localStorage.getItem('theme') || 'light',
      teams: [],
      currentTeam: 0,
      targetAngle: 0,
      totalScore: 0,
      isTargetVisible: true,
      canMoveNeedle: false
    };
    let i18n = {};
  
    // ───── Element References ─────
    const htmlEl        = document.documentElement;
    const themeBtn      = document.getElementById('themeToggleBtn');
    const langSelect    = document.getElementById('langSelect');
    const setupSection  = document.getElementById('setup');
    const gameSection   = document.getElementById('game');
    const teamCountIn   = document.getElementById('teamCount');
    const teamNamesDiv  = document.getElementById('teamNames');
    const startBtn      = document.getElementById('startBtn');
    const scoreboardDiv = document.getElementById('scoreboard');
    const targetArea    = document.getElementById('targetArea');
    const needle        = document.getElementById('needle');
    const needleCont    = document.getElementById('needleContainer');
    const leftClueEl    = document.getElementById('leftClue');
    const rightClueEl   = document.getElementById('rightClue');
    const toggleBtn     = document.getElementById('toggleBtn');
    const nextBtn       = document.getElementById('nextBtn');
    const newGameBtn    = document.getElementById('newGameBtn');
    const scoreDisp     = document.getElementById('scoreDisplay');
    const modal         = document.getElementById('howToPlayModal');
    const helpBtn       = document.getElementById('helpBtn');
    const closeModal    = document.querySelector('.close');
  
    // ───── Theme ─────
    function applyTheme(t) {
      htmlEl.setAttribute('data-theme', t);
      themeBtn.textContent = t === 'light' ? '🌙' : '☀️';
      localStorage.setItem('theme', t);
    }
    themeBtn.addEventListener('click', () => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      applyTheme(state.theme);
    });
  
    // ───── i18n ─────
    async function loadLocale(lang) {
      const res = await fetch(`locales/${lang}.json`);
      return res.json();
    }
    async function applyLocale(lang) {
      i18n = await loadLocale(lang);
      document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = i18n[el.dataset.i18n] || el.textContent;
      });
      localStorage.setItem('lang', lang);
    }
    langSelect.value = state.lang;
    langSelect.addEventListener('change', () => {
      state.lang = langSelect.value;
      applyLocale(state.lang);
    });
  
    // ───── Setup Screen ─────
    function renderTeamInputs() {
      teamNamesDiv.innerHTML = '';
      for (let i = 0; i < +teamCountIn.value; i++) {
        const inp = document.createElement('input');
        inp.type = 'text';
        inp.placeholder = `${i+1}. ${i18n.teamName || 'Team'}`;
        inp.className = 'team-input';
        teamNamesDiv.append(inp);
      }
    }
    teamCountIn.addEventListener('input', renderTeamInputs);
  
    startBtn.addEventListener('click', () => {
      // Read teams
      state.teams = Array.from(teamNamesDiv.children).map(i => ({
        name: i.value || i.placeholder, score: 0
      }));
      if (state.teams.length === 0) {
        state.teams = [{ name: i18n.oneTeam || 'Individual', score: 0 }];
      }
      setupSection.hidden = true;
      gameSection.hidden = false;
      renderScoreboard();
      startRound();
    });
  
    // ───── Scoreboard ─────
    function renderScoreboard() {
      scoreboardDiv.innerHTML = state.teams.map((t,i) =>
        `<div${i===state.currentTeam? ' class="current"' : ''}>${t.name}: ${t.score}</div>`
      ).join('');
    }
  
    // ───── Start New Round ─────
    function startRound() {
      // Random angle - reduced range for more precision
      state.targetAngle = Math.random()*150 - 75; // Reduced from ±90 to ±75
      // Draw target slice with color gradients - 5 segments
      const deg = a => a + 90;
      targetArea.style.background = `
        conic-gradient(
          from -90deg at 50% 100%,
          var(--bg) 0deg ${deg(state.targetAngle-20)}deg,
          var(--danger-light) ${deg(state.targetAngle-20)}deg ${deg(state.targetAngle-15)}deg,
          var(--danger) ${deg(state.targetAngle-15)}deg ${deg(state.targetAngle-10)}deg,
          var(--warning) ${deg(state.targetAngle-10)}deg ${deg(state.targetAngle-5)}deg,
          var(--accent) ${deg(state.targetAngle-5)}deg ${deg(state.targetAngle+5)}deg,
          var(--warning) ${deg(state.targetAngle+5)}deg ${deg(state.targetAngle+10)}deg,
          var(--danger) ${deg(state.targetAngle+10)}deg ${deg(state.targetAngle+15)}deg,
          var(--danger-light) ${deg(state.targetAngle+15)}deg ${deg(state.targetAngle+20)}deg,
          var(--bg) ${deg(state.targetAngle+20)}deg 180deg
        )
      `;
      
      // Use clues in local language
      const currentLangClues = clues[state.lang] || clues['en']; // Fallback to English
      const randomIndex = Math.floor(Math.random() * currentLangClues.length);
      const [l, r] = currentLangClues[randomIndex];
      
      leftClueEl.textContent = l;
      rightClueEl.textContent = r;
      
      // Reset needle
      needle.style.transform = 'rotate(0deg)';
      scoreDisp.textContent = '';
      toggleBtn.textContent = i18n.hideTarget || 'Hide Target';
      state.isTargetVisible = true;
      state.canMoveNeedle = false; // Disable needle movement when target is visible
    }
  
    // ───── Calculate Score ─────
    function calcScore(angle) {
      const diff = Math.abs(angle - state.targetAngle);
      if (diff <= 5) return 5;
      if (diff <= 10) return 4;
      if (diff <= 15) return 3;
      if (diff <= 20) return 2;
      return 0;
    }
  
    // ───── Needle Movement ─────
    let dragging = false;
    function onDown(e) { 
      if (!state.canMoveNeedle) return; // Only allow dragging when needle can be moved
      dragging = true; 
      e.preventDefault(); 
    }
    function onMove(e) {
      if (!dragging || !state.canMoveNeedle) return; // Only move if dragging is allowed
      const rect = needleCont.getBoundingClientRect();
      const cx = rect.left + rect.width/2, cy = rect.bottom;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      let ang = Math.atan2(x-cx, cy-y)*180/Math.PI;
      ang = Math.max(-90, Math.min(90, ang));
      needle.style.transform = `rotate(${ang}deg)`;
    }
    function onUp() { dragging = false; }
    needleCont.addEventListener('mousedown', onDown);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    needleCont.addEventListener('touchstart', onDown);
    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', onUp);
  
    // ───── Buttons ─────
    toggleBtn.addEventListener('click', () => {
      if (state.isTargetVisible) {
        // Hide → guess
        targetArea.style.display = 'none';
        toggleBtn.textContent = i18n.revealTarget || 'Reveal Target';
        state.canMoveNeedle = true; // Enable needle movement when target is hidden
      } else {
        // Show → calculate score
        const angle = parseFloat(needle.style.transform.replace('rotate(','').replace('deg)','')) || 0;
        const pts = calcScore(angle);
        state.teams[state.currentTeam].score += pts;
        scoreDisp.textContent = `${i18n.score || 'Score'}: ${pts} ${i18n.points || 'Points'}`;
        renderScoreboard();
        targetArea.style.display = 'block';
        toggleBtn.hidden = true;
        state.canMoveNeedle = false; // Disable needle movement when target is revealed
      }
      state.isTargetVisible = !state.isTargetVisible;
    });
  
    nextBtn.addEventListener('click', () => {
      state.currentTeam = (state.currentTeam+1) % state.teams.length;
      toggleBtn.hidden = false;
      renderScoreboard();
      startRound();
    });
  
    newGameBtn.addEventListener('click', () => {
      state.teams.forEach(t=> t.score=0);
      state.currentTeam = 0;
      renderScoreboard();
      startRound();
    });
    
    // ───── Modal Controls ─────
    helpBtn.addEventListener('click', () => {
      modal.style.display = 'flex';
    });
    
    closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  
    // ───── Init ─────
    applyTheme(state.theme);
    applyLocale(state.lang).then(renderTeamInputs);
  })();
  