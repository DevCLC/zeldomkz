const catalogButton = document.getElementById('catalogButton');
const catalogOverlay = document.getElementById('catalogOverlay');
const sidebarItems = document.querySelectorAll('.catalog-sidebar li');
const subBlocks = document.querySelectorAll('.catalog-sub');

let isFirstOpen = true;
let switchTimer = null;

catalogButton.addEventListener('click', () => {
  const isActive = catalogOverlay.classList.toggle('active');
  catalogButton.classList.toggle('active', isActive);
  document.body.classList.toggle('catalog-open', isActive); // блокируем/разблокируем скролл

  if (isActive) {
    catalogOverlay.style.pointerEvents = 'auto';

    // показываем только первую категорию при первом открытии
    if (isFirstOpen && sidebarItems.length > 0) {
      setTimeout(() => {
        activateCategory(sidebarItems[0]);
        isFirstOpen = false;
      }, 50);
    }
  } else {
    catalogOverlay.style.pointerEvents = 'none';
    sidebarItems.forEach(i => i.classList.remove('active'));
    subBlocks.forEach(sub => {
      sub.classList.remove('active');
      sub.style.display = 'none';
    });
    isFirstOpen = true;
  }
});

// Клик вне панели закрывает каталог
catalogOverlay.addEventListener('click', e => {
  if (e.target === catalogOverlay) {
    catalogOverlay.classList.remove('active');
    catalogButton.classList.remove('active');
    document.body.classList.remove('catalog-open'); // возвращаем скролл
    isFirstOpen = true;
  }
});


function activateCategory(item) {
  if (!item) return;

  if (switchTimer) {
    clearTimeout(switchTimer);
    switchTimer = null;
  }

  const category = item.dataset.category;
  const newSub = document.querySelector(`.catalog-sub[data-category="${category}"]`);

  sidebarItems.forEach(i => i.classList.remove('active'));
  subBlocks.forEach(sub => {
    sub.classList.remove('active');
    sub.style.display = 'none';
  });

  item.classList.add('active');

  if (newSub) {
    newSub.style.display = 'block';
    requestAnimationFrame(() => {
      newSub.classList.add('active');
    });
  }
}

// === Клик по категориям ===
sidebarItems.forEach(item => {
  item.addEventListener('click', () => {
    if (!item.classList.contains('active')) {
      if (switchTimer) clearTimeout(switchTimer);
      switchTimer = setTimeout(() => activateCategory(item), 80);
    }
  });
});

// === Скрытие хедера при скролле ===
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll <= 0) {
    header.classList.remove('hide');
    return;
  }

  if (currentScroll > lastScroll && !header.classList.contains('hide')) {
    header.classList.add('hide');
  } else if (currentScroll < lastScroll && header.classList.contains('hide')) {
    header.classList.remove('hide');
  }

  lastScroll = currentScroll;
});

