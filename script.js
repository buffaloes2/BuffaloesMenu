// ─────────────────────────────────────────────
// SHOW / HIDE SECTIONS
// ─────────────────────────────────────────────
function showSection(key) {
  document.getElementById('landing').style.display = 'none';
  const view = document.getElementById('section-view');
  view.style.display = 'block';

  document.getElementById('menu-food').style.display = 'none';
  document.getElementById('menu-drinks').style.display = 'none';
  document.getElementById('menu-bar').style.display = 'none';
  document.getElementById('menu-' + key).style.display = 'block';

  const titles = { food: 'FOOD MENU', drinks: 'DRINKS MENU', bar: 'BAR MENU' };
  document.getElementById('section-title-bar').innerText = titles[key];

  const barControls = document.getElementById('bar-controls');
  if (key === 'bar') {
    barControls.style.display = 'block';
    document.getElementById('bar-search').value = '';
    document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
    document.querySelector('.cat-pill').classList.add('active');
    document.querySelectorAll('#menu-bar .category').forEach(el => el.style.display = '');
    document.querySelectorAll('#menu-bar .menu-item').forEach(el => el.style.display = '');
    document.getElementById('category-sidebar').classList.remove('open');
  } else {
    barControls.style.display = 'none';
  }

  window.scrollTo(0, 0);
}

function goBack() {
  document.getElementById('section-view').style.display = 'none';
  document.getElementById('landing').style.display = 'flex';
  document.getElementById('bar-controls').style.display = 'none';
  window.scrollTo(0, 0);
}

function toggleCategorySidebar() {
  const sidebar = document.getElementById('category-sidebar');
  sidebar.classList.toggle('open');
}

function filterCat(btn, cat) {
  document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.getElementById('bar-search').value = '';

  const categories = document.querySelectorAll('#menu-bar .category');
  categories.forEach(el => {
    if (cat === 'all') {
      el.style.display = '';
    } else {
      el.style.display = (el.dataset.cat === cat) ? '' : 'none';
    }
  });

  showNoResults();
  document.getElementById('section-content').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function filterBar() {
  const query = document.getElementById('bar-search').value.toLowerCase().trim();

  document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
  document.querySelector('.cat-pill').classList.add('active');

  const categories = document.querySelectorAll('#menu-bar .category');
  categories.forEach(cat => {
    if (!query) {
      cat.style.display = '';
      cat.querySelectorAll('.menu-item').forEach(item => item.style.display = '');
      return;
    }

    let catVisible = false;
    cat.querySelectorAll('.menu-item').forEach(item => {
      const text = item.innerText.toLowerCase();
      const match = text.includes(query);
      item.style.display = match ? '' : 'none';
      if (match) catVisible = true;
    });
    cat.style.display = catVisible ? '' : 'none';
  });

  showNoResults();
}

function showNoResults() {
  const content = document.getElementById('menu-bar');
  if (!content) return;

  const existing = content.querySelector('.no-results');
  const anyVisible = [...content.querySelectorAll('.category')].some(c => c.style.display !== 'none');

  if (!anyVisible) {
    if (!existing) {
      const msg = document.createElement('div');
      msg.className = 'no-results';
      msg.textContent = 'No results found. Try a different search or category.';
      content.appendChild(msg);
    }
  } else {
    if (existing) existing.remove();
  }
}

window.addEventListener('scroll', () => {
  const splitLayouts = document.querySelectorAll('.split-layout');
  
  splitLayouts.forEach(layout => {
    const rect = layout.getBoundingClientRect();
    const offset = Math.max(0, -rect.top);
    const imageColumn = layout.querySelector('.split-left');
    
    if (imageColumn) {
      imageColumn.style.transform = `translateY(${offset * 0.4}px)`;
    }
  });
}, { passive: true });