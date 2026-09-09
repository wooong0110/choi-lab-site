// ---- Theme + language preferences (shared by every page) ----
(function () {
  var root = document.documentElement;
  var THEME_KEY = 'choilab-theme';
  var LANG_KEY = 'choilab-language';

  var UI = {
    'menu': { en: 'Menu', ko: '메뉴' },
    'theme.dark': { en: 'Use dark mode', ko: '다크 모드 사용' },
    'theme.light': { en: 'Use light mode', ko: '라이트 모드 사용' },
    'language': { en: 'Language', ko: '언어' },
    'pager.prev': { en: '\u2039 Prev', ko: '\u2039 이전' },
    'pager.next': { en: 'Next \u203a', ko: '다음 \u203a' }
  };

  // [source text, English, Korean]. Names and publication metadata stay unchanged.
  var TRANSLATIONS = [
    ['Drug Delivery Lab', 'Drug Delivery Lab', '약물전달 연구실'],
    ['KNU Drug Delivery Lab', 'KNU Drug Delivery Lab', '경북대학교 약물전달 연구실'],
    ['Kyungpook National University', 'Kyungpook National University', '경북대학교'],
    ['Department of Immunology', 'Department of Immunology', '면역학교실'],
    ['School of Medicine', 'School of Medicine', '의과대학'],
    ['Home', 'Home', '홈'], ['Members', 'Members', '구성원'],
    ['Publications', 'Publications', '논문'], ['Contact', 'Contact', '연락처'],
    ['Explore', 'Explore', '둘러보기'], ['Connect', 'Connect', '연결'],
    ['Choi Lab · Kyungpook National University', 'Choi Lab · Kyungpook National University', 'Choi Lab · 경북대학교'],
    ['\u2039 Prev', '\u2039 Prev', '\u2039 이전'], ['Next \u203a', 'Next \u203a', '다음 \u203a'],

    ['Biomaterials & Drug Delivery', 'Biomaterials & Drug Delivery', '바이오소재 & 약물전달'],
    ['Delivering drugs', 'Delivering drugs', '약물을'],
    ['more effectively,', 'more effectively,', '더 효과적으로,'],
    ['more safely,', 'more safely,', '더 안전하게,'],
    ['exactly where they are needed', 'exactly where they are needed', '꼭 필요한 곳에 전달합니다'],
    ['We develop drug delivery systems using biomaterials such as liposomes, exosomes, and hydrogels — to carry therapeutics more effectively, more safely, and precisely to their target sites.', 'We develop drug delivery systems using biomaterials such as liposomes, exosomes, and hydrogels — to carry therapeutics more effectively, more safely, and precisely to their target sites.', '리포솜, 엑소좀, 하이드로젤과 같은 바이오소재를 활용해 치료제를 더 효과적이고 안전하게 표적 부위에 정밀 전달하는 약물전달 시스템을 개발합니다.'],
    ['Meet the team', 'Meet the team', '연구팀 만나기'], ['View publications', 'View publications', '논문 보기'],
    ['What we do', 'What we do', '주요 연구'], ['From biomaterials', 'From biomaterials', '바이오소재에서'],
    ['to targeted therapy', 'to targeted therapy', '표적 치료까지'],
    ['Originally rooted in cancer immunotherapy, our research is now expanding through collaborations across the university into cancer, inflammatory diseases, and skin & hair disorders — soon including a new direction in hydrogel-based therapy for hair loss. 🌱', 'Originally rooted in cancer immunotherapy, our research is now expanding through collaborations across the university into cancer, inflammatory diseases, and skin & hair disorders — soon including a new direction in hydrogel-based therapy for hair loss. 🌱', '암 면역치료에서 출발한 연구를 교내 협력을 통해 암, 염증성 질환, 피부·모발 질환으로 확장하고 있으며, 곧 하이드로젤 기반 탈모 치료라는 새로운 연구 방향도 시작합니다. 🌱'],
    ['Biomaterial-based Carriers', 'Biomaterial-based Carriers', '바이오소재 기반 전달체'],
    ['Designing delivery platforms from liposomes, exosomes, hydrogels, and nano/bio-materials to control where and how drugs are released.', 'Designing delivery platforms from liposomes, exosomes, hydrogels, and nano/bio-materials to control where and how drugs are released.', '리포솜, 엑소좀, 하이드로젤, 나노·바이오소재를 이용해 약물이 방출되는 위치와 방식을 제어하는 전달 플랫폼을 설계합니다.'],
    ['Disease Applications', 'Disease Applications', '질환 응용'],
    ['From cancer immunotherapy to hydrogel-based delivery for hair-loss treatment, extending into a broad range of disease models.', 'From cancer immunotherapy to hydrogel-based delivery for hair-loss treatment, extending into a broad range of disease models.', '암 면역치료부터 하이드로젤 기반 탈모 치료제 전달까지, 다양한 질환 모델로 연구를 확장합니다.'],
    ['Bench to In Vivo', 'Bench to In Vivo', '기초 실험부터 생체 연구까지'],
    ['Hands-on experience spanning biomaterial synthesis, protein and cell experiments, animal studies, and drug-delivery efficacy evaluation.', 'Hands-on experience spanning biomaterial synthesis, protein and cell experiments, animal studies, and drug-delivery efficacy evaluation.', '바이오소재 합성, 단백질·세포 실험, 동물 연구, 약물전달 효능 평가까지 폭넓은 실험 경험을 쌓습니다.'],
    ['Research Focus', 'Research Focus', '연구 분야'], ['What we work on', 'What we work on', '우리가 연구하는 것'],
    ['From fundamental biomaterial design to applied disease therapy — research that connects the bench to real treatment.', 'From fundamental biomaterial design to applied disease therapy — research that connects the bench to real treatment.', '기초 바이오소재 설계부터 질환 치료 응용까지, 실험실의 발견을 실제 치료로 연결하는 연구를 수행합니다.'],
    ['💊 Delivery Platforms', '💊 Delivery Platforms', '💊 전달 플랫폼'],
    ['Liposomes', 'Liposomes', '리포솜'], ['Exosomes', 'Exosomes', '엑소좀'], ['Hydrogels', 'Hydrogels', '하이드로젤'],
    ['Nano / bio-material', 'Nano / bio-material', '나노 / 바이오소재'], ['delivery platforms', 'delivery platforms', '전달 플랫폼'],
    ['🧫 Disease Therapy', '🧫 Disease Therapy', '🧫 질환 치료'],
    ['Cancer immunotherapy', 'Cancer immunotherapy', '암 면역치료'],
    ['Hydrogel-based delivery', 'Hydrogel-based delivery', '하이드로젤 기반 전달'],
    ['for hair-loss treatment', 'for hair-loss treatment', '을 활용한 탈모 치료'],
    ['Expansion', 'Expansion', '연구 확장'], ['into diverse disease models', 'into diverse disease models', '을 통한 다양한 질환 모델 적용'],
    ['🧪 From Basics to Application', '🧪 From Basics to Application', '🧪 기초부터 응용까지'],
    ['Biomaterial', 'Biomaterial', '바이오소재'], ['fabrication & synthesis', 'fabrication & synthesis', '제작 및 합성'],
    ['Protein', 'Protein', '단백질'], ['Cell', 'Cell', '세포'], ['Animal', 'Animal', '동물'],
    ['experiments', 'experiments', '실험'], ['Drug-delivery', 'Drug-delivery', '약물전달'], ['efficacy evaluation', 'efficacy evaluation', '효능 평가'],
    ['Grow with us', 'Grow with us', '함께 성장하기'],
    ['Build a lab from the ground up', 'Build a lab from the ground up', '연구실의 시작을 함께 만들어 갑니다'],
    ["We are looking for students who will not simply join predefined projects, but help shape new research questions, build experimental systems, and experience the early growth of the lab together. If that sounds like you, we'd love to hear from you.", "We are looking for students who will not simply join predefined projects, but help shape new research questions, build experimental systems, and experience the early growth of the lab together. If that sounds like you, we'd love to hear from you.", '정해진 과제에 단순히 참여하는 데 그치지 않고, 새로운 연구 질문을 만들고 실험 시스템을 구축하며 연구실의 초기 성장을 함께 경험할 학생을 찾습니다. 이런 여정에 마음이 간다면 편하게 연락해 주세요.'],
    ['Get in touch', 'Get in touch', '연락하기'], ['Get in touch →', 'Get in touch →', '연락하기 →'],

    ['Our People', 'Our People', '연구실 구성원'], ['The team', 'The team', '과학을 함께 만드는'],
    ['behind the science', 'behind the science', '우리 연구팀'],
    ['👨‍🔬 Principal Investigator', '👨‍🔬 Principal Investigator', '👨‍🔬 책임연구자'],
    ['Assistant Professor', 'Assistant Professor', '조교수'],
    ['Department of Immunology, School of Medicine, Kyungpook National University', 'Department of Immunology, School of Medicine, Kyungpook National University', '경북대학교 의과대학 면역학교실'],
    ['2025–present | Assistant Professor, Dept. of Immunology, School of Medicine, Kyungpook National University', '2025–present | Assistant Professor, Dept. of Immunology, School of Medicine, Kyungpook National University', '2025–현재 | 경북대학교 의과대학 면역학교실 조교수'],
    ['2023–2025 | Postdoctoral Researcher, Medicinal Materials Research Center, KIST (Advisor: Yoosoo Yang)', '2023–2025 | Postdoctoral Researcher, Medicinal Materials Research Center, KIST (Advisor: Yoosoo Yang)', '2023–2025 | 한국과학기술연구원(KIST) 의약소재연구센터 박사후연구원 (지도: 양유수)'],
    ['2017–2022 | Ph.D. in Converging Science & Technology, Korea University (KU-KIST) · Center for Theragnosis, KIST (Advisor: Kwangmeyung Kim)', '2017–2022 | Ph.D. in Converging Science & Technology, Korea University (KU-KIST) · Center for Theragnosis, KIST (Advisor: Kwangmeyung Kim)', '2017–2022 | 고려대학교 KU-KIST 융합대학원 융합과학기술학 박사 · KIST 테라그노시스연구센터 (지도: 김광명)'],
    ['2012–2016 | B.S. in Biomedical Engineering, Korea University', '2012–2016 | B.S. in Biomedical Engineering, Korea University', '2012–2016 | 고려대학교 바이오의공학 학사'],
    ['Research interests: Drug delivery systems, biomaterials, liposomes, exosomes, hydrogels, cancer immunotherapy', 'Research interests: Drug delivery systems, biomaterials, liposomes, exosomes, hydrogels, cancer immunotherapy', '연구 관심 분야: 약물전달 시스템, 바이오소재, 리포솜, 엑소좀, 하이드로젤, 암 면역치료'],
    ['👩‍🎓 Graduate Students', '👩‍🎓 Graduate Students', '👩‍🎓 대학원생'],
    ['PhD Student', 'PhD Student', '박사과정'],
    ['2026– | Ph.D. in Biomedical Science, KNU', '2026– | Ph.D. in Biomedical Science, KNU', '2026– | 경북대학교 의과학과 박사과정'],
    ['2021–2023 | M.S. in Brain & Cognitive Sciences, DGIST', '2021–2023 | M.S. in Brain & Cognitive Sciences, DGIST', '2021–2023 | 대구경북과학기술원(DGIST) 뇌·인지과학 석사'],
    ['2016–2021 | B.S. in Chemical Engineering, Daegu Catholic University', '2016–2021 | B.S. in Chemical Engineering, Daegu Catholic University', '2016–2021 | 대구가톨릭대학교 화학공학 학사'],
    ['We are hiring!', 'We are hiring!', '새 구성원을 모집합니다!'], ['Graduate Student', 'Graduate Student', '대학원생'],
    ['We are looking for motivated students who want to help shape new research questions, build experimental systems, and grow together with an early-stage lab.', 'We are looking for motivated students who want to help shape new research questions, build experimental systems, and grow together with an early-stage lab.', '새로운 연구 질문을 만들고 실험 시스템을 구축하며, 시작 단계의 연구실과 함께 성장하고 싶은 열정적인 학생을 찾습니다.'],

    ['Research Output', 'Research Output', '연구 성과'], ['Selected', 'Selected', '주요'],
    ['publications', 'publications', '연구 논문'], ['For the full list, see', 'For the full list, see', '전체 목록은'],
    ['First or co-first author', 'First or co-first author', '제1저자 또는 공동 제1저자'],

    ['Get in Touch', 'Get in Touch', '연락하기'], ['Come', 'Come', '우리와'], ['join us', 'join us', '함께해요'],
    ['We are always looking for motivated people to join our team. If you are interested in undergraduate internships or graduate research, feel free to reach out. ✨', 'We are always looking for motivated people to join our team. If you are interested in undergraduate internships or graduate research, feel free to reach out. ✨', '우리 팀과 함께할 열정적인 분을 언제나 찾고 있습니다. 학부 인턴십이나 대학원 연구에 관심이 있다면 편하게 연락해 주세요. ✨'],
    ['Email', 'Email', '이메일'], ['Address', 'Address', '주소'], ['Affiliation', 'Affiliation', '소속'],
    ['680 Gukchaebosang-ro, N241, Jung-gu,', '680 Gukchaebosang-ro, N241, Jung-gu,', '대구광역시 중구 국채보상로 680, N241'],
    ['Daegu, 41944, South Korea', 'Daegu, 41944, South Korea', '대한민국 41944']
  ];

  var pageMeta = {
    'index.html': {
      en: ['KNU Drug Delivery Lab', 'Drug Delivery Lab at Kyungpook National University — developing biomaterial-based drug delivery systems with liposomes, exosomes and hydrogels.'],
      ko: ['경북대학교 약물전달 연구실', '리포솜, 엑소좀, 하이드로젤을 활용한 바이오소재 기반 약물전달 시스템을 개발하는 경북대학교 약물전달 연구실입니다.']
    },
    'members.html': {
      en: ['Members · KNU Drug Delivery Lab', 'People of the KNU Drug Delivery Lab — PI and graduate students.'],
      ko: ['구성원 · 경북대학교 약물전달 연구실', '경북대학교 약물전달 연구실의 책임연구자와 대학원생을 소개합니다.']
    },
    'publications.html': {
      en: ['Publications · KNU Drug Delivery Lab', 'Selected publications from the KNU Drug Delivery Lab.'],
      ko: ['논문 · 경북대학교 약물전달 연구실', '경북대학교 약물전달 연구실의 주요 연구 논문입니다.']
    },
    'contact.html': {
      en: ['Contact · KNU Drug Delivery Lab', 'Contact the KNU Drug Delivery Lab.'],
      ko: ['연락처 · 경북대학교 약물전달 연구실', '경북대학교 약물전달 연구실 연락처입니다.']
    }
  };

  var translationBySource = {};
  TRANSLATIONS.forEach(function (entry) {
    translationBySource[entry[0]] = { en: entry[1], ko: entry[2] };
  });

  function preference(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function remember(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* private mode */ }
  }
  function language() { return root.lang === 'ko' ? 'ko' : 'en'; }
  function t(key) {
    var item = UI[key];
    return item ? item[language()] : key;
  }
  window.siteT = t;

  function translateTextNode(node, lang) {
    if (!node.parentNode || /^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/i.test(node.parentNode.nodeName)) return;
    if (!Object.prototype.hasOwnProperty.call(node, '_choilabOriginal')) {
      var trimmed = node.nodeValue.trim();
      if (!translationBySource[trimmed]) return;
      node._choilabOriginal = trimmed;
      node._choilabPrefix = node.nodeValue.slice(0, node.nodeValue.indexOf(trimmed));
      node._choilabSuffix = node.nodeValue.slice(node.nodeValue.indexOf(trimmed) + trimmed.length);
    }
    var item = translationBySource[node._choilabOriginal];
    if (item) node.nodeValue = node._choilabPrefix + item[lang] + node._choilabSuffix;
  }

  function translateTree(scope) {
    var lang = language();
    var walker = document.createTreeWalker(scope || document.body, NodeFilter.SHOW_TEXT);
    var nodes = [], node;
    while ((node = walker.nextNode())) nodes.push(node);
    nodes.forEach(function (n) { translateTextNode(n, lang); });

    var file = location.pathname.split('/').pop() || 'index.html';
    var meta = pageMeta[file] && pageMeta[file][lang];
    if (meta) {
      document.title = meta[0];
      var desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute('content', meta[1]);
    }
    var menu = document.querySelector('.nav-toggle');
    if (menu) menu.setAttribute('aria-label', t('menu'));
    var map = document.querySelector('.map-card iframe');
    if (map) map.setAttribute('title', lang === 'ko' ? '연구실 위치 지도' : 'Lab location map');
  }
  window.translatePage = translateTree;

  function updateLanguageButtons() {
    document.querySelectorAll('[data-set-language]').forEach(function (button) {
      var active = button.getAttribute('data-set-language') === language();
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    var group = document.querySelector('.language-switch');
    if (group) group.setAttribute('aria-label', t('language'));
  }

  function setLanguage(lang, save) {
    root.lang = lang === 'ko' ? 'ko' : 'en';
    if (save) remember(LANG_KEY, root.lang);
    translateTree(document.body);
    updateLanguageButtons();
    updateThemeButton();
    if (save) document.dispatchEvent(new CustomEvent('site:languagechange', { detail: { language: root.lang } }));
  }

  function theme() { return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
  function updateThemeButton() {
    var button = document.querySelector('.theme-toggle');
    if (!button) return;
    var dark = theme() === 'dark';
    button.textContent = dark ? '\u2600\ufe0f' : '\ud83c\udf19';
    button.setAttribute('aria-label', dark ? t('theme.light') : t('theme.dark'));
    button.setAttribute('title', dark ? t('theme.light') : t('theme.dark'));
  }
  function setTheme(next, save) {
    root.setAttribute('data-theme', next === 'dark' ? 'dark' : 'light');
    if (save) remember(THEME_KEY, theme());
    updateThemeButton();
  }

  function addControls() {
    var nav = document.querySelector('.nav');
    if (!nav || nav.querySelector('.nav-actions')) return;
    var actions = document.createElement('div');
    actions.className = 'nav-actions';
    actions.innerHTML = '<div class="language-switch" role="group">' +
      '<button type="button" data-set-language="en">EN</button>' +
      '<button type="button" data-set-language="ko">KO</button></div>' +
      '<button class="theme-toggle" type="button"></button>';
    var menu = nav.querySelector('.nav-toggle');
    nav.insertBefore(actions, menu || null);
    actions.addEventListener('click', function (event) {
      var langButton = event.target.closest('[data-set-language]');
      if (langButton) setLanguage(langButton.getAttribute('data-set-language'), true);
      if (event.target.closest('.theme-toggle')) setTheme(theme() === 'dark' ? 'light' : 'dark', true);
    });
  }

  var savedTheme = preference(THEME_KEY);
  var systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(savedTheme || (systemDark ? 'dark' : 'light'), false);
  root.lang = preference(LANG_KEY) === 'ko' ? 'ko' : 'en';

  document.addEventListener('DOMContentLoaded', function () {
    addControls();
    setLanguage(root.lang, false);
    updateThemeButton();

    var queued = false;
    new MutationObserver(function (mutations) {
      if (queued || !mutations.some(function (m) { return m.addedNodes.length; })) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; translateTree(document.body); });
    }).observe(document.body, { childList: true, subtree: true });
  });

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (event) {
      if (!preference(THEME_KEY)) setTheme(event.matches ? 'dark' : 'light', false);
    });
  }
})();

