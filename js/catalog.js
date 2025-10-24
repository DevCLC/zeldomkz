const catalogButton = document.getElementById('catalogButton');
const catalogOverlay = document.getElementById('catalogOverlay');
const sidebarItems = document.querySelectorAll('.catalog-sidebar li');
const subBlocks = document.querySelectorAll('.catalog-sub');

let isFirstOpen = true;
let switchTimer = null;

catalogButton.addEventListener('click', () => {
  const isActive = catalogOverlay.classList.toggle('active');
  catalogButton.classList.toggle('active', isActive);
  document.body.classList.toggle('catalog-open', isActive);

  if (isActive) {
    // === Открытие каталога ===
    catalogOverlay.style.pointerEvents = 'auto';

    if (isFirstOpen && sidebarItems.length > 0) {
      setTimeout(() => {
        activateCategory(sidebarItems[0]);
        isFirstOpen = false;
      }, 50);
    }
  } else {
    // === Закрытие каталога ===
    catalogOverlay.style.pointerEvents = 'none';

    sidebarItems.forEach(i => i.classList.remove('active'));
    subBlocks.forEach(sub => {
      sub.classList.remove('active');
      sub.style.display = 'none';
    });

    isFirstOpen = true;
  }
});

function activateCategory(item) {
  if (!item) return;

  if (switchTimer) {
    clearTimeout(switchTimer);
    switchTimer = null;
  }

  const currentSub = document.querySelector('.catalog-sub.active');
  const category = item.dataset.category;
  const newSub = document.querySelector(`.catalog-sub[data-category="${category}"]`);

  // 🟡 если категории нет — просто подсвечиваем пункт и выходим, вообще ничего не скрываем
  if (!newSub) {
    sidebarItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    return;
  }

  if (currentSub === newSub) return;

  sidebarItems.forEach(i => i.classList.remove('active'));
  item.classList.add('active');

  // скрываем все подкатегории
  subBlocks.forEach(sub => {
    sub.classList.remove('active');
    sub.style.display = 'none';
  });

  // показываем новую
  newSub.style.display = 'block';

  // двойной кадр — для плавного появления
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      newSub.classList.add('active');
    });
  });
}

// === Наведение / клик по категориям ===
sidebarItems.forEach(item => {
  ['mouseenter', 'click'].forEach(event => {
    item.addEventListener(event, () => {
      if (!item.classList.contains('active')) {
        // небольшая защита от "мелькания"
        if (switchTimer) clearTimeout(switchTimer);
        switchTimer = setTimeout(() => activateCategory(item), 80);
      }
    });
  });
});

// === Закрытие при клике вне панели ===
catalogOverlay.addEventListener('click', e => {
  if (e.target === catalogOverlay) {
    catalogOverlay.classList.remove('active');
    catalogButton.classList.remove('active');
    document.body.classList.remove('catalog-open');
    isFirstOpen = true;
  }
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
