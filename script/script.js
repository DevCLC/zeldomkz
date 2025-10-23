const catalogButton = document.getElementById('catalogButton');
const catalogOverlay = document.getElementById('catalogOverlay');
const sidebarItems = document.querySelectorAll('.catalog-sidebar li');
const subBlocks = document.querySelectorAll('.catalog-sub');

// === Открытие / закрытие каталога ===
catalogButton.addEventListener('click', () => {
  const isActive = catalogOverlay.classList.toggle('active');
  catalogButton.classList.toggle('active', isActive);
  document.body.classList.toggle('catalog-open', isActive);

  // ✅ При открытии активируем первую категорию
  if (isActive) {
    // снимаем активность со всех
    sidebarItems.forEach(i => i.classList.remove('active'));
    subBlocks.forEach(sub => sub.classList.remove('active'));

    // выбираем первую категорию
    const firstItem = sidebarItems[0];
    if (firstItem) {
      firstItem.classList.add('active');
      const category = firstItem.dataset.category;
      const activeBlock = document.querySelector(`.catalog-sub[data-category="${category}"]`);
      if (activeBlock) activeBlock.classList.add('active');
    }
  }
});

// === Переключение категорий ===
sidebarItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    // сбрасываем всё
    sidebarItems.forEach(i => i.classList.remove('active'));
    subBlocks.forEach(sub => sub.classList.remove('active'));

    // активируем текущую
    item.classList.add('active');
    const category = item.dataset.category;
    const activeBlock = document.querySelector(`.catalog-sub[data-category="${category}"]`);
    if (activeBlock) {
      activeBlock.classList.add('active');
    }
  });
});

// === Закрытие при клике вне панели ===
catalogOverlay.addEventListener('click', (e) => {
  // клик именно по оверлею, не по панели
  if (e.target === catalogOverlay) {
    catalogOverlay.classList.remove('active');
    catalogButton.classList.remove('active');
    document.body.classList.remove('catalog-open');
  }
});

let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll <= 0) {
    header.classList.remove('hide');
    return;
  }

  if (currentScroll > lastScroll && !header.classList.contains('hide')) {
    // скроллим вниз — скрываем хедер
    header.classList.add('hide');
  } else if (currentScroll < lastScroll && header.classList.contains('hide')) {
    // скроллим вверх — показываем хедер
    header.classList.remove('hide');
  }

  lastScroll = currentScroll;
});
