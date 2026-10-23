(() => {
  const QUESTION_TIME = 20; // seconds
  const MAX_POINTS = 1000;
  const SHAPES = ["▲", "◆", "●", "■"];

  const $ = (id) => document.getElementById(id);
  const state = { quiz: null, length: 10, questions: [], index: 0, score: 0, streak: 0, correct: 0, log: [], timer: null, startedAt: 0, locked: false };

  // ---------- helpers ----------
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const pick = (arr, n) => shuffle(arr).slice(0, n);
  const flagEmoji = (code) => String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));

  const storage = {
    get(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
    set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* storage unavailable */ } }
  };

  function show(screen) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    $(`screen-${screen}`).classList.add("active");
    window.scrollTo(0, 0);
  }

  function poolFor(quiz) {
    if (!quiz.filter) return COUNTRIES;
    const allowed = [].concat(quiz.filter);
    return COUNTRIES.filter((c) => allowed.includes(c.continent));
  }

  // Distractors come from the same continent when possible, so questions stay challenging.
  function distractors(country, pool, key) {
    const others = pool.filter((c) => c.code !== country.code);
    const near = others.filter((c) => c.continent === country.continent);
    const source = near.length >= 3 ? near : others;
    return pick(source, 3).map((c) => c[key]);
  }

  // ---------- question builders ----------
  const builders = {
    flag(country, pool) {
      return { text: "Which country does this flag belong to?", media: { flag: country.code }, answer: country.name, options: shuffle([country.name, ...distractors(country, pool, "name")]) };
    },
    capital(country, pool) {
      return { text: `What is the capital of ${country.name}?`, answer: country.capital, options: shuffle([country.capital, ...distractors(country, pool, "capital")]) };
    },
    reverse(country, pool) {
      return { text: "Which country has this capital?", media: { word: country.capital }, answer: country.name, options: shuffle([country.name, ...distractors(country, pool, "name")]) };
    },
    continent(country) {
      const wrong = pick(CONTINENTS.filter((c) => c !== country.continent), 3);
      return { text: `Which continent is ${country.name} in?`, media: { flag: country.code }, answer: country.continent, options: shuffle([country.continent, ...wrong]) };
    }
  };

  function buildQuestions(quiz, length) {
    const pool = poolFor(quiz);
    const eligible = quiz.type === "continent" ? pool.filter((c) => !TRANSCONTINENTAL.has(c.code)) : pool;
    const types = ["flag", "capital", "reverse", "continent"];
    return pick(eligible, Math.min(length, eligible.length)).map((country, i) => {
      let type = quiz.type === "mixed" ? types[i % types.length] : quiz.type;
      if (type === "continent" && TRANSCONTINENTAL.has(country.code)) type = "flag";
      return { ...builders[type](country, pool), country };
    });
  }

  // ---------- home ----------
  function renderHome() {
    $("quiz-grid").innerHTML = "";
    QUIZZES.forEach((quiz) => {
      const best = storage.get(`best:${quiz.id}`);
      const card = document.createElement("button");
      card.className = "quiz-card";
      card.innerHTML = `
        <div class="cover" style="background:${quiz.color}">${quiz.emoji}</div>
        <div class="body">
          <h3></h3><p></p>
          <div class="meta">${poolFor(quiz).length} countries${best ? ` · Best: ${best.score.toLocaleString()}` : ""}</div>
        </div>`;
      card.querySelector("h3").textContent = quiz.title;
      card.querySelector("p").textContent = quiz.desc;
      card.addEventListener("click", () => openLobby(quiz));
      $("quiz-grid").appendChild(card);
    });
    show("home");
  }

  function openLobby(quiz) {
    state.quiz = quiz;
    $("lobby-emoji").textContent = quiz.emoji;
    $("lobby-title").textContent = quiz.title;
    $("lobby-desc").textContent = quiz.desc;
    const best = storage.get(`best:${quiz.id}`);
    $("lobby-best").textContent = best ? `Your best: ${best.score.toLocaleString()} pts (${best.correct}/${best.total})` : "";
    show("lobby");
  }

  // ---------- play ----------
  function startQuiz() {
    Object.assign(state, { questions: buildQuestions(state.quiz, state.length), index: 0, score: 0, streak: 0, correct: 0, log: [] });
    show("play");
    renderQuestion();
  }

  function renderQuestion() {
    const q = state.questions[state.index];
    state.locked = false;
    $("q-counter").textContent = `${state.index + 1} / ${state.questions.length}`;
    $("q-score").textContent = `${state.score.toLocaleString()} pts`;
    $("q-streak").textContent = state.streak >= 2 ? `🔥 ${state.streak} streak` : "";
    $("q-text").textContent = q.text;
    $("feedback").textContent = "";
    $("feedback").className = "feedback";

    const media = $("q-media");
    media.innerHTML = "";
    if (q.media?.flag) {
      // Flag images from flagcdn; fall back to the emoji flag when offline.
      const img = document.createElement("img");
      img.className = "flag";
      img.alt = "Flag";
      img.src = `https://flagcdn.com/w640/${q.media.flag}.png`;
      img.onerror = () => { media.innerHTML = `<div class="flag-emoji">${flagEmoji(q.media.flag)}</div>`; };
      media.appendChild(img);
    } else if (q.media?.word) {
      const word = document.createElement("div");
      word.className = "big-word";
      word.textContent = q.media.word;
      media.appendChild(word);
    }

    const answers = $("answers");
    answers.innerHTML = "";
    q.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.className = "answer";
      btn.innerHTML = `<span class="shape">${SHAPES[i]}</span><span class="label"></span>`;
      btn.querySelector(".label").textContent = opt;
      btn.addEventListener("click", () => answer(opt));
      answers.appendChild(btn);
    });

    startTimer();
  }

  function startTimer() {
    clearInterval(state.timer);
    state.startedAt = performance.now();
    const fill = $("timer-fill");
    const tick = () => {
      const left = Math.max(0, QUESTION_TIME - (performance.now() - state.startedAt) / 1000);
      fill.style.width = `${(left / QUESTION_TIME) * 100}%`;
      fill.classList.toggle("low", left < 5);
      if (left <= 0) answer(null);
    };
    tick();
    state.timer = setInterval(tick, 100);
  }

  // Scoring follows quiz.com/Kahoot style: up to 1000 pts, decaying to 500 at the buzzer, plus a streak bonus.
  function answer(choice) {
    if (state.locked) return;
    state.locked = true;
    clearInterval(state.timer);

    const q = state.questions[state.index];
    const elapsed = Math.min(QUESTION_TIME, (performance.now() - state.startedAt) / 1000);
    const isCorrect = choice === q.answer;
    let gained = 0;
    if (isCorrect) {
      state.streak += 1;
      state.correct += 1;
      gained = Math.round(MAX_POINTS * (1 - elapsed / QUESTION_TIME / 2)) + Math.min(state.streak - 1, 5) * 100;
      state.score += gained;
    } else {
      state.streak = 0;
    }
    state.log.push({ q, choice, isCorrect, gained });

    document.querySelectorAll(".answer").forEach((btn) => {
      btn.disabled = true;
      const label = btn.querySelector(".label").textContent;
      if (label === q.answer) btn.classList.add("correct");
      else btn.classList.add("dim");
    });
    const fb = $("feedback");
    if (isCorrect) { fb.textContent = `Correct! +${gained}`; fb.className = "feedback ok"; }
    else { fb.textContent = choice === null ? `Time's up! It was ${q.answer}` : `Wrong, it was ${q.answer}`; fb.className = "feedback bad"; }
    $("q-score").textContent = `${state.score.toLocaleString()} pts`;

    setTimeout(next, 1600);
  }

  function next() {
    state.index += 1;
    if (state.index < state.questions.length) renderQuestion();
    else showResults();
  }

  // ---------- results ----------
  function showResults() {
    const total = state.questions.length;
    const key = `best:${state.quiz.id}`;
    const prev = storage.get(key);
    const isBest = !prev || state.score > prev.score;
    if (isBest) storage.set(key, { score: state.score, correct: state.correct, total });

    $("r-score").textContent = `${state.score.toLocaleString()} pts`;
    $("r-stats").innerHTML = `
      <div><b>${state.correct}/${total}</b>correct</div>
      <div><b>${Math.round((state.correct / total) * 100)}%</b>accuracy</div>
      <div><b>${isBest ? "🏆 New!" : prev.score.toLocaleString()}</b>best score</div>`;

    const review = $("r-review");
    review.innerHTML = "";
    state.log.forEach(({ q, choice, isCorrect }) => {
      const row = document.createElement("div");
      row.className = "review-item";
      row.innerHTML = `<span></span><span class="mark"></span>`;
      row.children[0].textContent = `${flagEmoji(q.country.code)} ${q.text.replace("?", "")}: ${q.answer}`;
      row.children[1].textContent = isCorrect ? "✔" : `✘ ${choice ?? "no answer"}`;
      row.children[1].style.color = isCorrect ? "var(--ok)" : "var(--bad)";
      review.appendChild(row);
    });
    show("results");
  }

  // ---------- wiring ----------
  $("length-picker").addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c === btn));
    state.length = Number(btn.dataset.len);
  });
  $("start-btn").addEventListener("click", startQuiz);
  $("again-btn").addEventListener("click", startQuiz);
  $("back-btn").addEventListener("click", renderHome);
  $("home-btn").addEventListener("click", renderHome);
  $("home-link").addEventListener("click", (e) => { e.preventDefault(); clearInterval(state.timer); renderHome(); });

  // Keys 1-4 pick an answer while playing.
  document.addEventListener("keydown", (e) => {
    if (!$("screen-play").classList.contains("active")) return;
    const n = Number(e.key);
    if (n >= 1 && n <= 4) document.querySelectorAll(".answer")[n - 1]?.click();
  });

  renderHome();
})();
