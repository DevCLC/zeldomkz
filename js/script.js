document.addEventListener('DOMContentLoaded', () => {
  const catalogButton = document.getElementById('catalogButton');
  const container = document.getElementById('catalogContainer');
  let catalogLoaded = false;

  catalogButton.addEventListener('click', async () => {
    if (!catalogLoaded) {
      try {
        // Загружаем каталог (файл лежит в корне)
        const response = await fetch('catalog.html');
        if (!response.ok) throw new Error('Ошибка загрузки каталога');

        const html = await response.text();
        container.innerHTML = html;
        catalogLoaded = true;

        // Подключаем твой JS, который лежит рядом (в js/)
        const script = document.createElement('script');
        script.src = 'js/catalog.js';
        document.body.appendChild(script);

      } catch (error) {
        console.error('Ошибка загрузки каталога:', error);
      }
    }

    // Переключаем видимость каталога
    container.classList.toggle('open');
  });
});
