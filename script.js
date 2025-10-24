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
