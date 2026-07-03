// ── QUIZ DATA ──
const questions = [
  {
    q: "What does CSS stand for?",
    opts: ["Computer Style Sheets","Cascading Style Sheets","Creative Style System","Coded Style Syntax"],
    correct: 1
  },
  {
    q: "Which HTML tag is used to link an external JavaScript file?",
    opts: ["&lt;link&gt;","&lt;js&gt;","&lt;script&gt;","&lt;javascript&gt;"],
    correct: 2
  },
  {
    q: "What does 'DOM' stand for in web development?",
    opts: ["Document Object Model","Data Object Method","Display Output Module","Document Order Map"],
    correct: 0
  },
  {
    q: "Which of these is NOT a JavaScript data type?",
    opts: ["String","Boolean","Float","Undefined"],
    correct: 2
  },
  {
    q: "What does 'API' stand for?",
    opts: ["Applied Program Interface","Application Programming Interface","Automated Process Integration","Advanced Protocol Interface"],
    correct: 1
  }
];

// ── QUIZ STATE ──
let current = 0;
let score = 0;
let timerInterval = null;
let timeLeft = 15;
let answered = false;

// ── TIMER ──
function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 15;
  answered = false;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    const pct = (timeLeft / 15) * 100;
    document.getElementById('progress-bar').style.width = pct + '%';
    if (timeLeft <= 5) {
      document.getElementById('progress-bar').style.background = '#ef4444';
    } else {
      document.getElementById('progress-bar').style.background = '#1a6bff';
    }
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      if (!answered) timeUp();
    }
  }, 1000);
}

function updateTimerDisplay() {
  document.getElementById('timer-display').textContent = timeLeft;
}

// ── ANSWER SELECTION ──
function selectAnswer(btn, isCorrect) {
  if (answered) return;
  answered = true;
  clearInterval(timerInterval);
  const opts = document.querySelectorAll('.quiz-opt');
  opts.forEach((opt, i) => {
    opt.classList.add('disabled');
    if (i === questions[current].correct) opt.classList.add('correct');
  });
  if (isCorrect) {
    btn.classList.remove('disabled');
    btn.classList.add('correct');
    score++;
    showResult(true);
  } else {
    btn.classList.remove('disabled');
    btn.classList.add('wrong');
    showResult(false);
  }
}

// ── TIME UP ──
function timeUp() {
  answered = true;
  const opts = document.querySelectorAll('.quiz-opt');
  opts.forEach((opt, i) => {
    opt.classList.add('disabled');
    if (i === questions[current].correct) opt.classList.add('correct');
  });
  document.getElementById('result-emoji').textContent = '⏰';
  document.getElementById('result-text').textContent = "Time's up!";
  document.getElementById('result-sub').textContent = 'You ran out of time on that one.';
  document.getElementById('next-btn').textContent = current < questions.length - 1 ? 'Next question →' : 'See your score →';
  document.getElementById('quiz-result').classList.add('show');
}

// ── SHOW RESULT ──
function showResult(correct) {
  if (correct) {
    document.getElementById('result-emoji').textContent = '🎉';
    document.getElementById('result-text').textContent = 'Correct!';
    document.getElementById('result-sub').textContent = 'Nice one. Speed bonus added to your score.';
  } else {
    document.getElementById('result-emoji').textContent = '❌';
    document.getElementById('result-text').textContent = 'Not quite!';
    document.getElementById('result-sub').textContent = 'The correct answer is highlighted above.';
  }
  document.getElementById('next-btn').textContent = current < questions.length - 1 ? 'Next question →' : 'See your score →';
  document.getElementById('quiz-result').classList.add('show');
}

// ── NEXT QUESTION ──
function nextQuestion() {
  current++;
  if (current >= questions.length) {
    showFinalScore();
    return;
  }
  const q = questions[current];
  const letters = ['A','B','C','D'];
  document.getElementById('q-num').textContent = `Question ${current + 1} of ${questions.length}`;
  document.getElementById('q-text').textContent = q.q;
  const optsContainer = document.getElementById('q-options');
  optsContainer.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const isCorrect = i === q.correct;
    const btn = document.createElement('button');
    btn.className = 'quiz-opt';
    btn.innerHTML = `<span class="opt-letter">${letters[i]}</span> ${opt}`;
    btn.onclick = () => selectAnswer(btn, isCorrect);
    optsContainer.appendChild(btn);
  });
  document.getElementById('quiz-result').classList.remove('show');
  document.getElementById('progress-bar').style.background = '#1a6bff';
  startTimer();
}

