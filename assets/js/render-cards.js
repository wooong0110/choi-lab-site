/* ============================================================
   CARD NEWS 렌더러 — note.html 의 카드뉴스 섹션을 그립니다.
   데이터: assets/js/cards-data.js 의 window.CARDNEWS (최신 주차가 맨 앞)
   - 주차 선택(select) + 분야 필터(chip) + 키워드 검색
   - 기본은 관련도 높은 상위 INITIAL_LIMIT 편만, '더 보기'로 전체 표시
   - 카드는 기본 접힘, 클릭하면 펼쳐짐
   ============================================================ */
(function () {
  /* 처음에 보여줄 논문 수 — 여기 숫자만 바꾸면 됩니다 */
  var INITIAL_LIMIT = 10;

  var DATA = window.CARDNEWS || [];
  var weekSel = document.getElementById('cardnews-week');
  var grid = document.getElementById('cardnews-grid');
  if (!grid || !weekSel) return;

  function lang() { return document.documentElement.lang === 'ko' ? 'ko' : 'en'; }
  function tr(en, ko) { return lang() === 'ko' ? ko : en; }

  if (!DATA.length) {
    grid.innerHTML = '<p class="cn-empty">' + tr('No field updates yet.', '아직 카드뉴스가 없습니다.') + '</p>';
    return;
  }

  var metaEl = document.getElementById('cardnews-meta');
  var chipsEl = document.getElementById('cardnews-chips');
  var searchEl = document.getElementById('cardnews-search');
  var periodEl = document.getElementById('cardnews-period');
  var archiveControls = document.getElementById('cardnews-archive-controls');
  var yearSel = document.getElementById('cardnews-year');
  var quarterSel = document.getElementById('cardnews-quarter');
  var archiveYear = '';
  var archiveQuarter = '';
  var activePeriod = 'recent';
  // Calendar-month cutoff, clamped for month ends (e.g. May 31 → Feb 28).
  var today = new Date();
  var cutoff = new Date(today.getFullYear(), today.getMonth() - 3, 1);
  cutoff.setDate(Math.min(today.getDate(),
    new Date(cutoff.getFullYear(), cutoff.getMonth() + 1, 0).getDate()));
  var cutoffDate = cutoff.getFullYear() + '-' + String(cutoff.getMonth() + 1).padStart(2, '0') +
    '-' + String(cutoff.getDate()).padStart(2, '0');
  var visibleWeeks = [];

  // 펼쳤을 때 보여줄 상세 필드 (빈 값은 자동으로 숨김)
  var FIELDS = [
    ['question', '❓ question', '❓ 연구 질문'],
    ['key_result', '📊 key result', '📊 핵심 결과'],
    ['why_for_us', '🎯 why for us', '🎯 연구실 관련성'],
    ['limitations', '⚠️ limitations', '⚠️ 한계'],
    ['reuse', '📦 reuse', '📦 활용'],
    ['next_step', '💡 Suggested application (inference)', '💡 적용 제안 (추론)']
  ];

  var activeDomain = 'ALL';
  var showAll = false;

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function safeUrl(value) {
    try { var u = new URL(value); return /^https?:$/.test(u.protocol) ? u.href : ''; } catch (e) { return ''; }
  }
  function doiUrl(value) {
    return value ? safeUrl(/^10\./.test(value) ? 'https://doi.org/' + value : value) : '';
  }
  function stars(n) {
    n = Math.max(0, Math.min(5, n | 0));
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }
  function currentWeek() { return visibleWeeks[weekSel.selectedIndex] || null; }

  function cardHTML(p) {
    var badge = (p.emoji ? esc(p.emoji) + ' ' : '') + esc(p.domain || '');
    var metaBits = [p.journal, p.year, p.author, p.publication_date, p.type].filter(Boolean).map(esc).join(' · ');

    // Match the other detail rows: plain text without bullets or indentation.
    var didHTML = (p.what_they_did && p.what_they_did.length)
      ? '<dt>' + tr('🧪 what they did', '🧪 연구 방법') + '</dt><dd>' +
          p.what_they_did.map(esc).join(' ') + '</dd>'
      : '';

    var abstractText = p.abstract || p.abstract_excerpt || '';
    var abstractUrl = safeUrl(p.abstract_url) || safeUrl(p.pubmed);
    var abstractHTML = '<div class="cn-abstract">' +
      '<h4>' + (p.abstract ? 'Abstract' : tr('Abstract · excerpt', 'Abstract · 원문 발췌')) + '</h4>' +
      (abstractText ? '<p lang="en">' + esc(abstractText) + '</p>' : '') +
      (abstractUrl ? '<a href="' + esc(abstractUrl) + '" target="_blank" rel="noopener">' +
        tr('Read full abstract ↗', '전체 Abstract 보기 ↗') + '</a>' : '') + '</div>';

    var rows = '';
    FIELDS.forEach(function (f) {
      var v = p[f[0]];
      if (v) rows += '<dt>' + (lang() === 'ko' ? f[2] : f[1]) + '</dt><dd>' + esc(v) + '</dd>';
      // question 바로 뒤에 'what they did' 끼워넣기.
      // 다른 필드 뒤에 두고 싶으면 'question' 을 그 필드 이름으로 바꾸세요 (예: 'key_result').
      if (f[0] === 'question') rows += didHTML;
    });

    var concepts = (p.concepts && p.concepts.length)
      ? '<div class="cn-concepts">' + p.concepts.map(function (c) {
          return '<span class="cn-tag">' + esc(c) + '</span>';
        }).join('') + '</div>'
      : '';

    var links = [];
    if (safeUrl(p.pubmed)) links.push('<a href="' + esc(safeUrl(p.pubmed)) + '" target="_blank" rel="noopener">PubMed ↗</a>');
    if (doiUrl(p.doi)) links.push('<a href="' + esc(doiUrl(p.doi)) + '" target="_blank" rel="noopener">' + tr('Article & figures ↗', '원문·그림 ↗') + '</a>');
    var linksHTML = links.length ? '<div class="cn-links">' + links.join('') + '</div>' : '';

    return '<article class="cn-card reveal" data-domain="' + esc(p.domain || '') + '">' +
      '<button class="cn-head" type="button" aria-expanded="false">' +
        '<div class="cn-top">' +
          (badge ? '<span class="cn-badge">' + badge + '</span>' : '') +
          '<span class="cn-stars" title="' + tr('Relevance ', '관련도 ') + (p.rating | 0) + '/5">' + stars(p.rating) + '</span>' +
        '</div>' +
        '<h3 class="cn-title">' + esc(p.title) + '</h3>' +
        (metaBits ? '<div class="cn-metaline">' + metaBits + '</div>' : '') +
        (p.tldr ? '<p class="cn-oneliner cn-preview-summary">' + esc(p.tldr) + '</p>' : '') +
        '<span class="cn-toggle">' + tr('Details ▾', '자세히 ▾') + '</span>' +
      '</button>' +
      '<div class="cn-detail" hidden>' +
        abstractHTML +
        (p.tldr ? '<p class="cn-oneliner" lang="ko">' + esc(p.tldr) + '</p>' : '') +
        (rows ? '<dl>' + rows + '</dl>' : '') +
        concepts + linksHTML +
      '</div>' +
    '</article>';
  }

  function filtered() {
    var week = currentWeek();
    var q = (searchEl && searchEl.value || '').trim().toLowerCase();
    return week.papers.filter(function (p) {
      if (activeDomain !== 'ALL' && (p.domain || '') !== activeDomain) return false;
      if (q) {
        var hay = (p.title + ' ' + p.tldr + ' ' + p.why_for_us + ' ' +
                   p.key_result + ' ' + p.question + ' ' + p.journal).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    }).sort(function (a, b) { return (b.rating | 0) - (a.rating | 0); }); // 관련도 높은 순
  }

  function render() {
    var week = currentWeek();
    var notice = document.getElementById('cardnews-notice');
    if (notice) { notice.textContent = week && week.notice || ''; notice.hidden = !notice.textContent; }
    if (!week) {
      if (metaEl) metaEl.textContent = '';
      grid.innerHTML = '<p class="cn-empty">' + (activePeriod === 'archive'
        ? tr('No archived updates yet. Weeks older than 3 months will appear here.', '아직 보관된 자료가 없습니다. 3개월이 지난 주차는 여기에 표시됩니다.')
        : tr('No updates in the last 3 months. Browse Archive for earlier weeks.', '최근 3개월 자료가 없습니다. 이전 주차는 보관함에서 확인하세요.')) + '</p>';
      return;
    }
    var list = filtered();
    var shown = showAll ? list : list.slice(0, INITIAL_LIMIT);
    var hidden = list.length - shown.length;

    if (metaEl) {
      var unit = tr(' papers', '편');
      metaEl.textContent = week.date + ' · ' +
        (list.length === week.papers.length ? list.length + unit
                                            : list.length + '/' + week.papers.length + unit);
    }

    var html = shown.length
      ? shown.map(cardHTML).join('')
      : '<p class="cn-empty">' + tr('No papers match these filters.', '조건에 맞는 논문이 없습니다.') + '</p>';

    if (hidden > 0) {
      html += '<button id="cardnews-more" class="cn-more" type="button">' +
        tr('Show ' + hidden + ' more ▾', '나머지 ' + hidden + '편 더 보기 ▾') + '</button>';
    } else if (showAll && list.length > INITIAL_LIMIT) {
      html += '<button id="cardnews-more" class="cn-more" type="button" data-collapse="1">' +
        tr('Show top ' + INITIAL_LIMIT + ' only ▴', '상위 ' + INITIAL_LIMIT + '편만 보기 ▴') + '</button>';
    }
    grid.innerHTML = html;
    if (window.observeReveal) window.observeReveal();
  }

  function renderChips() {
    if (!chipsEl) return;
    if (!currentWeek()) { chipsEl.innerHTML = ''; return; }
    var seen = {}, order = [];
    currentWeek().papers.forEach(function (p) {
      var d = p.domain || '';
      if (!d || seen[d]) return;
      seen[d] = 1; order.push({ d: d, e: p.emoji || '' });
    });
    var chips = ['<button class="cn-chip' + (activeDomain === 'ALL' ? ' on' : '') +
                 '" data-d="ALL">' + tr('All', '전체') + '</button>'];
    order.forEach(function (o) {
      chips.push('<button class="cn-chip' + (activeDomain === o.d ? ' on' : '') +
        '" data-d="' + esc(o.d) + '">' + (o.e ? esc(o.e) + ' ' : '') + esc(o.d) + '</button>');
    });
    chipsEl.innerHTML = chips.join('');
  }

  function reset() { activeDomain = 'ALL'; showAll = false; }

  function quarter(w) { return String(Math.ceil(Number(w.date.slice(5, 7)) / 3)); }

  function renderArchiveOptions(weeks) {
    if (!archiveControls || !yearSel || !quarterSel) return weeks;
    archiveControls.hidden = activePeriod !== 'archive';
    if (activePeriod !== 'archive') return weeks;
    document.getElementById('cardnews-year-label').textContent = tr('Year', '연도');
    document.getElementById('cardnews-quarter-label').textContent = tr('Quarter', '분기');
    yearSel.disabled = quarterSel.disabled = !weeks.length;
    if (!weeks.length) {
      yearSel.innerHTML = '<option value="">' + tr('No years', '연도 없음') + '</option>';
      quarterSel.innerHTML = '<option value="">' + tr('No quarters', '분기 없음') + '</option>';
      return weeks;
    }
    var years = Array.from(new Set(weeks.map(function (w) { return w.date.slice(0, 4); }))).sort().reverse();
    if (years.indexOf(archiveYear) === -1) archiveYear = years[0];
    yearSel.innerHTML = years.map(function (y) {
      return '<option value="' + y + '">' + y + '</option>';
    }).join('');
    yearSel.value = archiveYear;
    weeks = weeks.filter(function (w) { return w.date.slice(0, 4) === archiveYear; });
    var quarters = Array.from(new Set(weeks.map(quarter))).sort().reverse();
    if (quarters.indexOf(archiveQuarter) === -1) archiveQuarter = quarters[0];
    quarterSel.innerHTML = quarters.map(function (q) {
      var start = (Number(q) - 1) * 3 + 1;
      return '<option value="' + q + '">' + tr('Q' + q, q + '분기') +
        ' (' + tr(['Jan–Mar', 'Apr–Jun', 'Jul–Sep', 'Oct–Dec'][Number(q) - 1],
          start + '–' + (start + 2) + '월') + ')</option>';
    }).join('');
    quarterSel.value = archiveQuarter;
    return weeks.filter(function (w) { return quarter(w) === archiveQuarter; });
  }

  function renderWeekOptions() {
    if (searchEl) {
      searchEl.placeholder = tr('Search title, summary, journal…', '키워드 검색 (제목·요약·저널)…');
      searchEl.setAttribute('aria-label', tr('Search papers', '카드뉴스 검색'));
    }
    var selected = currentWeek();
    visibleWeeks = DATA.filter(function (w) {
      return activePeriod === 'recent' ? w.date >= cutoffDate : w.date < cutoffDate;
    });
    visibleWeeks = renderArchiveOptions(visibleWeeks).slice().sort(function (a, b) {
      return b.date.localeCompare(a.date);
    });
    weekSel.innerHTML = visibleWeeks.map(function (w, i) {
      return '<option value="' + i + '">' + w.date + ' (n=' + w.papers.length + ')</option>';
    }).join('');
    weekSel.disabled = !visibleWeeks.length;
    if (!visibleWeeks.length) {
      weekSel.innerHTML = '<option value="">' + tr('No weeks', '주차 없음') + '</option>';
    }
    weekSel.selectedIndex = Math.max(0, visibleWeeks.indexOf(selected));
    if (searchEl) searchEl.disabled = !visibleWeeks.length;
    if (periodEl) {
      periodEl.setAttribute('aria-label', tr('Period', '기간'));
      periodEl.querySelectorAll('[data-period]').forEach(function (btn) {
        var period = btn.getAttribute('data-period');
        btn.textContent = period === 'recent' ? tr('Recent 3 months', '최근 3개월') : tr('Archive', '보관함');
        btn.classList.toggle('on', period === activePeriod);
        btn.setAttribute('aria-pressed', period === activePeriod ? 'true' : 'false');
      });
    }
  }
  renderWeekOptions();

  function archiveSelectionChanged() {
    reset();
    if (searchEl) searchEl.value = '';
    renderWeekOptions(); renderChips(); render();
  }
  if (yearSel) yearSel.addEventListener('change', function () {
    archiveYear = yearSel.value;
    archiveQuarter = '';
    archiveSelectionChanged();
  });
  if (quarterSel) quarterSel.addEventListener('change', function () {
    archiveQuarter = quarterSel.value;
    archiveSelectionChanged();
  });

  if (periodEl) periodEl.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-period]');
    if (!btn || btn.getAttribute('data-period') === activePeriod) return;
    activePeriod = btn.getAttribute('data-period');
    reset();
    if (searchEl) searchEl.value = '';
    renderWeekOptions(); renderChips(); render();
  });

  weekSel.addEventListener('change', function () { reset(); renderChips(); render(); });

  if (chipsEl) chipsEl.addEventListener('click', function (e) {
    var btn = e.target.closest('.cn-chip');
    if (!btn) return;
    activeDomain = btn.getAttribute('data-d');
    showAll = false;
    renderChips(); render();
  });

  if (searchEl) searchEl.addEventListener('input', function () { showAll = false; render(); });

  // 카드 펼침/접힘 + 더보기 (이벤트 위임)
  grid.addEventListener('click', function (e) {
    var more = e.target.closest('.cn-more');
    if (more) { showAll = !more.getAttribute('data-collapse'); render(); return; }

    var head = e.target.closest('.cn-head');
    if (!head) return;
    var card = head.parentNode;
    var detail = card.querySelector('.cn-detail');
    var open = card.classList.toggle('open');
    head.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (detail) detail.hidden = !open;
    var tog = head.querySelector('.cn-toggle');
    if (tog) tog.textContent = open ? tr('Close ▴', '접기 ▴') : tr('Details ▾', '자세히 ▾');
  });

  document.addEventListener('site:languagechange', function () {
    renderWeekOptions(); renderChips(); render();
  });

  renderChips();
  render();
})();
