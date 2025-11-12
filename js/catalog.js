const catalogButton = document.getElementById('catalogButton');
const catalogOverlay = document.getElementById('catalogOverlay');
const sidebarItems = document.querySelectorAll('.catalog-sidebar li');
const subBlocks = document.querySelectorAll('.catalog-sub');

let isFirstOpen = true;
let switchTimer = null;
let catalogOpen = false; // Флаг для блокировки скролла

function disableScroll() {
  catalogOpen = true;
  document.body.style.overflow = 'hidden';
  window.addEventListener('wheel', preventScroll, { passive: false });
  window.addEventListener('touchmove', preventScroll, { passive: false });
  window.addEventListener('keydown', preventKeyScroll, { passive: false });
}

function enableScroll() {
  catalogOpen = false;
  document.body.style.overflow = '';
  window.removeEventListener('wheel', preventScroll);
  window.removeEventListener('touchmove', preventScroll);
  window.removeEventListener('keydown', preventKeyScroll);
}

function preventScroll(e) {
  if (catalogOpen) e.preventDefault();
}

function preventKeyScroll(e) {
  const keys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
  if (catalogOpen && keys.includes(e.key)) e.preventDefault();
}

// === Клик по кнопке каталога ===
catalogButton.addEventListener('click', () => {
  const isActive = catalogOverlay.classList.toggle('active');
  catalogButton.classList.toggle('active', isActive);
  document.body.classList.toggle('catalog-open', isActive);

  if (isActive) {
    disableScroll();
    catalogOverlay.style.pointerEvents = 'auto';

    if (isFirstOpen && sidebarItems.length > 0) {
      setTimeout(() => {
        activateCategory(sidebarItems[0]);
        isFirstOpen = false;
      }, 50);
    }
  } else {
    enableScroll();
    catalogOverlay.style.pointerEvents = 'none';
    sidebarItems.forEach(i => i.classList.remove('active'));
    subBlocks.forEach(sub => {
      sub.classList.remove('active');
      sub.style.display = 'none';
    });
    isFirstOpen = true;
  }
});

// === Клик по категориям ===
sidebarItems.forEach(item => {
  item.addEventListener('click', () => {
    if (!item.classList.contains('active')) {
      if (switchTimer) clearTimeout(switchTimer);
      switchTimer = setTimeout(() => activateCategory(item), 80);
    }
  });
});

// === Клик вне панели ===
catalogOverlay.addEventListener('click', e => {
  if (e.target === catalogOverlay) {
    catalogOverlay.classList.remove('active');
    catalogButton.classList.remove('active');
    document.body.classList.remove('catalog-open');
    enableScroll();
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
