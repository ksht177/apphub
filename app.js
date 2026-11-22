const $ = s => document.querySelector(s);
let apps = [], activeTag = null, keyword = '';

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '"', "'": '&#39;' }[c]));
}

// 核心：拼 GitHub Release 最新版直链（无需 API，不吃限流）
function dlUrl(a) {
  return `https://github.com/${a.repo}/releases/latest/download/${a.asset}`;
}

async function load() {
  try {
    const res = await fetch('catalog.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    apps = data.apps || [];
    $('#count').textContent = apps.length + ' 个应用';
    renderTags();
    render();
  } catch (e) {
    $('#grid').innerHTML = '<div class="empty">清单加载失败：' + esc(e.message) + '</div>';
  }
}

function renderTags() {
  const tagSet = new Set();
  apps.forEach(a => (a.tags || []).forEach(t => tagSet.add(t)));
  const box = $('#tags');
  box.innerHTML = '';
  const all = document.createElement('span');
  all.className = 'tag' + (activeTag === null ? ' active' : '');
  all.textContent = '全部';
  all.onclick = () => { activeTag = null; renderTags(); render(); };
  box.appendChild(all);
  [...tagSet].forEach(t => {
    const el = document.createElement('span');
    el.className = 'tag' + (activeTag === t ? ' active' : '');
    el.textContent = t;
    el.onclick = () => { activeTag = t; renderTags(); render(); };
    box.appendChild(el);
  });
}

function render() {
  const kw = keyword.toLowerCase();
  const list = apps.filter(a => {
    if (activeTag && !(a.tags || []).includes(activeTag)) return false;
    if (!kw) return true;
    return [a.name, a.author, a.desc, a.repo].join(' ').toLowerCase().includes(kw);
  });
  const grid = $('#grid');
  if (!list.length) { grid.innerHTML = '<div class="empty">没有匹配的应用</div>'; return; }
  grid.innerHTML = list.map(a => `
    <div class="card">
      <div class="card-top">
        <div class="icon">${a.icon ? `<img src="${esc(a.icon)}" onerror="this.remove()">` : '📦'}</div>
        <div>
          <div class="card-title">${esc(a.name)}</div>
          <div class="card-author">@${esc(a.author || a.repo.split('/')[0])}</div>
        </div>
      </div>
      <div class="card-desc">${esc(a.desc)}</div>
      <div class="card-tags">
        ${(a.tags || []).map(t => `<span>${esc(t)}</span>`).join('')}
        ${a.platform ? `<span class="badge">${esc(a.platform)}</span>` : ''}
      </div>
      <div class="card-actions">
        <a class="btn btn-primary" href="${esc(dlUrl(a))}">⬇ 下载最新版</a>
        <a class="btn" href="https://github.com/${esc(a.repo)}" target="_blank" rel="noopener">仓库</a>
        <button class="btn" onclick="copyLink('${esc(dlUrl(a))}')">复制链接</button>
      </div>
    </div>`).join('');
}

function copyLink(url) {
  (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject())
    .then(() => toast('链接已复制'))
    .catch(() => { prompt('手动复制：', url); });
}

function toast(msg) {
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#238636;color:#fff;padding:8px 20px;border-radius:8px;z-index:99;font-size:14px';
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1500);
}

$('#search').addEventListener('input', e => { keyword = e.target.value.trim(); render(); });
load();