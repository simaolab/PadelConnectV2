document.addEventListener("DOMContentLoaded", function() {
  if (window.location.pathname === '/login') {

      // Seleção dos elementos
      const container = document.querySelector('.container');
      const registerBtn = document.querySelector('.register-btn');
      const loginBtn = document.querySelector('.login-btn');

      // Evento para alternar para o registro
      registerBtn.addEventListener('click', () => {
          container.classList.add('active');
      });

      // Evento para alternar para o login
      loginBtn.addEventListener('click', () => {
          container.classList.remove('active');
      });

      // Remover a animação ao carregar a página
      window.addEventListener('load', () => {
          document.querySelector('.container').classList.remove('no-animation');
      });

      // Navegação entre as etapas (steps)
      const nextBtn = document.querySelector('.btn-next');
      const previousBtn = document.querySelector('.btn-previous');

      const step1 = document.querySelector('.step-1');
      const step2 = document.querySelector('.step-2');

      // Navegar para o próximo passo
      if (nextBtn) {
          nextBtn.addEventListener('click', () => {
              step1.classList.add('hidden');  // Esconde o passo 1
              step2.classList.remove('hidden');  // Exibe o passo 2
          });
      }

      // Navegar para o passo anterior
      if (previousBtn) {
          previousBtn.addEventListener('click', () => {
              step1.classList.remove('hidden');  // Exibe o passo 1
              step2.classList.add('hidden');  // Esconde o passo 2
          });
      }
  }
});
