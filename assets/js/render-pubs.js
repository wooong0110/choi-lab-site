(function () {
  var DATA = window.PUBLICATIONS || [];
  var list = document.getElementById('pub-list');
  if (!list) return;

  var perPage = 10;
  var total = Math.max(1, Math.ceil(DATA.length / perPage));
  var page = Math.min(window.currentPage(), total);
  var start = (page - 1) * perPage;
  var items = DATA.slice(start, start + perPage);

  list.innerHTML = items.map(function (p, i) {
    var idx = String(start + i + 1).padStart(2, '0');
    return '<li class="pub reveal">' +
      '<div class="idx">' + idx + '</div>' +
      '<div>' +
        '<h3><a href="' + p.url + '" target="_blank" rel="noopener">' + p.title + '</a></h3>' +
        '<div class="authors">' + p.authors + '</div>' +
        '<div class="pub-meta">' +
          '<span class="venue">' + p.venue + ' \u00B7 ' + p.year + '</span>' +
          (p.if ? '<span class="impact-factor" title="JCR ' + p.jcrYear + ' Journal Impact Factor">JCR IF ' + p.if + '</span>' : '') +
        '</div>' +
      '</div></li>';
  }).join('');

  window.renderPager('pub-pager', page, total);
  if (window.observeReveal) window.observeReveal();
})();
