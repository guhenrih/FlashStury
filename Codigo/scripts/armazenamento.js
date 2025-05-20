// scripts/armazenamento.js

/**
 * Retorna um array com todas as matérias salvas no localStorage.
 * Se não houver nada, retorna array vazio.
 */
window.getMaterias = function() {
  const raw = localStorage.getItem('minhasMaterias');
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Adiciona uma nova matéria (string) ao array em localStorage.
 * Se já existir, não insere duplicata.
 * Retorna true se salvou, false se já existia.
 */
window.saveMateria = function(nome) {
  const lista = window.getMaterias();
  if (lista.includes(nome)) return false;
  lista.push(nome);
  localStorage.setItem('minhasMaterias', JSON.stringify(lista));
  return true;
};

/**
 * Remove a matéria (string) do array em localStorage.
 * Retorna true se removeu, false se não existia.
 */
window.removeMateria = function(nome) {
  const lista = window.getMaterias();
  const novaLista = lista.filter(m => m !== nome);
  if (novaLista.length === lista.length) return false; // não encontrou
  localStorage.setItem('minhasMaterias', JSON.stringify(novaLista));
  return true;
};
