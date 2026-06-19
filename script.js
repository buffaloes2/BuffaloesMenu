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

// ─────────────────────────────────────────────
// BAR: CATEGORY FILTER
// ─────────────────────────────────────────────
function filterCat(btn, cat) {
  document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Force clear the search input
  document.getElementById('bar-search').value = '';

  // Reset ALL items and categories to visible first
  document.querySelectorAll('#menu-bar .menu-item').forEach(item => {
    item.style.display = '';
  });
  document.querySelectorAll('#menu-bar .category').forEach(el => {
    el.style.display = '';
  });

  // Now apply the category filter
  if (cat !== 'all') {
    document.querySelectorAll('#menu-bar .category').forEach(el => {
      el.style.display = (el.dataset.cat === cat) ? '' : 'none';
    });
  }

  // closes the category side bar
  document.getElementById('category-sidebar').classList.remove('open');

  showNoResults();
}

// ─────────────────────────────────────────────
// BAR: SEARCH FILTER
// ─────────────────────────────────────────────
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
      const itemName = item.querySelector('.item-name');
      const itemDesc = item.querySelector('.item-desc');
      const nameText = itemName ? itemName.innerText.toLowerCase() : '';
      const descText = itemDesc ? itemDesc.innerText.toLowerCase() : '';
      const match = nameText.includes(query) || descText.includes(query);
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

// ─────────────────────────────────────────────
// MINI DROPDOWN INSIDE SEARCH BAR
// ─────────────────────────────────────────────
function populateDropdown() {
  const dropdown = document.getElementById('mini-dropdown');
  const categories = [
    { cat: 'all', label: 'All', icon: '🍸' },
    { cat: 'rum', label: 'Rum', icon: '🥃' },
    { cat: 'vodka', label: 'Vodka', icon: '🍸' },
    { cat: 'gin', label: 'Gin', icon: '🍹' },
    { cat: 'tequila', label: 'Tequila', icon: '🥂' },
    { cat: 'cognac', label: 'Cognac', icon: '🥃' },
    { cat: 'whiskey', label: 'Whiskey', icon: '🥃' },
    { cat: 'malt', label: 'Single Malt', icon: '🥃' },
    { cat: 'liqueur', label: 'Liqueur', icon: '🍷' },
    { cat: 'wine', label: 'Wine', icon: '🍷' },
    { cat: 'champagne', label: 'Champagne', icon: '🍾' },
    { cat: 'cocktails', label: 'Cocktails', icon: '🍹' },
    { cat: 'shooters', label: 'Shooters', icon: '🥃' },
    { cat: 'cold', label: 'Cold Drinks', icon: '🍺' },
  ];

  dropdown.innerHTML = categories.map(c => `
    <div class="mini-dropdown-item" onclick="selectDropdownCategory('${c.cat}')">
      <span class="cat-icon">${c.icon}</span>
      <span class="cat-label">${c.label}</span>
    </div>
  `).join('');
}

// ─────────────────────────────────────────────
// SELECT DROPDOWN CATEGORY (INSTANT CLOSE)
// ─────────────────────────────────────────────
function selectDropdownCategory(cat) {
  // Find the corresponding pill button and trigger filter
  const pills = document.querySelectorAll('.cat-pill');
  let targetBtn = null;
  pills.forEach(btn => {
    if (btn.textContent.trim().toLowerCase() === cat || 
        (cat === 'all' && btn.textContent.trim() === 'ALL')) {
      targetBtn = btn;
    }
  });
  
  if (targetBtn) {
    filterCat(targetBtn, cat);
  }
  
  // ✅ FORCE CLOSE THE DROPDOWN INSTANTLY
  const dropdown = document.getElementById('mini-dropdown');
  dropdown.classList.remove('show');
  
  // Reset the input field
  document.getElementById('bar-search').value = '';
  document.getElementById('bar-search').blur();
}

// ─────────────────────────────────────────────
// DROPDOWN SHOW / HIDE
// ─────────────────────────────────────────────
function showDropdown() {
  // Only show if we are inside the Bar menu
  if (document.getElementById('bar-controls').style.display !== 'none') {
    document.getElementById('mini-dropdown').classList.add('show');
  }
}

function hideDropdown() {
  // We use a small delay to let the user click the dropdown item
  setTimeout(() => {
    document.getElementById('mini-dropdown').classList.remove('show');
  }, 300);
}

// ==========================================
// PARALLAX SCROLL
// ==========================================
window.addEventListener('scroll', () => {
  document.querySelectorAll('.split-layout').forEach(layout => {
    const rect = layout.getBoundingClientRect();
    const offset = Math.max(0, -rect.top);
    const imageColumn = layout.querySelector('.split-left');

    if (imageColumn) {
      imageColumn.style.transform = `translateY(${offset * 0.4}px)`;
    }
  });
}, { passive: true });
