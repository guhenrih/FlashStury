(function () {
  // =============================
  //  VARIÁVEIS E CONSTANTES
  // =============================
  const STORAGE_KEY_MATERIAS = "minhasMaterias"; // chave para array de nomes de matérias
  // Para flashcards, vamos usar a chave "flashcards_<nomeDaMateria>"

  // =============================
  //  FUNÇÕES AUXILIARES
  // =============================

  /**
   * Busca, no localStorage, a lista de matérias (array de strings).
   * Se não existir, retorna [].
   */
  function carregarMateriasDoStorage() {
    const json = localStorage.getItem(STORAGE_KEY_MATERIAS);
    if (!json) return [];
    try {
      return JSON.parse(json);
    } catch {
      return [];
    }
  }

  /**
   * Salva, no localStorage, a lista (array) de matérias.
   * @param {string[]} vetorMaterias 
   */
  function salvarMateriasNoStorage(vetorMaterias) {
    localStorage.setItem(STORAGE_KEY_MATERIAS, JSON.stringify(vetorMaterias));
  }

  /**
   * Retorna a chave usada para armazenar flashcards de uma matéria específica.
   * Exemplo: se materia="Matemática", retorna "flashcards_Matemática"
   */
  function montarChaveFlashcards(materia) {
    return `flashcards_${materia}`;
  }

  /**
   * Carrega do localStorage o array de flashcards para a matéria dada.
   * Cada flashcard é um objeto { pergunta: string, resposta: string }.
   * @param {string} materia 
   * @returns {Array<{pergunta:string,resposta:string}>}
   */
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

  /**
   * Salva, no localStorage, o array de flashcards para a matéria dada.
   * @param {string} materia 
   * @param {Array<{pergunta:string,resposta:string}>} vetorFlashcards 
   */
  function salvarFlashcardsNoStorage(materia, vetorFlashcards) {
    const chave = montarChaveFlashcards(materia);
    localStorage.setItem(chave, JSON.stringify(vetorFlashcards));
  }

  // =============================
  //  CÓDIGO PARA index.html
  // =============================

  function initIndexPage() {
    const inputNome = document.getElementById("NomeMateria");
    const btnAdd = document.getElementById("addMateria");
    const containerMaterias = document.getElementById("materias-container");

    // Carregar todas as matérias existentes
    let materias = carregarMateriasDoStorage();
    materias.forEach(nome => {
      criarBotaoMateria(nome, containerMaterias, materias);
    });

    // Se clicar em "Adicionar", inserir nova matéria
    btnAdd.addEventListener("click", event => {
      event.preventDefault();
      const nome = inputNome.value.trim();
      if (!nome) {
        alert("Por favor, digite um nome para a matéria.");
        return;
      }
      // Verifica se já existe
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

  /**
   * Cria dinamicamente o botão + ícone de excluir em index.html.
   * Cada vez que uma nova matéria for adicionada, chamamos esta função.
   * 
   * @param {string} nome 
   * @param {HTMLElement} containerMaterias 
   * @param {string[]} arrayMaterias  // passado por referência para atualizar
   */
  function criarBotaoMateria(nome, containerMaterias, arrayMaterias) {
    // Cria o div principal
    const wrapper = document.createElement("div");
    wrapper.classList.add("materia-item");

    // Botão que leva para materia.html e grava no sessionStorage
    const btnMat = document.createElement("button");
    btnMat.classList.add("materia-atalho");
    btnMat.textContent = nome;
    btnMat.onclick = () => {
      sessionStorage.setItem("materiaSelecionada", nome);
      window.location.href = "materia.html";
    };

    // Botão de excluir a matéria
    const btnExcluir = document.createElement("button");
    btnExcluir.classList.add("excluir-materia");
    btnExcluir.textContent = "✖";
    btnExcluir.onclick = () => {
      if (confirm(`Deseja excluir a matéria "${nome}"?`)) {
        // Remove do DOM
        wrapper.remove();
        // Remove do array e atualiza storage
        const idx = arrayMaterias.indexOf(nome);
        if (idx > -1) {
          arrayMaterias.splice(idx, 1);
          salvarMateriasNoStorage(arrayMaterias);
          // Também remover os flashcards dela, se existirem
          localStorage.removeItem(montarChaveFlashcards(nome));
        }
      }
    };

    wrapper.appendChild(btnMat);
    wrapper.appendChild(btnExcluir);
    containerMaterias.appendChild(wrapper);
  }

  // =============================
  //  CÓDIGO PARA materia.html
  // =============================

  function initMateriaPage() {
    // Recupera nome da matéria selecionada
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

    // Caso não exista (acesso direto), exibe "Matéria" genérico
    if (nomeMateria) {
      tituloElem.textContent = nomeMateria;
    } else {
      tituloElem.textContent = "Matéria";
    }

    // Carrega flashcards do localStorage
    let flashcards = nomeMateria ? carregarFlashcardsDoStorage(nomeMateria) : [];
    let indiceAtual = 0;

    // Função que exibe/oculta elementos conforme array
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

    // Quando clica no card, faz flip (se tiver flashcards)
    containerCard.addEventListener("click", () => {
      if (!flashcards.length) return;
      containerCard.classList.toggle("is-flipped");
    });

    // Botão "Excluir Flashcard Atual"
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
        // Ajusta índice se for necessário
        if (indiceAtual >= flashcards.length) {
          indiceAtual = flashcards.length - 1;
        }
        // Salva alteração
        salvarFlashcardsNoStorage(nomeMateria, flashcards);
        // Garante que o card volte para a frente
        containerCard.classList.remove("is-flipped");
        atualizarVisualizacao();
      }
    });

    // Botão "Próximo"
    btnNext.addEventListener("click", () => {
      if (flashcards.length <= 1) return;
      indiceAtual = (indiceAtual + 1) % flashcards.length;
      containerCard.classList.remove("is-flipped");
      atualizarVisualizacao();
    });

    // Botão "Anterior"
    btnPrev.addEventListener("click", () => {
      if (flashcards.length <= 1) return;
      indiceAtual = (indiceAtual - 1 + flashcards.length) % flashcards.length;
      containerCard.classList.remove("is-flipped");
      atualizarVisualizacao();
    });

    // Botão "Adicionar Flashcard"
    btnAddFlash.addEventListener("click", event => {
      event.preventDefault();
      const pergunta = inputPerg.value.trim();
      const resposta = inputResp.value.trim();
      if (!pergunta || !resposta) {
        alert("Por favor, preencha pergunta e resposta.");
        return;
      }
      // Insere e salva
      flashcards.push({ pergunta, resposta });
      indiceAtual = flashcards.length - 1;
      salvarFlashcardsNoStorage(nomeMateria, flashcards);
      // Limpa campos e força a face para frente
      inputPerg.value = "";
      inputResp.value = "";
      containerCard.classList.remove("is-flipped");
      atualizarVisualizacao();
    });

    // Inicializa a visualização na carga da página
    atualizarVisualizacao();
  }

  // =============================
  //  PONTA DE ENTRADA
  // =============================

  document.addEventListener("DOMContentLoaded", () => {
    // Detecta se estamos em index.html (presença do elemento #NomeMateria)
    if (document.getElementById("NomeMateria")) {
      initIndexPage();
    }
    // Detecta se estamos em materia.html (presença do elemento #tituloMateria)
    if (document.getElementById("tituloMateria")) {
      initMateriaPage();
    }
  });
})();
