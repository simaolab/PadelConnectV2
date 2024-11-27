document.addEventListener("DOMContentLoaded", function() {

  if(window.location.pathname === '/login') {


    const container = document.querySelector('.container');
    const registerBtn = document.querySelector('.register-btn');
    const loginBtn = document.querySelector('.login-btn');


    registerBtn.addEventListener('click', () => {
        container.classList.add('active');
    });

    loginBtn.addEventListener('click', () => {
        container.classList.remove('active');
    });

    window.addEventListener('load', () => {
        document.querySelector('.container').classList.remove('no-animation');
    });

    //STEPS
    const nextBtn = document.querySelector('.btn-next');
    const previousBtn = document.querySelector('.btn-previous');

    const step1 = document.querySelector('.step-1');
    const step2 = document.querySelector('.step-2');

    nextBtn.addEventListener('click', () => {
      step1.classList.add('hidden');  // Esconde o passo 1
      step2.classList.remove('hidden');  // Exibe o passo 2
    });

    // Ação para o botão 'Previous'
    previousBtn.addEventListener('click', () => {
      step1.classList.remove('hidden');  // Exibe o passo 1
      step2.classList.add('hidden');  // Esconde o passo 2
    });

    }
})
