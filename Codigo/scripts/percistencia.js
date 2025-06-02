// persistence.js
(function () {
  const STORAGE_KEY_MATERIAS = "minhasMaterias";

  function carregarMateriasDoStorage() {
    const json = localStorage.getItem(STORAGE_KEY_MATERIAS);
    if (!json) return [];
    try {
      return JSON.parse(json);
    } catch {
      return [];
    }
  }

  function salvarMateriasNoStorage(vetorMaterias) {
    localStorage.setItem(STORAGE_KEY_MATERIAS, JSON.stringify(vetorMaterias));
  }

  function montarChaveFlashcards(materia) {
    return `flashcards_${materia}`;
  }

  function carregarFlashcardsDoStorage(materia) {
    const chave = montarChaveFlashcards(materia);
    const json = localStorage.getItem(chave);
    if (!json) return [];
    try {
      return JSON.parse(json);
    } catch {
      return [];
    }
  }

  function salvarFlashcardsNoStorage(materia, vetorFlashcards) {
    const chave = montarChaveFlashcards(materia);
    localStorage.setItem(chave, JSON.stringify(vetorFlashcards));
  }

  // Inicia index.html
  function initIndexPage() {
    const inputNome = document.getElementById("NomeMateria");
    const btnAdd = document.getElementById("addMateria");
    const containerMaterias = document.getElementById("materias-container");

    let materias = carregarMateriasDoStorage();
    materias.forEach(nome => {
      criarBotaoMateria(nome, containerMaterias, materias);
    });

    btnAdd.addEventListener("click", event => {
      event.preventDefault();
      const nome = inputNome.value.trim();
      if (!nome) {
        alert("Por favor, digite um nome para a matéria.");
        return;
      }
      if (materias.includes(nome)) {
        alert(`A matéria "${nome}" já foi adicionada.`);
        return;
      }
      materias.push(nome);
      salvarMateriasNoStorage(materias);
      criarBotaoMateria(nome, containerMaterias, materias);
      inputNome.value = "";
    });
  }

  function criarBotaoMateria(nome, containerMaterias, arrayMaterias) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("materia-item");

    const btnMat = document.createElement("button");
    btnMat.classList.add("materia-atalho");
    btnMat.textContent = nome;
    btnMat.onclick = () => {
      sessionStorage.setItem("materiaSelecionada", nome);
      window.location.href = "materia.html";
    };

    const btnExcluir = document.createElement("button");
    btnExcluir.classList.add("excluir-materia");
    btnExcluir.textContent = "✖";
    btnExcluir.onclick = () => {
      if (confirm(`Deseja excluir a matéria "${nome}"?`)) {
        wrapper.remove();
        const idx = arrayMaterias.indexOf(nome);
        if (idx > -1) {
          arrayMaterias.splice(idx, 1);
          salvarMateriasNoStorage(arrayMaterias);
          localStorage.removeItem(montarChaveFlashcards(nome));
        }
      }
    };

    wrapper.appendChild(btnMat);
    wrapper.appendChild(btnExcluir);
    containerMaterias.appendChild(wrapper);
  }

  // Inicia materia.html
  function initMateriaPage() {
    const nomeMateria = sessionStorage.getItem("materiaSelecionada");
    const tituloElem = document.getElementById("tituloMateria");
    const areaPerg = document.getElementById("perguntaExibida");
    const areaResp = document.getElementById("respostaExibida");
    const btnPrev = document.getElementById("prevFlash");
    const btnNext = document.getElementById("nextFlash");
    const btnExcluirAtual = document.getElementById("excluir-flashcards");
    const inputPerg = document.getElementById("input-pergunta");
    const inputResp = document.getElementById("input-resposta");
    const btnAddFlash = document.getElementById("addFlashcards");
    const containerCard = document.getElementById("flashcard-container");

    if (tituloElem) {
      tituloElem.textContent = nomeMateria || "Matéria";
    }

    let flashcards = nomeMateria ? carregarFlashcardsDoStorage(nomeMateria) : [];
    let indiceAtual = 0;

    function atualizarVisualizacao() {
      if (!flashcards.length) {
        areaPerg.textContent = "Ainda não há flashcards.";
        areaResp.textContent = "";
        btnPrev.style.visibility = "hidden";
        btnNext.style.visibility = "hidden";
        btnExcluirAtual.disabled = true;
      } else {
        btnPrev.style.visibility = "visible";
        btnNext.style.visibility = "visible";
        btnExcluirAtual.disabled = false;
        const atual = flashcards[indiceAtual];
        areaPerg.textContent = atual.pergunta;
        areaResp.textContent = atual.resposta;
      }
    }

    containerCard.addEventListener("click", () => {
      if (!flashcards.length) return;
      containerCard.classList.toggle("is-flipped");
    });

    btnExcluirAtual.addEventListener("click", () => {
      if (!flashcards.length) {
        alert("Não há flashcards para excluir.");
        return;
      }
      if (
        confirm(
          `Deseja realmente excluir o flashcard:\n\n"${flashcards[indiceAtual].pergunta}"?`
        )
      ) {
        flashcards.splice(indiceAtual, 1);
        if (indiceAtual >= flashcards.length) {
          indiceAtual = flashcards.length - 1;
        }
        salvarFlashcardsNoStorage(nomeMateria, flashcards);
        containerCard.classList.remove("is-flipped");
        atualizarVisualizacao();
      }
    });

    btnNext.addEventListener("click", () => {
      if (flashcards.length <= 1) return;
      indiceAtual = (indiceAtual + 1) % flashcards.length;
      containerCard.classList.remove("is-flipped");
      atualizarVisualizacao();
    });

    btnPrev.addEventListener("click", () => {
      if (flashcards.length <= 1) return;
      indiceAtual = (indiceAtual - 1 + flashcards.length) % flashcards.length;
      containerCard.classList.remove("is-flipped");
      atualizarVisualizacao();
    });

    btnAddFlash.addEventListener("click", event => {
      event.preventDefault();
      const pergunta = inputPerg.value.trim();
      const resposta = inputResp.value.trim();
      if (!pergunta || !resposta) {
        alert("Por favor, preencha pergunta e resposta.");
        return;
      }
      flashcards.push({ pergunta, resposta });
      indiceAtual = flashcards.length - 1;
      salvarFlashcardsNoStorage(nomeMateria, flashcards);
      inputPerg.value = "";
      inputResp.value = "";
      containerCard.classList.remove("is-flipped");
      atualizarVisualizacao();
    });

    atualizarVisualizacao();
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("NomeMateria")) {
      initIndexPage();
    }
    if (document.getElementById("tituloMateria")) {
      initMateriaPage();
    }
  });
})();
