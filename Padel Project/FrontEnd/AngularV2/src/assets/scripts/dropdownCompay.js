


document.addEventListener("DOMContentLoaded", function() {
  const dropdowns = document.querySelectorAll('.dropdown');

  dropdowns.forEach(dropdown => {
      const select = dropdown.querySelector('.select');
      const caret = dropdown.querySelector('.caret');
      const menu = dropdown.querySelector('.menu');
      const options = dropdown.querySelectorAll('.menu li');
      const selected = dropdown.querySelector('.selected');
      const hiddenInput = document.getElementById('roleHiddenField');

      select.addEventListener('click', (e) => {
          e.stopPropagation();
          select.classList.toggle('select-clicked');
          caret.classList.toggle('caret-rotate');
          menu.classList.toggle('menu-open');
      });

      options.forEach(option => {
          option.addEventListener('click', (e) => {
            e.stopPropagation();
            
              selected.innerText = option.innerText;
              hiddenInput.value = option.getAttribute('data-value');
              
              select.classList.remove('select-clicked');
              caret.classList.remove('caret-rotate');
              menu.classList.remove('menu-open');

              options.forEach(option => {
                  option.classList.remove('active');
              });
              option.classList.add('active');
          });
      });

      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            select.classList.remove('select-clicked');
            caret.classList.remove('caret-rotate');
            menu.classList.remove('menu-open');
        }
    });
  });
});
