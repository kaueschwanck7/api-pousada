/**
 * ============================================================================
 * Pousada Paradiso - Demonstração Front-End
 * JavaScript Puro (Vanilla JS) sem frameworks, bibliotecas ou pacotes externos.
 * 
 * ATENÇÃO:
 * - Esta aplicação opera estritamente em MODO DE DEMONSTRAÇÃO.
 * - Todos os dados são mantidos em memória no navegador (dados fictícios).
 * - NENHUMA requisição de rede (fetch/XMLHttpRequest) é enviada ao backend.
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Dados fictícios locais (espelho da estrutura do modelo 'Quarto' da API)
  let quartosLocais = [
    { id: 1, titulo: "Quarto 101 - Standard Solteiro", disponivel: true },
    { id: 2, titulo: "Quarto 102 - Casal Conforto", disponivel: false },
    { id: 3, titulo: "Quarto 201 - Suíte Luxo com Varanda", disponivel: true },
    { id: 4, titulo: "Quarto 202 - Família Master", disponivel: true }
  ];

  // Elementos do DOM
  const listaContainer = document.getElementById("lista-quartos");
  const statsContainer = document.getElementById("stats-container");
  const formQuarto = document.getElementById("form-quarto");
  const inputTitulo = document.getElementById("titulo-quarto");
  const selectDisponivel = document.getElementById("disponibilidade-quarto");
  const feedbackContainer = document.getElementById("mensagem-feedback");

  /**
   * Renderiza os dados estatísticos resumidos (pílulas de contagem)
   */
  function renderizarEstatisticas() {
    const total = quartosLocais.length;
    const disponiveis = quartosLocais.filter(q => q.disponivel).length;
    const ocupados = total - disponiveis;

    statsContainer.innerHTML = `
      <span class="stat-pill">Total: ${total}</span>
      <span class="stat-pill" style="color: var(--color-success);">Disponíveis: ${disponiveis}</span>
      <span class="stat-pill" style="color: var(--color-occupied);">Ocupados: ${ocupados}</span>
    `;
  }

  /**
   * Renderiza a lista de quartos no DOM
   */
  function renderizarQuartos() {
    renderizarEstatisticas();

    if (quartosLocais.length === 0) {
      listaContainer.innerHTML = `
        <div class="empty-state">
          <p>Nenhum quarto cadastrado na lista local de demonstração.</p>
        </div>
      `;
      return;
    }

    // Limpa a lista antes de reconstruir
    listaContainer.innerHTML = "";

    quartosLocais.forEach((quarto) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "room-item";
      itemDiv.setAttribute("role", "listitem");

      const infoDiv = document.createElement("div");
      infoDiv.className = "room-info";

      const idTag = document.createElement("span");
      idTag.className = "room-id-tag";
      idTag.textContent = `#${quarto.id}`;
      idTag.setAttribute("aria-label", `Quarto identificador ${quarto.id}`);

      const titleSpan = document.createElement("span");
      titleSpan.className = "room-title-text";
      titleSpan.textContent = quarto.titulo;

      infoDiv.appendChild(idTag);
      infoDiv.appendChild(titleSpan);

      const statusWrapper = document.createElement("div");
      statusWrapper.className = "room-status-wrapper";

      // Badge de Disponibilidade
      const badge = document.createElement("span");
      badge.className = quarto.disponivel ? "badge badge-available" : "badge badge-occupied";
      badge.innerHTML = quarto.disponivel 
        ? '<span aria-hidden="true">●</span> Disponível' 
        : '<span aria-hidden="true">■</span> Ocupado';

      // Botão para simular alternância de disponibilidade (interatividade extra local)
      const btnToggle = document.createElement("button");
      btnToggle.type = "button";
      btnToggle.className = "btn-toggle-status";
      btnToggle.textContent = quarto.disponivel ? "Simular Ocupação" : "Liberar Quarto";
      btnToggle.setAttribute("aria-label", `Alterar status do ${quarto.titulo}`);
      btnToggle.addEventListener("click", () => alternarDisponibilidade(quarto.id));

      statusWrapper.appendChild(badge);
      statusWrapper.appendChild(btnToggle);

      itemDiv.appendChild(infoDiv);
      itemDiv.appendChild(statusWrapper);

      listaContainer.appendChild(itemDiv);
    });
  }

  /**
   * Alterna a disponibilidade de um quarto localmente (apenas demonstração visual)
   */
  function alternarDisponibilidade(id) {
    const quarto = quartosLocais.find(q => q.id === id);
    if (quarto) {
      quarto.disponivel = !quarto.disponivel;
      renderizarQuartos();
      exibirFeedback(
        `Status do Quarto #${quarto.id} alterado localmente para "${quarto.disponivel ? 'Disponível' : 'Ocupado'}". (Ação local - Sem API)`,
        "success"
      );
    }
  }

  /**
   * Exibe mensagens de feedback com foco acessível
   */
  function exibirFeedback(mensagem, tipo) {
    feedbackContainer.innerHTML = `
      <div class="alert alert-${tipo}" role="alert">
        <span aria-hidden="true">${tipo === 'success' ? '✅' : '⚠️'}</span>
        <div>${mensagem}</div>
      </div>
    `;
  }

  /**
   * Limpa as mensagens de feedback
   */
  function limparFeedback() {
    feedbackContainer.innerHTML = "";
  }

  /**
   * Tratamento de envio do formulário visual para Ação Futura
   */
  formQuarto.addEventListener("submit", (evento) => {
    evento.preventDefault();
    limparFeedback();

    const tituloValor = inputTitulo.value.trim();
    const disponivelValor = selectDisponivel.value === "true";

    // Validação básica com feedback amigável
    if (!tituloValor) {
      exibirFeedback("Por favor, preencha o título ou identificação do quarto antes de cadastrar.", "error");
      inputTitulo.focus();
      return;
    }

    // Calcula próximo ID fictício sequencial
    const maiorId = quartosLocais.reduce((max, item) => (item.id > max ? item.id : max), 0);
    const novoQuarto = {
      id: maiorId + 1,
      titulo: tituloValor,
      disponivel: disponivelValor
    };

    // Adiciona ao estado local em memória (NÃO faz fetch / NÃO envia para backend)
    quartosLocais.push(novoQuarto);

    // Re-renderiza a lista com o novo elemento
    renderizarQuartos();

    // Mensagem clara indicando sucesso da simulação
    exibirFeedback(
      `Quarto <strong>"${novoQuarto.titulo}"</strong> cadastrado com sucesso na demonstração! (Simulação local - Nenhuma requisição enviada à API)`,
      "success"
    );

    // Limpa os campos do formulário
    formQuarto.reset();
    inputTitulo.focus();
  });

  // Limpa feedback ao clicar em 'Limpar Campos'
  formQuarto.addEventListener("reset", () => {
    limparFeedback();
  });

  // Inicialização da tela
  renderizarQuartos();
});
