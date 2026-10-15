/* ==========================================================
   闯关吧 · 公共脚本
   文件：js/app.js
   说明：全站共用一个脚本，用 <body data-page="xxx"> 判断当前页面，
        再执行对应的初始化函数。
   包含：主题切换、手机导航、本地存储、首页统计、答题引擎
        （倒计时 / 判分 / 错题本 / 成绩记录）、结果页、错题本、排行榜。
   ========================================================== */
(function () {
  'use strict';

  /* ---------------- 1. 通用小工具 ---------------- */

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

  function esc(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  /* 打乱数组顺序（Fisher-Yates），用于每轮题目乱序，增加重玩价值 */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* 秒数转成 "2 分 15 秒" */
  function humanTime(sec) {
    sec = Math.max(0, Math.round(sec));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m > 0 ? m + ' 分 ' + s + ' 秒' : s + ' 秒';
  }

  /* 时间显示成 "10 月 13 日 21:05" */
  function humanDate(iso) {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    const pad = n => (n < 10 ? '0' + n : '' + n);
    return (d.getMonth() + 1) + ' 月 ' + d.getDate() + ' 日 ' +
      pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

  /* ---------------- 2. 本地存储 ---------------- */

  const KEY_THEME = 'qz_theme';
  const KEY_WRONG = 'qz_wrong';        // 错题本：题目编号数组
  const KEY_RECORDS = 'qz_records';    // 成绩记录：数组
  const KEY_LAST = 'qz_last';          // 最近一次结果，结果页读取

  const memory = {};                   // 本地存储不可用时兜底，保证页面不报错

  const store = {
    get(key, def) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : def;
      } catch (e) {
        return memory[key] !== undefined ? memory[key] : def;
      }
    },
    set(key, val) {
      memory[key] = val;
      try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* 用内存兜底 */ }
    },
    remove(key) {
      delete memory[key];
      try { localStorage.removeItem(key); } catch (e) { /* 忽略 */ }
    }
  };

  const getWrong = () => store.get(KEY_WRONG, []);
  const isWrong = id => getWrong().indexOf(id) > -1;

  function addWrong(id) {
    const list = getWrong();
    if (list.indexOf(id) === -1) { list.push(id); store.set(KEY_WRONG, list); }
  }

  function removeWrong(id) {
    store.set(KEY_WRONG, getWrong().filter(x => x !== id));
  }

  const getRecords = () => store.get(KEY_RECORDS, []);

  function saveRecord(rec) {
    const list = getRecords();
    list.unshift(rec);
    store.set(KEY_RECORDS, list.slice(0, 100));   // 只保留最近 100 条
  }

  /* ---------------- 3. 主题（默认深色） ---------------- */

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    $$('.js-theme').forEach(btn => {
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('title', theme === 'dark' ? '切换到浅色模式' : '切换到深色模式');
    });
  }

  function initTheme() {
    /* 本站默认就是深色，用户手动切过之后按用户的来 */
    applyTheme(store.get(KEY_THEME, 'dark'));
    $$('.js-theme').forEach(btn => btn.addEventListener('click', function () {
      const now = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      store.set(KEY_THEME, now);
      applyTheme(now);
      toast(now === 'dark' ? '已切换到深色模式' : '已切换到浅色模式');
    }));
  }

  /* ---------------- 4. 头部导航 / 手机抽屉 ---------------- */

  function initHeader() {
    const toggle = $('.nav-toggle');
    const nav = $('.main-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        nav.classList.toggle('open');
        toggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
      });
    }
    const page = document.body.dataset.page;
    $$('.main-nav a').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (page && href.indexOf(page + '.html') > -1) a.classList.add('active');
    });
  }

  /* ---------------- 5. 轻提示 / 弹窗 / 返回顶部 ---------------- */

  let toastTimer = null;
  function toast(msg) {
    let el = $('.toast');
    if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2000);
  }

  function openModal(html) {
    let mask = $('.modal-mask');
    if (!mask) {
      mask = document.createElement('div');
      mask.className = 'modal-mask';
      mask.addEventListener('click', e => { if (e.target === mask) closeModal(); });
      document.body.appendChild(mask);
    }
    mask.innerHTML = '<div class="modal">' + html + '</div>';
    mask.classList.add('show');
  }

  function closeModal() {
    const mask = $('.modal-mask');
    if (mask) mask.classList.remove('show');
  }

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  function initToTop() {
    const btn = document.createElement('button');
    btn.className = 'to-top';
    btn.title = '回到顶部';
    btn.textContent = '↑';
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.body.appendChild(btn);
    const onScroll = () => btn.classList.toggle('show', window.scrollY > 380);
    window.addEventListener('scroll', onScroll);
    onScroll();
  }

  /* 圆环进度：给一个 SVG 圆设置描边进度，0 到 1 */
  function setRing(circle, ratio) {
    if (!circle) return;
    const r = Number(circle.getAttribute('r'));
    const c = 2 * Math.PI * r;
    circle.setAttribute('stroke-dasharray', c.toFixed(2));
    circle.setAttribute('stroke-dashoffset', (c * (1 - Math.max(0, Math.min(1, ratio)))).toFixed(2));
  }

  /* 评分等级 */
  function gradeOf(score) {
    if (score >= 90) return { cls: 'grade-a', text: 'A 级 · 优秀', tip: '这一轮几乎全对，可以挑战别的题库了。' };
    if (score >= 75) return { cls: 'grade-b', text: 'B 级 · 良好', tip: '基础挺扎实，把错题过一遍就更稳了。' };
    if (score >= 60) return { cls: 'grade-c', text: 'C 级 · 及格', tip: '及格了，错题本里那几题值得再看一遍。' };
    return { cls: 'grade-d', text: 'D 级 · 继续加油', tip: '先把错题搞懂，再来一局会好很多。' };
  }

  /* ---------------- 6. 首页 ---------------- */

  function bestOf(bankKey) {
    const list = getRecords().filter(r => r.bankKey === bankKey && r.mode !== 'practice');
    return list.length ? Math.max.apply(null, list.map(r => r.score)) : null;
  }

  function wrongCountOfBank(bankKey) {
    return getWrong().filter(function (id) {
      const hit = findQuestion(id);
      return hit && hit.bank.key === bankKey;
    }).length;
  }

  function initHome() {
    const grid = $('#bankGrid');
    const records = getRecords().filter(r => r.mode !== 'practice');

    if (grid) {
      grid.innerHTML = BANKS.map(function (b, i) {
        const best = bestOf(b.key);
        const wrongInBank = wrongCountOfBank(b.key);
        return '' +
          '<article class="bank-card bank-' + b.key + '" style="--i:' + i + '">' +
            '<div class="top">' +
              '<span class="emoji">' + b.emoji + '</span>' +
              '<div class="name">' + esc(b.name) + '</div>' +
              '<div class="desc">' + esc(b.desc) + '</div>' +
            '</div>' +
            '<div class="body">' +
              '<div class="meta">' +
                '<span class="badge badge-brand">共 ' + b.questions.length + ' 题</span>' +
                '<span class="badge">' + esc(b.time) + '</span>' +
                (best !== null ? '<span class="badge badge-accent">最好成绩 ' + best + ' 分</span>' : '') +
                (wrongInBank ? '<span class="badge badge-bad">错题 ' + wrongInBank + '</span>' : '') +
              '</div>' +
              '<div class="foot">' +
                '<a class="btn btn-primary" href="quiz.html?bank=' + b.key + '">开始挑战</a>' +
              '</div>' +
            '</div>' +
            '<a class="card-link" href="quiz.html?bank=' + b.key + '" aria-label="开始' +
              esc(b.name) + '"></a>' +
          '</article>';
      }).join('');
    }

    /* 首页三个统计数字 */
    const totalEl = $('#statTotal');
    if (totalEl) totalEl.textContent = totalQuestions();
    const roundEl = $('#statRounds');
    if (roundEl) roundEl.textContent = records.length;
    const wrongEl = $('#statWrong');
    if (wrongEl) wrongEl.textContent = getWrong().length;

    /* 最近一次成绩 */
    const lastBox = $('#lastBox');
    if (lastBox) {
      const last = records[0];
      if (!last) {
        lastBox.innerHTML = '<div class="empty">' +
          '<h3>还没有答题记录</h3><p>挑一个题库开始第一局，成绩会自动记在这里</p>' +
          '<a class="btn btn-primary" href="quiz.html?bank=cs">先来一局计算机基础</a></div>';
      } else {
        const g = gradeOf(last.score);
        lastBox.innerHTML =
          '<div class="panel" style="display:flex;align-items:center;gap:20px;flex-wrap:wrap">' +
            '<div style="font-size:34px;font-weight:800;color:var(--brand);font-variant-numeric:tabular-nums">' +
              last.score + '<span style="font-size:14px;color:var(--muted)"> 分</span></div>' +
            '<div style="flex:1;min-width:180px">' +
              '<div style="font-weight:700">' + esc(last.bankName) + '　' +
                '<span class="badge ' + g.cls.replace('grade-', 'badge-') + '">' + g.text + '</span></div>' +
              '<div class="sub">答对 ' + last.correct + ' / ' + last.total + ' 题　用时 ' +
                humanTime(last.timeUsed) + '　' + humanDate(last.date) + '</div>' +
            '</div>' +
            '<div style="display:flex;gap:10px">' +
              '<a class="btn btn-soft" href="result.html">看详情</a>' +
              '<a class="btn btn-ghost" href="quiz.html?bank=' + last.bankKey + '">再来一局</a>' +
            '</div>' +
          '</div>';
      }
    }
  }

  /* ---------------- 7. 答题引擎 ---------------- */

  const QUESTION_TIME = 20;      // 每题限时（秒）
  const NEXT_DELAY = 1800;       // 答完之后自动进下一题的等待时间（毫秒）

  function initQuiz() {
    const box = $('#quizBox');
    if (!box) return;

    const params = new URLSearchParams(location.search);
    const bankKey = params.get('bank') || BANKS[0].key;
    const isPractice = bankKey === 'wrong';   // 错题重练模式

    /* 组装本轮题目 */
    let round;
    let bankName;
    if (isPractice) {
      const ids = getWrong();
      round = shuffle(ids.map(function (id) {
        const hit = findQuestion(id);
        return hit ? hit.question : null;
      }).filter(Boolean));
      bankName = '错题重练';
    } else {
      const bank = findBank(bankKey);
      if (!bank) { location.replace('index.html'); return; }
      round = shuffle(bank.questions);        // 题目顺序每轮打乱，重玩不腻
      bankName = bank.name;
    }

    if (!round.length) {
      box.innerHTML = '<div class="empty">' +
        '<h3>错题本是空的</h3><p>目前没有需要重练的题目，说明你最近答得不错</p>' +
        '<a class="btn btn-primary" href="index.html">回到首页选题库</a></div>';
      return;
    }

    document.title = bankName + ' · 答题中 - 闯关吧';

    /* 本轮状态。phase 用来表示答题状态机：答题中 / 已作答 / 已结束 */
    const state = {
      index: 0,
      correct: 0,
      phase: 'answering',
      answers: [],
      startedAt: Date.now(),
      timeLeft: QUESTION_TIME,
      tick: null,
      advance: null
    };

    const elQ = $('#questionText');
    const elOpts = $('#options');
    const elExplain = $('#explain');
    const elCounter = $('#counter');
    const elProgress = $('#progressBar');
    const elTimer = $('#timer');
    const elTimerNum = $('#timerNum');
    const elRing = $('#timerRing');
    const elNext = $('#btnNext');

    $('#tagRow').innerHTML = '<span class="badge badge-brand">' + esc(bankName) + '</span>' +
      '<span class="badge">共 ' + round.length + ' 题</span>' +
      '<span class="badge">每题 ' + QUESTION_TIME + ' 秒</span>' +
      (isPractice ? '<span class="badge badge-accent">错题重练</span>' : '');

    /* 7.1 倒计时 */
    function paintTimer() {
      setRing(elRing, state.timeLeft / QUESTION_TIME);
      elTimerNum.textContent = Math.ceil(state.timeLeft);
      elTimer.classList.toggle('low', state.timeLeft <= 5);
    }

    function startTimer() {
      stopTimer();
      state.timeLeft = QUESTION_TIME;
      state.tick = setInterval(function () {
        state.timeLeft -= 0.1;
        if (state.timeLeft <= 0) {
          state.timeLeft = 0;
          paintTimer();
          stopTimer();
          if (state.phase === 'answering') answer(-1);   // -1 表示超时未作答
          return;
        }
        paintTimer();
      }, 100);
      paintTimer();
    }

    function stopTimer() {
      if (state.tick) { clearInterval(state.tick); state.tick = null; }
    }

    /* 7.2 渲染一道题 */
    function renderQuestion() {
      const q = round[state.index];
      state.phase = 'answering';
      elCounter.innerHTML = '第 <b>' + (state.index + 1) + '</b> / ' + round.length + ' 题';
      elProgress.style.width = (state.index / round.length * 100) + '%';
      elQ.textContent = q.q;
      elExplain.style.display = 'none';
      elExplain.innerHTML = '';
      elNext.style.display = 'none';

      elOpts.innerHTML = q.options.map(function (opt, i) {
        return '<button class="option" data-i="' + i + '">' +
          '<span class="letter">' + LETTERS[i] + '</span>' +
          '<span class="text">' + esc(opt) + '</span>' +
          '<span class="mark"></span>' +
        '</button>';
      }).join('');

      startTimer();
    }

    /* 7.3 作答：picked 是选项下标，-1 表示超时 */
    function answer(picked) {
      if (state.phase !== 'answering') return;
      state.phase = 'answered';
      stopTimer();

      const q = round[state.index];
      const isRight = picked === q.answer;
      if (isRight) state.correct++;

      /* 顺手同步错题本：答对移出，答错加入 */
      if (isRight) { removeWrong(q.id); } else { addWrong(q.id); }

      state.answers.push({
        id: q.id,
        q: q.q,
        options: q.options,
        answer: q.answer,
        explain: q.explain,
        picked: picked
      });

      $$('.option', elOpts).forEach(function (btn) {
        const i = Number(btn.dataset.i);
        btn.disabled = true;
        const mark = $('.mark', btn);
        if (i === q.answer) {
          btn.classList.add('correct');
          mark.textContent = '✓';
        } else if (i === picked) {
          btn.classList.add('wrong');
          mark.textContent = '✕';
        } else {
          btn.classList.add('dim');
        }
      });

      const head = isRight ? '答对了' : (picked === -1 ? '超时了' : '答错了');
      elExplain.innerHTML = '<div class="head">' + head + '</div>' +
        '<p>正确答案是 ' + LETTERS[q.answer] + '：' + esc(q.options[q.answer]) +
        '　' + esc(q.explain) + '</p>';
      elExplain.style.display = '';

      elNext.style.display = '';
      elNext.textContent = (state.index === round.length - 1) ? '查看本轮结果 →' : '下一题 →';
      state.advance = setTimeout(next, NEXT_DELAY);
    }

    /* 7.4 下一题 / 结束 */
    function next() {
      if (state.advance) { clearTimeout(state.advance); state.advance = null; }
      if (state.index < round.length - 1) {
        state.index++;
        renderQuestion();
        return;
      }
      finish();
    }

    function finish() {
      state.phase = 'done';
      stopTimer();
      elProgress.style.width = '100%';

      const total = round.length;
      const score = Math.round(state.correct / total * 100);
      const result = {
        bankKey: isPractice ? 'wrong' : bankKey,
        bankName: bankName,
        mode: isPractice ? 'practice' : 'normal',
        score: score,
        correct: state.correct,
        total: total,
        timeUsed: Math.round((Date.now() - state.startedAt) / 1000),
        date: new Date().toISOString(),
        answers: state.answers
      };

      store.set(KEY_LAST, result);
      if (!isPractice) {
        saveRecord({
          bankKey: result.bankKey,
          bankName: result.bankName,
          mode: 'normal',
          score: result.score,
          correct: result.correct,
          total: result.total,
          timeUsed: result.timeUsed,
          date: result.date
        });
      }
      location.href = 'result.html';
    }

    /* 7.5 事件绑定 */
    elOpts.addEventListener('click', function (e) {
      const btn = e.target.closest('.option');
      if (!btn || btn.disabled) return;
      answer(Number(btn.dataset.i));
    });

    elNext.addEventListener('click', next);

    $('#btnQuit').addEventListener('click', function () {
      openModal('<h3>要结束本轮吗</h3>' +
        '<p class="modal-sub">已经答完的题目不会计入成绩，下次要从头开始。</p>' +
        '<div class="modal-actions">' +
          '<button class="btn btn-ghost" id="btnStay">继续答题</button>' +
          '<button class="btn btn-danger" id="btnLeave">结束本轮</button>' +
        '</div>');
      $('#btnStay').addEventListener('click', closeModal);
      $('#btnLeave').addEventListener('click', function () {
        stopTimer();
        if (state.advance) clearTimeout(state.advance);
        location.href = 'index.html';
      });
    });

    /* 键盘快捷操作：数字 1-4 或字母 A-D 选答案，回车进下一题 */
    document.addEventListener('keydown', function (e) {
      if (state.phase === 'answering' && /^[1-4]$/.test(e.key)) {
        answer(Number(e.key) - 1);
      } else if (state.phase === 'answering' && /^[a-dA-D]$/.test(e.key)) {
        answer(e.key.toUpperCase().charCodeAt(0) - 65);
      } else if (state.phase === 'answered' && e.key === 'Enter') {
        next();
      }
    });

    renderQuestion();
  }

  /* ---------------- 8. 结果页 ---------------- */

  /* 生成一个选项行，标出正确答案和用户的选择 */
  function optionRowsHTML(q, picked) {
    return q.options.map(function (opt, i) {
      let cls = '';
      let tail = '';
      if (i === q.answer) { cls = 'is-ok'; tail = '　✓ 正确答案'; }
      else if (i === picked) { cls = 'is-bad'; tail = '　✕ 你的选择'; }
      return '<div class="q-opt ' + cls + '">' + LETTERS[i] + '. ' + esc(opt) + tail + '</div>';
    }).join('');
  }

  function wrongItemHTML(q, picked, removable) {
    return '<div class="q-item" data-qid="' + q.id + '">' +
      '<div class="q-head"><span class="badge badge-bad">错题</span>' +
        '<div class="q-text">' + esc(q.q) + '</div></div>' +
      '<div class="q-opts">' + optionRowsHTML(q, picked) + '</div>' +
      '<div class="q-explain">' + esc(q.explain) + '</div>' +
      (removable
        ? '<div class="q-foot"><button class="btn btn-sm btn-ghost js-know" data-qid="' +
            q.id + '">已掌握，移出错题本</button></div>'
        : '') +
    '</div>';
  }

  function initResult() {
    const box = $('#resultBox');
    if (!box) return;

    const r = store.get(KEY_LAST, null);
    if (!r) {
      box.innerHTML = '<div class="empty">' +
        '<h3>还没有本轮成绩</h3><p>先去做一局题，结果会自动显示在这里</p>' +
        '<a class="btn btn-primary" href="index.html">去选题库</a></div>';
      return;
    }

    const g = gradeOf(r.score);
    const wrongs = r.answers.filter(a => a.picked !== a.answer);
    const scoreColor = r.score >= 90 ? 'var(--ok)' : (r.score >= 60 ? 'var(--brand)' : 'var(--bad)');

    box.innerHTML =
      '<div class="result-hero">' +
        '<div class="score-ring">' +
          '<svg width="168" height="168" viewBox="0 0 168 168">' +
            '<circle class="ring-bg" cx="84" cy="84" r="76"></circle>' +
            '<circle class="ring-fg" id="scoreRing" cx="84" cy="84" r="76"></circle>' +
          '</svg>' +
          '<div class="inner"><div class="score" style="color:' + scoreColor + '">' +
            r.score + '</div><div class="unit">总分 100</div></div>' +
        '</div>' +
        '<div class="result-info">' +
          '<div class="grade-badge ' + g.cls + '">' + g.text + '</div>' +
          '<h1>' + esc(r.bankName) + ' 本轮成绩</h1>' +
          '<p class="sub">' + g.tip + '</p>' +
          '<div class="result-facts" style="margin-top:16px">' +
            '<div class="fact"><div class="v">' + r.correct + ' / ' + r.total + '</div>' +
              '<div class="k">答对题数</div></div>' +
            '<div class="fact"><div class="v">' + Math.round(r.correct / r.total * 100) + '%</div>' +
              '<div class="k">正确率</div></div>' +
            '<div class="fact"><div class="v">' + humanTime(r.timeUsed) + '</div>' +
              '<div class="k">本轮用时</div></div>' +
            '<div class="fact"><div class="v">' + wrongs.length + '</div>' +
              '<div class="k">本轮错题</div></div>' +
          '</div>' +
          '<div class="result-actions">' +
            '<a class="btn btn-primary btn-lg" href="quiz.html?bank=' +
              (r.mode === 'practice' ? 'wrong' : r.bankKey) + '">再来一局</a>' +
            '<a class="btn btn-ghost btn-lg" href="index.html">换个题库</a>' +
            '<a class="btn btn-ghost btn-lg" href="wrong.html">错题本</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<section class="section" style="margin-bottom:0">' +
        '<div class="section-head"><h2>本轮错题回顾</h2>' +
          '<span class="sub">' + (wrongs.length ? '共 ' + wrongs.length + ' 题' : '本轮全对') + '</span>' +
        '</div>' +
        (wrongs.length
          ? '<div class="q-list">' + wrongs.map(function (a) {
              const hit = findQuestion(a.id);
              return wrongItemHTML(hit ? hit.question : a, a.picked, false);
            }).join('') + '</div>'
          : '<div class="empty"><h3>全部答对</h3>' +
            '<p>这个题库可以挑战满分速度了</p>' +
            '<a class="btn btn-primary" href="rank.html">看看排行榜</a></div>') +
      '</section>';

    /* 分数环动画：先把进度设为 0，下一帧再设成实际值，才有过渡效果 */
    const ring = $('#scoreRing');
    setRing(ring, 0);
    requestAnimationFrame(function () {
      setTimeout(function () { setRing(ring, r.score / 100); }, 60);
    });
  }

  /* ---------------- 9. 错题本 ---------------- */

  let wrongFilter = 'all';

  function renderWrong() {
    const listEl = $('#wrongList');
    if (!listEl) return;

    const ids = getWrong();
    const items = ids.map(function (id) {
      const hit = findQuestion(id);
      return hit ? hit : null;
    }).filter(Boolean);

    const shown = wrongFilter === 'all'
      ? items : items.filter(it => it.bank.key === wrongFilter);

    $('#wrongCount').textContent = items.length;
    $('#btnPractice').style.display = items.length ? '' : 'none';

    if (!shown.length) {
      listEl.innerHTML = '<div class="empty"><h3>' +
        (items.length ? '这个题库没有错题' : '错题本是空的') + '</h3><p>' +
        (items.length ? '换个分类看看' : '答错的题目会自动收进这里，答对之后自动移出') +
        '</p><a class="btn btn-primary" href="index.html">去答题</a></div>';
      return;
    }

    listEl.innerHTML = shown.map(function (it) {
      return '<div class="q-item" data-qid="' + it.question.id + '">' +
        '<div class="q-head">' +
          '<span class="badge badge-brand">' + esc(it.bank.name) + '</span>' +
          '<div class="q-text">' + esc(it.question.q) + '</div>' +
        '</div>' +
        '<div class="q-opts">' + optionRowsHTML(it.question, null) + '</div>' +
        '<div class="q-explain">' + esc(it.question.explain) + '</div>' +
        '<div class="q-foot">' +
          '<button class="btn btn-sm btn-ghost js-know" data-qid="' + it.question.id +
            '">已掌握，移出错题本</button>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function initWrong() {
    if (!$('#wrongList')) return;

    const chips = $('#wrongChips');
    chips.innerHTML = '<button class="chip" data-k="all">全部</button>' +
      BANKS.map(b => '<button class="chip" data-k="' + b.key + '">' +
        b.emoji + ' ' + b.name + '</button>').join('');

    chips.addEventListener('click', function (e) {
      const btn = e.target.closest('.chip');
      if (!btn) return;
      wrongFilter = btn.dataset.k;
      $$('.chip', chips).forEach(c => c.classList.toggle('active', c === btn));
      renderWrong();
    });
    $$('.chip', chips).forEach(c => c.classList.toggle('active', c.dataset.k === 'all'));

    /* 移出错题本：事件委托，改完重新渲染 */
    $('#wrongList').addEventListener('click', function (e) {
      const btn = e.target.closest('.js-know');
      if (!btn) return;
      removeWrong(btn.dataset.qid);
      toast('已移出错题本');
      renderWrong();
    });

    renderWrong();
  }

  /* ---------------- 10. 排行榜 ---------------- */

  function renderRank() {
    const listEl = $('#rankList');
    if (!listEl) return;

    const bankKey = $('#rankBank').value;
    const sortBy = $('#rankSort').value;

    let list = getRecords().filter(r => r.mode !== 'practice');
    if (bankKey !== 'all') list = list.filter(r => r.bankKey === bankKey);

    if (sortBy === 'score') {
      list.sort((a, b) => b.score - a.score || a.timeUsed - b.timeUsed);
    } else if (sortBy === 'time') {
      list.sort((a, b) => a.timeUsed - b.timeUsed || b.score - a.score);
    } else {
      list.sort((a, b) => b.date.localeCompare(a.date));
    }

    $('#rankTotal').textContent = list.length;
    const best = list.length ? Math.max.apply(null, list.map(r => r.score)) : 0;
    $('#rankBest').textContent = list.length ? best : '—';

    if (!list.length) {
      listEl.innerHTML = '<div class="empty">' +
        '<h3>还没有成绩记录</h3><p>每完成一局答题都会记到这里，按分数排出名次</p>' +
        '<a class="btn btn-primary" href="index.html">去答第一局</a></div>';
      return;
    }

    listEl.innerHTML = list.map(function (r, i) {
      const medal = i === 0 ? 'top1' : (i === 1 ? 'top2' : (i === 2 ? 'top3' : ''));
      return '<div class="rank-item">' +
        '<div class="no ' + medal + '">' + (i + 1) + '</div>' +
        '<div class="info">' +
          '<div class="title">' + esc(r.bankName) + '</div>' +
          '<div class="bar"><i style="width:' + r.score + '%"></i></div>' +
          '<div class="meta">答对 ' + r.correct + '/' + r.total + '　用时 ' +
            humanTime(r.timeUsed) + '　' + humanDate(r.date) + '</div>' +
        '</div>' +
        '<div class="score">' + r.score + '<small> 分</small></div>' +
      '</div>';
    }).join('');
  }

  function initRank() {
    if (!$('#rankList')) return;

    $('#rankBank').innerHTML = '<option value="all">全部题库</option>' +
      BANKS.map(b => '<option value="' + b.key + '">' + b.name + '</option>').join('');

    $('#rankBank').addEventListener('change', renderRank);
    $('#rankSort').addEventListener('change', renderRank);

    $('#btnClear').addEventListener('click', function () {
      openModal('<h3>清空全部成绩记录</h3>' +
        '<p class="modal-sub">删除之后排行榜会变空，错题本不受影响。此操作不能撤销。</p>' +
        '<div class="modal-actions">' +
          '<button class="btn btn-ghost" id="btnCancelClear">取消</button>' +
          '<button class="btn btn-danger" id="btnDoClear">确认清空</button>' +
        '</div>');
      $('#btnCancelClear').addEventListener('click', closeModal);
      $('#btnDoClear').addEventListener('click', function () {
        store.set(KEY_RECORDS, []);
        closeModal();
        toast('成绩记录已清空');
        renderRank();
      });
    });

    renderRank();
  }

  /* ---------------- 11. 启动 ---------------- */

  function init() {
    initTheme();
    initHeader();
    initToTop();
    $$('.js-year').forEach(el => { el.textContent = new Date().getFullYear(); });

    switch (document.body.dataset.page) {
      case 'index':  initHome();   break;
      case 'quiz':   initQuiz();   break;
      case 'result': initResult(); break;
      case 'wrong':  initWrong();  break;
      case 'rank':   initRank();   break;
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
