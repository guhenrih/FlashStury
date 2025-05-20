// scripts/materias.js

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('materias-container');
  if (!container) {
    console.error('Elemento #materias-container não encontrado no DOM.');
    return;
  }

  // Recupera lista do localStorage e recria itens
  const materiasSalvas = window.getMaterias();
  materiasSalvas.forEach(nome => {
    criarItemMateria(nome);
  });
});

/**
 * Função chamada pelo botão “Adicionar” (botão com id="addMateria").
 * - Lê valor de #NomeMateria
 * - Tenta salvar em localStorage (saveMateria)
 * - Se salvou, chama criarItemMateria; se já existia, alerta.
 */
function addMateria() {
  const input = document.getElementById('NomeMateria');
  const container = document.getElementById('materias-container');
  if (!input || !container) {
    console.error('Elemento #NomeMateria ou #materias-container não encontrado.');
    return;
  }

  const nomeBruto = input.value;
  if (!nomeBruto || nomeBruto.trim() === '') {
    alert('Por favor, digite o nome da matéria.');
    return;
  }

  const nomeTrim = nomeBruto.trim();
  const salvou = window.saveMateria(nomeTrim);

  if (!salvou) {
    alert('Esta matéria já foi adicionada.');
    input.value = '';
    return;
  }

  criarItemMateria(nomeTrim);
  input.value = '';
}

/**
 * Cria no DOM um “item de matéria” contendo:
 *  - <button class="button-materias">nomeMateria</button>
 *  - <button class="delete-materia">×</button>
 *  e anexa ao #materias-container.
 *
 * Ao clicar no botão principal, redireciona para materia.html?materia=nomeCodificado.
 * Ao clicar em “×”, remove do DOM e chama removeMateria(nomeMateria).
 */
function criarItemMateria(nomeMateria) {
  const container = document.getElementById('materias-container');

  // 1. Cria wrapper <div class="materia-item">
  const itemDiv = document.createElement('div');
  itemDiv.classList.add('materia-item');
  // Estilo mínimo inline para exibir botão e “×” lado a lado:
  itemDiv.style.display = 'inline-flex';
  itemDiv.style.alignItems = 'center';
  itemDiv.style.margin = '0.5rem';

  // 2. Botão principal da matéria
  const btnMateria = document.createElement('button');
  btnMateria.classList.add('button-materias');
  btnMateria.textContent = nomeMateria;
  btnMateria.style.marginRight = '0.5rem';

  btnMateria.addEventListener('click', () => {
    const query = encodeURIComponent(nomeMateria);
    window.location.href = `materia.html?materia=${query}`;
  });

  // 3. Botão de deletar “×”
  const btnDelete = document.createElement('button');
  btnDelete.classList.add('delete-materia');
  btnDelete.innerHTML = '×';
  btnDelete.title = 'Apagar matéria';
  // Estilo mínimo inline para distinção:
  btnDelete.style.background = 'transparent';
  btnDelete.style.border = 'none';
  btnDelete.style.fontSize = '1.2rem';
  btnDelete.style.cursor = 'pointer';
  btnDelete.style.color = '#C53030';

  btnDelete.addEventListener('click', () => {
    const removido = window.removeMateria(nomeMateria);
    if (removido) {
      container.removeChild(itemDiv);
    }
  });

  // 4. Anexa botões ao wrapper e insere no container
  itemDiv.appendChild(btnMateria);
  itemDiv.appendChild(btnDelete);
  container.appendChild(itemDiv);
}
