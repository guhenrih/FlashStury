function acionarMenu() {
        // Seleciona o botão e o menu
            const botao = document.querySelector('.menu-mobile');
            const menu  = document.getElementById('menuDeNavegacao');
  
        // Se não encontrar algum dos elementos, aborta e loga erro
        if (!botao || !menu) {
            console.error('Elemento .menu-mobile ou #menuDeNavegacao não encontrado.');
            return;
        }

        // Decide se o menu deve abrir ou fechar
        const abrir = !menu.classList.contains('ativo');

        // Alterna a classe e o atributo aria-expanded
        menu.classList.toggle('ativo', abrir);
        botao.setAttribute('aria-expanded', abrir);
        }

