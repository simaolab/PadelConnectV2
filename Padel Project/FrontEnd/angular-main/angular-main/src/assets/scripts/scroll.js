    // Função para verificar se o elemento está visível na viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Função para adicionar a classe "visible" aos elementos animados
    function handleScroll() {
        const elements = document.querySelectorAll('.animated');
        elements.forEach(element => {
            if (isElementInViewport(element)) {
                element.classList.add('visible');
            }
        });
    }

    // Adiciona o evento de scroll
    window.addEventListener('scroll', handleScroll);

    // Verifica a posição dos elementos na primeira execução
    handleScroll();


    function handleNavbarScroll() {
        const navbar = document.querySelector('.navbar'); // Seleciona a navbar
        const scrollPosition = window.scrollY || window.pageYOffset; // Posição do scroll

        if (scrollPosition > 100) {
            navbar.classList.add('scrolled'); // Adiciona a classe se rolar mais de 100px
        } else {
            navbar.classList.remove('scrolled'); // Remove a classe se rolar menos de 100px
        }
    }

    // Adiciona o evento de scroll
    window.addEventListener('scroll', handleNavbarScroll);