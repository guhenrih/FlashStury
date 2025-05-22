  const btn = document.getElementById('addFlashcards');
  const sectionMain = document.querySelector('.sectionMain');
  const addFlashcads = document.getElementById('addFlashcads');

  btn.addEventListener('click', () => {
    sectionMain.style.display = 'none';
    addFlashcads.style.display = 'flex';
  });