document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('catalogContainer');

  try {
    // Загружаем каталог сразу при загрузке страницы
    const response = await fetch('catalog.html');
    if (!response.ok) throw new Error('Ошибка загрузки каталога');

    const html = await response.text();
    container.innerHTML = html;

    // Подключаем твой JS, который отвечает за работу каталога
    const script = document.createElement('script');
    script.src = 'js/catalog.js';
    document.body.appendChild(script);

    // Сразу открываем каталог
    container.classList.add('open');

  } catch (error) {
    console.error('Ошибка загрузки каталога:', error);
  }
});

// === ОСНОВНОЙ СЛАЙДЕР (баннер) ===
const slides = document.querySelector(".slides");
const dotsContainer = document.querySelector(".dots");
const totalSlides = document.querySelectorAll(".slide").length;
let index = 0;

// Создание точек
for (let i = 0; i < totalSlides; i++) {
  const dot = document.createElement("button");
  if (i === 0) dot.classList.add("active");
  dot.addEventListener("click", () => goToSlide(i));
  dotsContainer.appendChild(dot);
}

function goToSlide(i) {
  index = (i + totalSlides) % totalSlides; // зацикливаем
  slides.style.transform = `translateX(-${100 * index}%)`;
  document.querySelectorAll(".dots button").forEach((b, j) =>
    b.classList.toggle("active", j === index)
  );
}

document.querySelector(".next").addEventListener("click", () => goToSlide(index + 1));
document.querySelector(".prev").addEventListener("click", () => goToSlide(index - 1));

// Автопрокрутка
setInterval(() => goToSlide(index + 1), 5000);

// Свайп для баннера
let startXBanner = 0;
slides.addEventListener('touchstart', e => startXBanner = e.touches[0].clientX);
slides.addEventListener('touchend', e => {
  let endX = e.changedTouches[0].clientX;
  if (startXBanner - endX > 50) goToSlide(index + 1);
  if (endX - startXBanner > 50) goToSlide(index - 1);
});


// === СЛАЙДЕР КАРТОЧЕК ТОВАРА ===
const productSlides = document.querySelector(".product-slides");
const productDotsContainer = document.querySelector(".product-dots");
const productTotal = document.querySelectorAll(".product-card").length;
let productIndex = 0;

// Создание точек
for (let i = 0; i < productTotal; i++) {
  const dot = document.createElement("button");
  if (i === 0) dot.classList.add("active");
  dot.addEventListener("click", () => goToProduct(i));
  productDotsContainer.appendChild(dot);
}

function goToProduct(i) {
  productIndex = (i + productTotal) % productTotal; // зацикливаем
  productSlides.style.transform = `translateX(-${100 * productIndex}%)`;
  document.querySelectorAll(".product-dots button").forEach((b, j) =>
    b.classList.toggle("active", j === productIndex)
  );
}

document.querySelector(".product-next").addEventListener("click", () => goToProduct(productIndex + 1));
document.querySelector(".product-prev").addEventListener("click", () => goToProduct(productIndex - 1));

// Автопрокрутка карточек
setInterval(() => goToProduct(productIndex + 1), 7000);

// Свайп для карточек
let startXProduct = 0;
productSlides.addEventListener('touchstart', e => startXProduct = e.touches[0].clientX);
productSlides.addEventListener('touchend', e => {
  let endX = e.changedTouches[0].clientX;
  if (startXProduct - endX > 50) goToProduct(productIndex + 1);
  if (endX - startXProduct > 50) goToProduct(productIndex - 1);
});



// === Рейтинг ===
document.querySelectorAll('.hot-rating').forEach(rating => {
  const value = parseFloat(rating.dataset.rating);
  const stars = rating.querySelectorAll('.star');
  stars.forEach((star, i) => {
    if (i < value) star.classList.add('active');
  });
});

// === Раскрытие описания (только одно открытое) ===
const cards = document.querySelectorAll('.hot-card');

cards.forEach(card => {
  const toggle = card.querySelector('.hot-toggle');

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();

    // Закрываем все остальные карточки
    cards.forEach(c => {
      if (c !== card) c.classList.remove('open');
    });

    // Переключаем текущее описание
    card.classList.toggle('open');
  });
});

// === Закрытие при клике вне карточки ===
document.addEventListener('click', (e) => {
  cards.forEach(card => {
    if (!card.contains(e.target)) {
      card.classList.remove('open');
    }
  });
});


// Получаем элементы
const hotWrapper = document.getElementById('hotWrapper');
const hotRow = hotWrapper.querySelector('.hot-row');
const hotLeft = document.querySelector('.hot-arrow.left');
const hotRight = document.querySelector('.hot-arrow.right');
const hotCards = hotRow.querySelectorAll('.hot-card');

// === СИНХРОНИЗАЦИЯ ОПИСАНИЙ ===
function closeAllDescriptions() {
  document.querySelectorAll('.hot-card.open').forEach(card => {
    card.classList.remove('open');
  });
}

// === Прокрутка к следующей карточке ===
function scrollNext() {
  const scrollLeft = hotWrapper.scrollLeft;
  for (let card of hotCards) {
    if (card.offsetLeft > scrollLeft + 1) { // +1 для точности
      hotWrapper.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
      break;
    }
  }
  closeAllDescriptions();
}

// === Прокрутка к предыдущей карточке ===
function scrollPrev() {
  const scrollLeft = hotWrapper.scrollLeft;
  for (let i = hotCards.length - 1; i >= 0; i--) {
    const card = hotCards[i];
    if (card.offsetLeft < scrollLeft - 1) { // -1 для точности
      hotWrapper.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
      break;
    }
  }
  closeAllDescriptions();
}

// События на стрелки
hotRight.addEventListener('click', scrollNext);
hotLeft.addEventListener('click', scrollPrev);

// === Свайп пальцем ===
let startXTouch = 0;
let scrollLeftTouch = 0;
let isTouching = false;

hotWrapper.addEventListener('touchstart', e => {
  isTouching = true;
  startXTouch = e.touches[0].pageX;
  scrollLeftTouch = hotWrapper.scrollLeft;
}, { passive: true });

hotWrapper.addEventListener('touchmove', e => {
  if (!isTouching) return;
  const x = e.touches[0].pageX;
  const walk = (startXTouch - x);
  hotWrapper.scrollLeft = scrollLeftTouch + walk;
}, { passive: true });

hotWrapper.addEventListener('touchend', () => {
  isTouching = false;
  closeAllDescriptions();
}, { passive: true });

// === Перетаскивание мышкой ===
let isDown = false;
let startX = 0;
let scrollLeft = 0;

hotWrapper.addEventListener('mousedown', e => {
  isDown = true;
  startX = e.pageX;
  scrollLeft = hotWrapper.scrollLeft;
  hotWrapper.classList.add('grabbing');
});

document.addEventListener('mouseup', () => {
  isDown = false;
  hotWrapper.classList.remove('grabbing');
  closeAllDescriptions();
});

hotWrapper.addEventListener('mousemove', e => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX;
  const walk = (x - startX);
  hotWrapper.scrollLeft = scrollLeft - walk;
});

// === Плавность для всех устройств ===
hotWrapper.style.scrollBehavior = 'smooth';

// === Добавления в избранное ===
document.querySelectorAll('.hot-like').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    
    const img = btn.querySelector('img');
    if(btn.classList.contains('active')) {
      img.src = 'images/heart-filled.svg'; // версия с заливкой FF7700
    } else {
      img.src = 'images/heart.svg'; // исходная версия с бордером
    }
  });
});
