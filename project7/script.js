let data = {};
let bookmarks = [];

fetch('data.json')
  .then(res => res.json())
  .then(json => {
    data = json;
    renderPage();
  });

function renderPage() {
  const hash = location.hash || '#home';
  const content = document.getElementById('contentArea');
  content.innerHTML = '';

  if (hash === '#home') {
    renderSection('Trending', data.trending, content);
    renderSection('Recommended for you', data.recommended, content);
  } else if (hash === '#watchlist') {
    renderSection('Watchlist', bookmarks, content);
  }
}

function renderSection(title, items, container) {
  const section = document.createElement('div');
  section.className = 'section';
  section.innerHTML = `<h2>${title}</h2>`;

  const grid = document.createElement('div');
  grid.className = 'grid';

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <img src="${item.thumbnail}" alt="${item.title}" />
      <h4>${item.title}</h4>
      <p>${item.year} • ${item.type} • ${item.rating}</p>
      <button onclick="toggleBookmark('${item.title}')">
        ${bookmarks.some(b => b.title === item.title) ? '🔖' : '🔗'}
      </button>
    `;

    grid.appendChild(card);
  });

  section.appendChild(grid);
  container.appendChild(section);
}

function toggleBookmark(title) {
  const allItems = [...data.trending, ...data.recommended];
  const item = allItems.find(i => i.title === title);

  if (!item) return;

  const index = bookmarks.findIndex(i => i.title === title);
  if (index > -1) {
    bookmarks.splice(index, 1);
  } else {
    bookmarks.push(item);
  }
  renderPage(); // Refresh
}

document.getElementById('searchInput').addEventListener('input', function () {
  const search = this.value.toLowerCase();
  const filteredTrending = data.trending.filter(i => i.title.toLowerCase().includes(search));
  const filteredRecommended = data.recommended.filter(i => i.title.toLowerCase().includes(search));

  const content = document.getElementById('contentArea');
  content.innerHTML = '';
  renderSection('Search Results - Trending', filteredTrending, content);
  renderSection('Search Results - Recommended', filteredRecommended, content);
});

window.addEventListener('hashchange', renderPage);
