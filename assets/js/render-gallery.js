(function () {
  var grid = document.getElementById('gallery-grid');
  if (!grid) return;
  var data = window.GALLERY || [];
  var total = Math.max(1, Math.ceil(data.length / 10));
  var page = Math.min(window.currentPage(), total);
  var viewer = document.createElement('dialog');
  viewer.className = 'gallery-viewer';
  var close = document.createElement('button');
  close.type = 'button';
  var previous = element('button', 'gallery-previous', '‹');
  var next = element('button', 'gallery-next', '›');
  previous.type = next.type = 'button';
  var counter = element('span', 'gallery-counter');
  counter.setAttribute('aria-live', 'polite');
  var activePhotos = [];
  var activeIndex = 0;
  var fullPhoto = document.createElement('img');
  var stage = element('div', 'gallery-viewer-stage');
  stage.append(fullPhoto, previous, next);
  var social = window.GALLERY_API && window.createGallerySocial ? window.createGallerySocial() : null;
  viewer.append(close, stage, counter);
  if (social) viewer.appendChild(social.element);
  document.body.appendChild(viewer);
  close.addEventListener('click', function () { viewer.close(); });
  viewer.addEventListener('click', function (event) {
    if (event.target === viewer) viewer.close();
  });
  viewer.addEventListener('close', function () {
    fullPhoto.removeAttribute('src'); activePhotos = [];
    if (social) social.close();
  });
  function showPhoto(index) {
    if (!activePhotos.length) return;
    activeIndex = (index + activePhotos.length) % activePhotos.length;
    fullPhoto.alt = activePhotos[activeIndex].alt;
    fullPhoto.src = activePhotos[activeIndex].src;
    counter.textContent = (activeIndex + 1) + ' / ' + activePhotos.length;
    previous.hidden = next.hidden = activePhotos.length < 2;
    if (social) social.show(fullPhoto.src);
  }
  previous.addEventListener('click', function () { showPhoto(activeIndex - 1); });
  next.addEventListener('click', function () { showPhoto(activeIndex + 1); });
  viewer.addEventListener('keydown', function (event) {
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName) || event.target.isContentEditable) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showPhoto(activeIndex + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });

  function element(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }
  function photo(src, alt, cover, album) {
    // Only local paths and HTTP(S) images; never executable URL schemes.
    var url;
    try { url = new URL(src, location.href); } catch (e) { return null; }
    if (!/^(https?:|file:)$/.test(url.protocol)) return null;
    // Drive sharing pages are not image files; use their image thumbnail.
    var driveId = null;
    if (url.hostname === 'drive.google.com') {
      var match = url.pathname.match(/^\/file\/d\/([\w-]+)/);
      driveId = match ? match[1] : url.searchParams.get('id');
      if (!driveId || !/^[\w-]+$/.test(driveId)) return null;
    }
    var link = element('a', cover ? 'gallery-cover' : '');
    var img = element('img');
    img.src = driveId
      ? 'https://drive.google.com/thumbnail?id=' + encodeURIComponent(driveId) + '&sz=w1600'
      : url.href;
    link.href = img.src;
    var index = album.length;
    album.push({ src: img.src, alt: alt });
    link.addEventListener('click', function (event) {
      event.preventDefault();
      var ko = document.documentElement.lang === 'ko';
      close.textContent = ko ? '닫기 ×' : 'Close ×';
      previous.setAttribute('aria-label', ko ? '이전 사진' : 'Previous photo');
      next.setAttribute('aria-label', ko ? '다음 사진' : 'Next photo');
      viewer.setAttribute('aria-label', ko ? '사진 확대 보기' : 'Photo viewer');
      activePhotos = album;
      showPhoto(index);
      viewer.showModal();
    });
    img.alt = alt;
    img.loading = 'lazy';
    img.addEventListener('error', function () {
      img.hidden = true;
      link.classList.add('gallery-photo-unavailable');
      link.appendChild(element('span', '', document.documentElement.lang === 'ko'
        ? '사진을 불러올 수 없습니다.'
        : 'Photo unavailable.'));
    });
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
      var album = [];
      var card = element('article', 'news-card');
      var thumb = element('div', 'thumb');
      if (images.length) {
        var cover = photo(images[0], title + (ko ? ' — 대표 사진 확대 보기' : ' — Enlarge cover photo'), true, album);
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
          var link = photo(src, title + (ko ? ' — 사진 ' : ' — Photo ') + (i + 2), false, album);
          if (link) gallery.appendChild(link);
        });
        body.appendChild(gallery);
      }
      if (post.videos && post.videos.length) {
        var videos = element('div', 'gallery-videos');
        post.videos.forEach(function (clip, i) {
          var url;
          try { url = new URL(clip.src, location.href); } catch (e) { return; }
          if (!/^(https?:|file:)$/.test(url.protocol)) return;
          var video = element('video');
          video.controls = true;
          video.playsInline = true;
          video.preload = 'none';
          if (clip.webm) {
            var webmUrl;
            try { webmUrl = new URL(clip.webm, location.href); } catch (e) { webmUrl = null; }
            if (webmUrl && /^(https?:|file:)$/.test(webmUrl.protocol)) {
              var webm = element('source');
              webm.src = webmUrl.href;
              webm.type = 'video/webm';
              video.appendChild(webm);
            }
          }
          var mp4 = element('source');
          mp4.src = url.href;
          mp4.type = 'video/mp4';
          video.appendChild(mp4);
          if (clip.poster) video.poster = clip.poster;
          video.setAttribute('aria-label', title + (ko ? ' — 영상 ' : ' — Video ') + (i + 1));
          video.appendChild(element('p', '', ko ? '이 브라우저는 영상 재생을 지원하지 않습니다.' : 'Your browser does not support video playback.'));
          var videoItem = element('div', 'gallery-video-item');
          videoItem.appendChild(video);
          if (window.GALLERY_API && window.createGallerySocial) {
            var videoSocial = window.createGallerySocial({ collapsed: true });
            videoItem.appendChild(videoSocial.element);
            videoSocial.show(url.href);
          }
          videos.appendChild(videoItem);
        });
        body.appendChild(videos);
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
