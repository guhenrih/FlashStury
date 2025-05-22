// scripts/materias.js

// 1. Função chamada pelo botão “Adicionar”
function addMateria() {
  const input = document.getElementById('NomeMateria');
  const nome = input.value.trim();

  if (!nome) {
    alert('Digite o nome da matéria antes de adicionar.');
    return;
  }

  criarItemMateria(nome);
  input.value = '';
  input.focus();
}

// 2. Cria o botão da matéria + botão de excluir, com confirmação de remoção
function criarItemMateria(nomeMateria) {
  const container = document.getElementById('materias-container');
  if (!container) {
    console.error('Container #materias-container não encontrado');
    return;
  }

  // Wrapper único
  const itemDiv = document.createElement('div');
  itemDiv.classList.add('materia-item');

  // Botão “Matéria”
  const btnMateria = document.createElement('button');
  btnMateria.type = 'button';
  btnMateria.classList.add('materia-atalho');
  btnMateria.textContent = nomeMateria;
  btnMateria.addEventListener('click', () => {
    window.location.href = `materia.html?materia=${encodeURIComponent(nomeMateria)}`;
  });

  // Botão “Excluir” com confirmação
  const btnDelete = document.createElement('button');
  btnDelete.type = 'button';
  btnDelete.classList.add('excluir-materia');
  btnDelete.innerHTML = '🗑️';
  btnDelete.title = 'Apagar matéria';
  btnDelete.addEventListener('click', () => {
    const confirmacao = confirm(`Realmente deseja apagar "${nomeMateria}"?`);
    if (confirmacao) {
      container.removeChild(itemDiv);
    }
  });

  // Junta tudo e insere no container
  itemDiv.append(btnMateria, btnDelete);
  container.appendChild(itemDiv);
}

// 3. Exponha as funções no escopo global para o onclick= calls
window.addMateria = addMateria;
window.criarItemMateria = criarItemMateria;
