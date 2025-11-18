document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('catalogContainer');

  // === Загрузка каталога ===
  try {
    const response = await fetch('catalog-pc.html');
    if (!response.ok) throw new Error('Ошибка загрузки каталога');

    container.innerHTML = await response.text();

    const script = document.createElement('script');
    script.src = 'js/catalog.js';
    document.body.appendChild(script);

    container.classList.add('open');
  } catch (error) {
    console.error('Ошибка загрузки каталога:', error);
  }

  // === Функция создания слайдера ===
  function createSlider(wrapperSelector, dotContainerSelector, nextBtn, prevBtn, interval) {
    const wrapper = document.querySelector(wrapperSelector);
    const dotsContainer = document.querySelector(dotContainerSelector);
    const slides = wrapper.children;
    let index = 0;

    // Создание точек
    Array.from(slides).forEach((_, i) => {
      const dot = document.createElement('button');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    function goToSlide(i) {
      index = (i + slides.length) % slides.length;
      wrapper.style.transform = `translateX(-${100 * index}%)`;
      dotsContainer.querySelectorAll('button').forEach((b, j) => b.classList.toggle('active', j === index));
    }

    document.querySelector(nextBtn).addEventListener('click', () => goToSlide(index + 1));
    document.querySelector(prevBtn).addEventListener('click', () => goToSlide(index - 1));

    if (interval) setInterval(() => goToSlide(index + 1), interval);

    // Свайп
    let startX = 0;
    wrapper.addEventListener('touchstart', e => startX = e.touches[0].clientX);
    wrapper.addEventListener('touchend', e => {
      const endX = e.changedTouches[0].clientX;
      if (startX - endX > 50) goToSlide(index + 1);
      if (endX - startX > 50) goToSlide(index - 1);
    });
  }

  // Инициализация слайдеров
  createSlider('.slides', '.dots', '.next', '.prev', 5000);
  createSlider('.product-slides', '.product-dots', '.product-next', '.product-prev', 7000);

  // === Рейтинг ===
  document.querySelectorAll('.hot-rating').forEach(rating => {
    const value = parseFloat(rating.dataset.rating);
    const starsContainer = rating.querySelector('.stars');
    starsContainer.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('img');
      star.src = 'images/star.svg';
      star.classList.add('star');
      star.style.filter = i <= value ? 'grayscale(0)' : (i - value < 1 ? 'grayscale(50%)' : 'grayscale(100%)');
      starsContainer.appendChild(star);
    }
  });

  // === Карточки ===
  const cards = document.querySelectorAll('.hot-card');
  cards.forEach(card => {
    const toggle = card.querySelector('.hot-toggle');
    toggle.addEventListener('click', e => {
      e.stopPropagation();
      cards.forEach(c => { if (c !== card) c.classList.remove('open'); });
      card.classList.toggle('open');
    });
  });

  document.addEventListener('click', e => {
    cards.forEach(card => { if (!card.contains(e.target)) card.classList.remove('open'); });
  });

  // === Избранное ===
  document.querySelectorAll('.hot-like').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      btn.querySelector('img').src = btn.classList.contains('active') 
        ? 'images/heart-filled.svg' 
        : 'images/heart.svg';
    });
  });

  // === Горизонтальный скролл карточек (если есть wrapper) ===
  const hotWrapper = document.querySelector('.hot-wrapper');
  if(hotWrapper) {
    const hotCards = hotWrapper.querySelectorAll('.hot-card');
    let isDown = false, startX = 0, scrollLeft = 0;

    hotWrapper.style.scrollBehavior = 'smooth';
    hotWrapper.addEventListener('mousedown', e => {
      isDown = true;
      hotWrapper.classList.add('grabbing');
      startX = e.pageX - hotWrapper.offsetLeft;
      scrollLeft = hotWrapper.scrollLeft;
    });

    hotWrapper.addEventListener('mouseleave', () => isDown = false);
    hotWrapper.addEventListener('mouseup', () => { isDown = false; hotWrapper.classList.remove('grabbing'); });
    hotWrapper.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - hotWrapper.offsetLeft;
      hotWrapper.scrollLeft = scrollLeft - (x - startX);
    });

    hotWrapper.addEventListener('touchend', () => { isDown = false; });
  }
});
