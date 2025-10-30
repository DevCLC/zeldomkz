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
  index = i;
  slides.style.transform = `translateX(-${100 * index}%)`;
  document.querySelectorAll(".dots button").forEach((b, j) =>
    b.classList.toggle("active", j === index)
  );
}

document.querySelector(".next").addEventListener("click", () => {
  index = (index + 1) % totalSlides;
  goToSlide(index);
});

document.querySelector(".prev").addEventListener("click", () => {
  index = (index - 1 + totalSlides) % totalSlides;
  goToSlide(index);
});

// Автопрокрутка
setInterval(() => {
  index = (index + 1) % totalSlides;
  goToSlide(index);
}, 5000);
