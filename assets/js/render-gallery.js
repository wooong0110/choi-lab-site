(function () {
  var grid = document.getElementById('gallery-grid');
  if (!grid) return;
  var data = window.GALLERY || [];
  var total = Math.max(1, Math.ceil(data.length / 10));
  var page = Math.min(window.currentPage(), total);

  function element(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }
  function photo(src, alt, cover) {
    // Only local paths and HTTP(S) images; never executable URL schemes.
    var url;
    try { url = new URL(src, location.href); } catch (e) { return null; }
    if (!/^(https?:|file:)$/.test(url.protocol)) return null;
    var link = element('a', cover ? 'gallery-cover' : '');
    link.href = url.href;
    link.target = '_blank';
    link.rel = 'noopener';
    var img = element('img');
    img.src = url.href;
    img.alt = alt;
    img.loading = 'lazy';
    img.addEventListener('error', function () { link.remove(); });
    link.appendChild(img);
    return link;
  }
  function render() {
    var ko = document.documentElement.lang === 'ko';
    grid.replaceChildren();
    document.getElementById('gallery-empty').hidden = data.length > 0;
    data.slice((page - 1) * 10, page * 10).forEach(function (post) {
      var title = (ko ? post.titleKo || post.title : post.title || post.titleKo) || '';
      var paragraphs = (ko ? post.bodyKo || post.body : post.body || post.bodyKo) || [];
      var images = post.images || (post.image ? [post.image] : []);
      var card = element('article', 'news-card');
      var thumb = element('div', 'thumb');
      if (images.length) {
        var cover = photo(images[0], title + (ko ? ' — 대표 사진 원본 보기' : ' — View cover photo'), true);
        if (cover) thumb.appendChild(cover);
      }
      var overlay = element('div', 'ov');
      var date = element('time', 'd', post.date || '');
      if (/^\d{4}-\d{2}-\d{2}$/.test(post.date)) date.dateTime = post.date;
      overlay.append(date, element('h2', '', title));
      thumb.appendChild(overlay);
      var body = element('div', 'body');
      paragraphs.forEach(function (p) { body.appendChild(element('p', '', p)); });
      if (images.length > 1) {
        var gallery = element('div', 'post-gallery');
        images.slice(1).forEach(function (src, i) {
          var link = photo(src, title + (ko ? ' — 사진 ' : ' — Photo ') + (i + 2), false);
          if (link) gallery.appendChild(link);
        });
        body.appendChild(gallery);
      }
      card.append(thumb, body);
      grid.appendChild(card);
    });
    var pager = document.getElementById('gallery-pager');
    pager.replaceChildren();
    pager.setAttribute('aria-label', ko ? '갤러리 페이지' : 'Gallery pages');
    window.renderPager('gallery-pager', page, total);
    var current = pager.querySelector('.current');
    if (current) current.setAttribute('aria-current', 'page');
  }
  document.addEventListener('DOMContentLoaded', render);
  document.addEventListener('site:languagechange', render);
})();
