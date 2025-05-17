// scripts/script.js

function acionarMenu() {
  const menu = document.getElementById('MenuDeNavegacao');
  if (menu.classList.contains('ativo')) {
    menu.classList.remove('ativo');
  } else {
    menu.classList.add('ativo');
  }
}
