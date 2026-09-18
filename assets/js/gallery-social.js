(function () {
  window.createGallerySocial = function () {
    var api = window.GALLERY_API;
    var panel = make('section', 'gallery-social');
    var current = null;
    var version = 0;
    var nextCursor = null;
    var busyComment = false;
    var pendingComment = null;
    var states = new Map();
    var like = make('button', 'gallery-like');
    like.type = 'button';
    var hint = make('span', 'gallery-like-hint');
    var row = make('div', 'gallery-like-row');
    row.append(like, hint);
    var heading = make('h3');
    var status = make('p', 'gallery-social-status');
    status.setAttribute('role', 'status');
    var form = make('form', 'gallery-comment-form');
    var nameLabel = make('label');
    var nameText = make('span');
    var name = make('input');
    name.name = 'nickname'; name.maxLength = 40; name.required = true; name.autocomplete = 'nickname';
    try { name.value = localStorage.getItem('gallery-nickname') || ''; } catch (e) {}
    nameLabel.append(nameText, name);
    var bodyLabel = make('label');
    var bodyText = make('span');
    var body = make('textarea');
    body.name = 'comment'; body.maxLength = 1000; body.required = true; body.rows = 2;
    bodyLabel.append(bodyText, body);
    var submit = make('button'); submit.type = 'submit';
    form.append(nameLabel, bodyLabel, submit);
    var list = make('div', 'gallery-comments');
    var more = make('button', 'gallery-comments-more'); more.type = 'button'; more.hidden = true;
    panel.append(row, heading, form, status, list, more);

    function make(tag, cls, text) {
      var el = document.createElement(tag);
      if (cls) el.className = cls;
      if (text !== undefined) el.textContent = text;
      return el;
    }
    function tr(ko, en) { return document.documentElement.lang === 'ko' ? ko : en; }
    function message(text) { status.textContent = text; }
    async function request(path, payload) {
      var response = await fetch(api + path, payload ? {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), signal: AbortSignal.timeout(12000)
      } : { signal: AbortSignal.timeout(12000), cache: 'no-store' });
      if (!response.ok) throw new Error('Request failed');
      return response.json();
    }
    function state(photo) {
      if (!states.has(photo)) states.set(photo, { likes: null, queue: [], sending: false });
      return states.get(photo);
    }
    function drawLikes() {
      if (!current) return;
      var value = state(current);
      like.textContent = '♥ ' + tr('좋아요', 'Like') + ' ' + (value.likes === null ? '—' : value.likes + value.queue.length);
      like.disabled = value.likes === null;
    }
    function renderComments(comments, append) {
      if (!append) list.replaceChildren();
      comments.forEach(function (comment) {
        var item = make('article', 'gallery-comment');
        var byline = make('div', 'gallery-comment-byline');
        var time = make('time'); time.dateTime = comment.created_at;
        time.textContent = new Date(comment.created_at).toLocaleString(document.documentElement.lang);
        byline.append(make('strong', '', comment.name), time);
        item.append(byline, make('p', '', comment.body));
        list.appendChild(item);
      });
      if (!list.children.length) list.appendChild(make('p', 'gallery-no-comments', tr('첫 댓글을 남겨주세요.', 'Leave the first comment.')));
    }
    async function load(append) {
      var photo = current, stamp = version;
      more.disabled = true;
      try {
        var data = await request('/photo?photo=' + encodeURIComponent(photo) + (append && nextCursor ? '&before=' + nextCursor : ''));
        if (stamp !== version) return;
        var value = state(photo);
        value.likes = Math.max(value.likes || 0, data.likes);
        drawLikes(); renderComments(data.comments, append);
        nextCursor = data.next; more.hidden = !nextCursor;
        message('');
      } catch (error) {
        if (stamp === version) message(tr('불러오지 못했어요. 페이지를 새로고침해주세요.', 'Could not load. Please refresh the page.'));
      } finally { if (stamp === version) more.disabled = false; }
    }
    async function sendLikes(photo) {
      var value = state(photo);
      if (value.sending) return;
      value.sending = true;
      while (value.queue.length) {
        var payload = { photo: photo, requestId: value.queue[0] };
        try {
          var data;
          try { data = await request('/like', payload); }
          catch (error) { data = await request('/like', payload); }
          value.queue.shift(); value.likes = Math.max(value.likes || 0, data.likes);
          if (current === photo) { drawLikes(); message(''); }
        } catch (error) {
          value.queue = [];
          if (current === photo) {
            drawLikes();
            message(tr('좋아요 저장을 확인하지 못했어요. 새로고침해서 확인해주세요.', 'Could not confirm your likes. Refresh the page to check.'));
          }
          break;
        }
      }
      value.sending = false;
    }
    like.addEventListener('click', function () {
      if (!current || like.disabled) return;
      state(current).queue.push(crypto.randomUUID()); drawLikes();
      void sendLikes(current);
    });
    more.addEventListener('click', function () { void load(true); });
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      if (!current || busyComment || !form.reportValidity()) return;
      var nickname = name.value.trim(), text = body.value.trim();
      if (!nickname || !text) return;
      var photo = current, stamp = version;
      if (!pendingComment || pendingComment.photo !== photo || pendingComment.name !== nickname || pendingComment.body !== text) {
        pendingComment = { photo: photo, name: nickname, body: text, requestId: crypto.randomUUID() };
      }
      busyComment = true; submit.disabled = true;
      try {
        await request('/comment', pendingComment);
        try { localStorage.setItem('gallery-nickname', nickname); } catch (e) {}
        if (stamp === version) { body.value = ''; pendingComment = null; await load(false); }
      } catch (error) {
        if (stamp === version) message(tr('댓글을 저장하지 못했어요. 입력 내용은 유지돼요. 다시 등록해주세요.', 'Could not save. Your text is kept; please try again.'));
      } finally {
        if (stamp === version) { busyComment = false; submit.disabled = false; }
      }
    });
    return {
      element: panel,
      show: function (src) {
        version++;
        current = decodeURI(new URL(src, location.href).pathname).replace(/^\/choi-lab-site\//, '').replace(/^\//, '');
        body.value = ''; pendingComment = null; busyComment = false; submit.disabled = false;
        list.replaceChildren(); more.hidden = true; nextCursor = null;
        heading.textContent = tr('댓글', 'Comments'); nameText.textContent = tr('닉네임', 'Nickname');
        bodyText.textContent = tr('댓글 내용', 'Comment'); submit.textContent = tr('등록', 'Post');
        more.textContent = tr('이전 댓글 더 보기', 'Load older comments');
        hint.textContent = tr('좋아요는 여러 번 누를 수 있어요.', 'Tap as many times as you like.');
        message(tr('불러오는 중…', 'Loading…')); drawLikes();
        void load(false);
      },
      close: function () { version++; current = null; }
    };
  };
})();
