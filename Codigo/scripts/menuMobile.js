function acionarMenu() {
  const botao = document.querySelector(".menu-mobile");
  const menu = document.getElementById("MenuDeNavegacao");

  if (!botao || !menu) {
    console.error("Elemento .menu-mobile ou #MenuDeNavegacao não encontrado.");
    return;
  }

  const abrir = !menu.classList.contains("ativo");
  menu.classList.toggle("ativo", abrir);
  botao.setAttribute("aria-expanded", abrir);

  // Adiciona ouvintes de clique aos links do menu para fechar o menu ao serem clicados
  const links = menu.querySelectorAll("a");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("ativo");
      botao.setAttribute("aria-expanded", "false");
    });
  });
}