// ── FINAL SCORE ──
function showFinalScore() {
  const pct = Math.round((score / questions.length) * 100);
  let emoji = pct >= 80 ? '🏆' : pct >= 60 ? '🎯' : '💪';
  let msg = pct >= 80 ? 'Outstanding!' : pct >= 60 ? 'Good effort!' : 'Keep practising!';
  let sub = pct >= 80
    ? `You scored ${score}/${questions.length}. You'd dominate the leaderboard. Sign up to compete for real.`
    : `You scored ${score}/${questions.length}. Sign up to practise and improve your score.`;
  document.getElementById('q-num').textContent = 'Sample complete';
  document.getElementById('q-text').textContent = `You scored ${score} out of ${questions.length}`;
  document.getElementById('q-options').innerHTML = `
    <div style="text-align:center;padding:1rem 0">
      <div style="font-size:48px;margin-bottom:.5rem">${emoji}</div>
      <div style="font-family:'Space Grotesk',sans-serif;font-size:20px;font-weight:700;margin-bottom:.5rem">${msg}</div>
      <div style="font-size:14px;color:var(--muted);line-height:1.6;max-width:300px;margin:0 auto 1.5rem">${sub}</div>
      <button class="btn-big btn-big-blue" style="margin-bottom:10px;width:100%">Sign up and play for real</button>
      <button class="btn-big btn-big-outline" style="width:100%;font-size:14px;padding:10px" onclick="restartQuiz()">Try again</button>
    </div>
  `;
  document.getElementById('quiz-result').classList.remove('show');
  clearInterval(timerInterval);
  document.getElementById('timer-display').textContent = '—';
}

// ── RESTART ──
function restartQuiz() {
  current = 0;
  score = 0;
  const q = questions[0];
  const letters = ['A','B','C','D'];
  document.getElementById('q-num').textContent = 'Question 1 of 5';
  document.getElementById('q-text').textContent = q.q;
  const optsContainer = document.getElementById('q-options');
  optsContainer.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const isCorrect = i === q.correct;
    const btn = document.createElement('button');
    btn.className = 'quiz-opt';
    btn.innerHTML = `<span class="opt-letter">${letters[i]}</span> ${opt}`;
    btn.onclick = () => selectAnswer(btn, isCorrect);
    optsContainer.appendChild(btn);
  });
  document.getElementById('quiz-result').classList.remove('show');
  document.getElementById('progress-bar').style.background = '#1a6bff';
  document.getElementById('progress-bar').style.width = '100%';
  startTimer();
}

// ── MOBILE STICKY MODES SCROLL ──
(function(){
  function isMobile(){ return window.innerWidth <= 768; }

  const STEP = 120;
  const TOTAL = 8;

  function setupMobileScroll(){
    if(!isMobile()) return;

    const scrollSpace = document.getElementById('modes-scroll-space');
    const cards = document.querySelectorAll('.mstack-card');
    const counter = document.getElementById('modes-counter');
    const section = document.getElementById('modes-section');

    scrollSpace.style.height = (STEP * (TOTAL - 1)) + 'px';

    function update(){
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const scrolled = window.scrollY - sectionTop - 300;
      const idx = Math.max(0, Math.min(TOTAL - 1, Math.floor(scrolled / STEP)));

      cards.forEach((c, i) => {
        c.classList.remove('active','below');
        if(i === idx) c.classList.add('active');
        else if(i === idx + 1) c.classList.add('below');
      });

      counter.textContent = (idx + 1) + ' / ' + TOTAL;
    }

    window.addEventListener('scroll', update, {passive:true});
    update();
  }

  window.addEventListener('load', setupMobileScroll);
  window.addEventListener('resize', function(){
    if(!isMobile()){
      document.querySelectorAll('.mstack-card').forEach(c => c.classList.remove('active','below'));
    } else {
      setupMobileScroll();
    }
  });
})();

// ── START ──
startTimer();