// ---- Scroll reveal (reusable; also runs on dynamically added .reveal) ----
function observeReveal() {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal:not(.in)').forEach(function (el) { io.observe(el); });
}
window.observeReveal = observeReveal;

// ---- Pagination helpers (shared by news + publications) ----
function currentPage() {
  var p = parseInt(new URLSearchParams(location.search).get('page'), 10);
  return (p && p > 0) ? p : 1;
}
function renderPager(elId, page, total) {
  var el = document.getElementById(elId);
  if (!el || total <= 1) { return; }
  var base = location.pathname.split('/').pop() || 'index.html';
  function cell(p, label, state) {
    if (state === 'disabled') return '<span class="disabled">' + label + '</span>';
    if (state === 'current') return '<span class="current">' + label + '</span>';
    return '<a href="' + base + '?page=' + p + '">' + label + '</a>';
  }
  var html = cell(page - 1, window.siteT ? window.siteT('pager.prev') : '\u2039 Prev', page <= 1 ? 'disabled' : '');
  for (var i = 1; i <= total; i++) { html += cell(i, i, i === page ? 'current' : ''); }
  html += cell(page + 1, window.siteT ? window.siteT('pager.next') : 'Next \u203a', page >= total ? 'disabled' : '');
  el.innerHTML = html;
}
window.currentPage = currentPage;
window.renderPager = renderPager;

// ---- Mobile nav + year ----
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () { links.classList.toggle('open'); });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  observeReveal();
});
