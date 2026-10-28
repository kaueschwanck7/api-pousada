/**
 * ============================================================================
 * POUSADA - GESTÃO DE RESERVAS (AP2)
 * JavaScript Puro (Vanilla JS) & Fetch API
 * Integração direta e exclusiva com a API REST real do ASP.NET Core
 * ============================================================================
 */

// Define o endpoint base da API (compatível com execução direta ou via Live Server)
const API_BASE_URL = (
  window.location.origin.includes(":5050") || window.location.origin.includes(":5153")
) ? "/api/reservas" : "http://localhost:5050/api/reservas";

// Estado da Aplicação
let todasAsReservas = [];
let reservaEmEdicaoId = null;
let reservaPendenteExclusao = null;

// Elementos do DOM
const loadingOverlay = document.getElementById("loading-overlay");
const loadingMessage = document.getElementById("loading-message");
const toastContainer = document.getElementById("toast-container");
const apiStatusBadge = document.getElementById("api-status-badge");
const statusDot = document.getElementById("status-dot");
const statusText = document.getElementById("status-text");

// Métricas
const statTotal = document.getElementById("stat-total");
const statConfirmadas = document.getElementById("stat-confirmadas");
const statPendentes = document.getElementById("stat-pendentes");
const statOutros = document.getElementById("stat-outros");

// Formulário de Reserva
const formReserva = document.getElementById("form-reserva");
const formTitle = document.getElementById("form-title");
const badgeModoEdicao = document.getElementById("badge-modo-edicao");
const groupId = document.getElementById("group-id");
const campoId = document.getElementById("campo-id");
const campoNome = document.getElementById("campo-nome");
const campoQuarto = document.getElementById("campo-quarto");
const campoHospedes = document.getElementById("campo-hospedes");
const campoCheckin = document.getElementById("campo-checkin");
const campoCheckout = document.getElementById("campo-checkout");
const campoStatus = document.getElementById("campo-status");
const btnSubmit = document.getElementById("btn-submit");
const btnSubmitText = document.getElementById("btn-submit-text");
const btnCancelarEdicao = document.getElementById("btn-cancelar-edicao");
const btnLimpar = document.getElementById("btn-limpar");

// Tabela e Busca
const tbodyReservas = document.getElementById("tbody-reservas");
const emptyState = document.getElementById("empty-state");
const emptyTitle = document.getElementById("empty-title");
const emptyDescription = document.getElementById("empty-description");
const formBuscaId = document.getElementById("form-busca-id");
const inputBuscaId = document.getElementById("input-busca-id");
const btnLimparBusca = document.getElementById("btn-limpar-busca");
const bannerFiltro = document.getElementById("banner-filtro");
const filtroIdValor = document.getElementById("filtro-id-valor");
const btnRemoverFiltro = document.getElementById("btn-remover-filtro");

// Modal de Exclusão
const modalExclusao = document.getElementById("modal-exclusao");
const modalReservaDetalhes = document.getElementById("modal-reserva-detalhes");
const btnCancelarExclusao = document.getElementById("btn-cancelar-exclusao");
const btnConfirmarExclusao = document.getElementById("btn-confirmar-exclusao");

// ============================================================================
// UTILITÁRIOS VISUAIS: LOADING E TOASTS
// ============================================================================

/**
 * Exibe o indicador de carregamento
 */
function mostrarLoading(mensagem = "Processando requisição...") {
  loadingMessage.textContent = mensagem;
  loadingOverlay.classList.remove("hidden");
  loadingOverlay.setAttribute("aria-hidden", "false");
}

/**
 * Oculta o indicador de carregamento
 */
function ocultarLoading() {
  loadingOverlay.classList.add("hidden");
  loadingOverlay.setAttribute("aria-hidden", "true");
}

/**
 * Atualiza o indicador visual da conexão com a API
 */
function atualizarStatusConexao(online, detalhe = "") {
  if (online) {
    statusDot.className = "status-dot dot-online";
    statusText.textContent = "Conectado à API";
    apiStatusBadge.title = "Comunicação com a API REST ativa e funcionando";
  } else {
    statusDot.className = "status-dot dot-offline";
    statusText.textContent = "API Desconectada";
    apiStatusBadge.title = detalhe || "Não foi possível conectar ao backend (http://localhost:5050)";
  }
}

/**
 * Exibe notificação flutuante (Toast)
 */
function mostrarToast(mensagem, tipo = "info", titulo = "") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${tipo}`;
  toast.setAttribute("role", "alert");

  let icone = "ℹ️";
  let defaultTitulo = "Informação";

  if (tipo === "success") {
    icone = "✅";
    defaultTitulo = "Sucesso";
  } else if (tipo === "error") {
    icone = "⚠️";
    defaultTitulo = "Erro";
  }

  toast.innerHTML = `
    <span class="toast-icon" aria-hidden="true">${icone}</span>
    <div class="toast-content">
      <div class="toast-title">${titulo || defaultTitulo}</div>
      <div class="toast-message">${mensagem}</div>
    </div>
    <button type="button" class="toast-close" aria-label="Fechar notificação">&times;</button>
  `;

  // Botão fechar
  toast.querySelector(".toast-close").addEventListener("click", () => {
    toast.remove();
  });

  toastContainer.appendChild(toast);

  // Auto-remoção após 4.5 segundos
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }
  }, 4500);
}

/**
 * Formata datas de YYYY-MM-DD para DD/MM/AAAA
 */
function formatarDataBR(dataStr) {
  if (!dataStr) return "-";
  const partes = dataStr.split("-");
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  return dataStr;
}

// ============================================================================
// VALIDAÇÕES DO FORMULÁRIO
// ============================================================================

function limparErrosFormulario() {
  document.querySelectorAll(".field-error").forEach(el => el.textContent = "");
  document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
}

function exibirErroCampo(idCampo, idErro, mensagem) {
  const campo = document.getElementById(idCampo);
  const erro = document.getElementById(idErro);
  if (campo) campo.classList.add("input-error");
  if (erro) erro.textContent = mensagem;
}

function validarDadosReserva(dados) {
  limparErrosFormulario();
  let valido = true;

  // Nome do hóspede
  if (!dados.nomeHospede || dados.nomeHospede.trim().length < 3) {
    exibirErroCampo("campo-nome", "erro-nome", "Informe o nome completo do hóspede (mínimo 3 caracteres).");
    valido = false;
  }

  // Número do quarto
  if (!dados.numeroQuarto || dados.numeroQuarto <= 0) {
    exibirErroCampo("campo-quarto", "erro-quarto", "Informe um número de quarto válido.");
    valido = false;
  }

  // Quantidade de hóspedes
  if (!dados.quantidadeHospedes || dados.quantidadeHospedes < 1) {
    exibirErroCampo("campo-hospedes", "erro-hospedes", "A quantidade mínima é 1 hóspede.");
    valido = false;
  }

  // Data de Check-in
  if (!dados.dataCheckin) {
    exibirErroCampo("campo-checkin", "erro-checkin", "Data de check-in é obrigatória.");
    valido = false;
  }

  // Data de Check-out
  if (!dados.dataCheckout) {
    exibirErroCampo("campo-checkout", "erro-checkout", "Data de check-out é obrigatória.");
    valido = false;
  }

  // Validação cronológica: Check-out posterior a Check-in
  if (dados.dataCheckin && dados.dataCheckout) {
    const checkin = new Date(dados.dataCheckin);
    const checkout = new Date(dados.dataCheckout);

    if (checkout <= checkin) {
      exibirErroCampo("campo-checkout", "erro-checkout", "A data de check-out deve ser posterior à data de check-in.");
      valido = false;
    }
  }

  return valido;
}

// ============================================================================
// COMUNICAÇÃO COM A API REST REAL (FETCH API)
// ============================================================================

/**
 * GET /api/reservas - Lista todas as reservas
 */
async function carregarReservas() {
  mostrarLoading("Carregando reservas da API...");
  try {
    const resposta = await fetch(API_BASE_URL, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });

    if (!resposta.ok) {
      throw new Error(`Erro ${resposta.status}: ${resposta.statusText}`);
    }

    todasAsReservas = await resposta.json();
    atualizarStatusConexao(true);
    renderizarPainel(todasAsReservas);
  } catch (erro) {
    console.error("Falha ao buscar reservas na API:", erro);
    atualizarStatusConexao(false, erro.message);
    mostrarToast(
      "Não foi possível obter os dados da API. Verifique se o backend está em execução no terminal (`dotnet run`).",
      "error",
      "Erro de Conexão"
    );
    renderizarPainel([]);
  } finally {
    ocultarLoading();
  }
}

/**
 * GET /api/reservas/{id} - Consulta uma reserva pelo ID
 */
async function buscarReservaPorId(id) {
  mostrarLoading(`Consultando reserva #${id} na API...`);
  try {
    const resposta = await fetch(`${API_BASE_URL}/${id}`, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });

    if (resposta.status === 404) {
      mostrarToast(`A reserva com ID #${id} não foi encontrada no sistema.`, "error", "Reserva Inexistente");
      renderizarTabela([]);
      emptyTitle.textContent = `Reserva #${id} não encontrada`;
      emptyDescription.textContent = "Verifique o número informado ou limpe a busca para exibir todos os registros.";
      emptyState.classList.remove("hidden");
      return;
    }

    if (!resposta.ok) {
      throw new Error(`Erro ${resposta.status}: ${resposta.statusText}`);
    }

    const reserva = await resposta.json();
    atualizarStatusConexao(true);
    
    // Ativa exibição filtrada
    filtroIdValor.textContent = reserva.id;
    bannerFiltro.classList.remove("hidden");
    btnLimparBusca.classList.remove("hidden");

    renderizarTabela([reserva]);
    mostrarToast(`Reserva #${reserva.id} (${reserva.nomeHospede}) localizada com sucesso!`, "success");
  } catch (erro) {
    console.error("Falha ao consultar reserva por ID:", erro);
    atualizarStatusConexao(false, erro.message);
    mostrarToast(`Erro ao consultar reserva #${id}: ${erro.message}`, "error");
  } finally {
    ocultarLoading();
  }
}

/**
 * POST /api/reservas - Cadastra uma nova reserva
 */
async function cadastrarReserva(dados) {
  mostrarLoading("Cadastrando nova reserva na API...");
  try {
    const resposta = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(dados)
    });

    if (!resposta.ok) {
      const erroJson = await resposta.json().catch(() => null);
      const msg = erroJson?.mensagem || `Erro ${resposta.status} ao cadastrar.`;
      throw new Error(msg);
    }

    const novaReserva = await resposta.json();
    atualizarStatusConexao(true);
    mostrarToast(
      `Reserva para <strong>${novaReserva.nomeHospede}</strong> criada com sucesso! (ID #${novaReserva.id})`,
      "success"
    );

    resetarFormulario();
    await carregarReservas();
  } catch (erro) {
    console.error("Falha no POST /api/reservas:", erro);
    mostrarToast(erro.message, "error", "Falha no Cadastro");
  } finally {
    ocultarLoading();
  }
}

/**
 * PUT /api/reservas/{id} - Atualiza uma reserva existente
 */
async function atualizarReserva(id, dados) {
  mostrarLoading(`Atualizando reserva #${id} na API...`);
  try {
    const resposta = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(dados)
    });

    if (!resposta.ok) {
      const erroJson = await resposta.json().catch(() => null);
      const msg = erroJson?.mensagem || `Erro ${resposta.status} ao atualizar.`;
      throw new Error(msg);
    }

    const reservaAtualizada = await resposta.json();
    atualizarStatusConexao(true);
    mostrarToast(
      `Reserva #${reservaAtualizada.id} (${reservaAtualizada.nomeHospede}) atualizada com sucesso!`,
      "success"
    );

    cancelarEdicao();
    await carregarReservas();
  } catch (erro) {
    console.error(`Falha no PUT /api/reservas/${id}:`, erro);
    mostrarToast(erro.message, "error", "Falha na Atualização");
  } finally {
    ocultarLoading();
  }
}

/**
 * DELETE /api/reservas/{id} - Remove uma reserva
 */
async function excluirReserva(id) {
  mostrarLoading(`Removendo reserva #${id} na API...`);
  try {
    const resposta = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE"
    });

    if (!resposta.ok && resposta.status !== 204) {
      throw new Error(`Erro ${resposta.status} ao excluir reserva.`);
    }

    atualizarStatusConexao(true);
    mostrarToast(`Reserva #${id} excluída com sucesso!`, "success");
    fecharModalExclusao();

    // Se a reserva excluída estava em edição no form, limpa o form
    if (reservaEmEdicaoId === id) {
      cancelarEdicao();
    }

    await carregarReservas();
  } catch (erro) {
    console.error(`Falha no DELETE /api/reservas/${id}:`, erro);
    mostrarToast(erro.message, "error", "Falha na Exclusão");
  } finally {
    ocultarLoading();
  }
}

// ============================================================================
// RENDERIZAÇÃO VISUAL E CONTADORES
// ============================================================================

/**
 * Atualiza os números nos cards métricos de resumo
 */
function atualizarMetricas(reservas) {
  const total = reservas.length;
  const confirmadas = reservas.filter(r => r.status === "Confirmada").length;
  const pendentes = reservas.filter(r => r.status === "Pendente").length;
  const concluidasCanceladas = reservas.filter(r => r.status === "Concluída" || r.status === "Cancelada").length;

  statTotal.textContent = total;
  statConfirmadas.textContent = confirmadas;
  statPendentes.textContent = pendentes;
  statOutros.textContent = concluidasCanceladas;
}

/**
 * Renderiza o painel completo (estatísticas e tabela)
 */
function renderizarPainel(reservas) {
  atualizarMetricas(reservas);
  renderizarTabela(reservas);
}

/**
 * Renderiza as linhas da tabela de reservas
 */
function renderizarTabela(reservas) {
  tbodyReservas.innerHTML = "";

  if (!reservas || reservas.length === 0) {
    emptyTitle.textContent = "Nenhuma reserva encontrada";
    emptyDescription.textContent = "Não há registros retornados pela API no momento.";
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  reservas.forEach(reserva => {
    const tr = document.createElement("tr");

    // Classe para badge de status
    const statusClassMap = {
      "Confirmada": "status-confirmada",
      "Pendente": "status-pendente",
      "Concluída": "status-concluida",
      "Cancelada": "status-cancelada"
    };
    const badgeClass = statusClassMap[reserva.status] || "status-pendente";

    tr.innerHTML = `
      <td class="td-id">#${reserva.id}</td>
      <td class="td-hospede">${reserva.nomeHospede}</td>
      <td><strong>Q.${reserva.numeroQuarto}</strong></td>
      <td>${reserva.quantidadeHospedes} pessoa(s)</td>
      <td class="td-datas">${formatarDataBR(reserva.dataCheckin)}</td>
      <td class="td-datas">${formatarDataBR(reserva.dataCheckout)}</td>
      <td>
        <span class="status-badge ${badgeClass}">
          ● ${reserva.status}
        </span>
      </td>
      <td>
        <div class="action-buttons">
          <button type="button" class="btn-action btn-action-edit" data-id="${reserva.id}" title="Editar reserva">
            ✏️ Editar
          </button>
          <button type="button" class="btn-action btn-action-delete" data-id="${reserva.id}" title="Excluir reserva">
            🗑️ Excluir
          </button>
        </div>
      </td>
    `;

    // Eventos dos botões de ação
    tr.querySelector(".btn-action-edit").addEventListener("click", () => iniciarEdicao(reserva));
    tr.querySelector(".btn-action-delete").addEventListener("click", () => abrirModalExclusao(reserva));

    tbodyReservas.appendChild(tr);
  });
}

// ============================================================================
// CONTROLE DO MODO DE EDIÇÃO
// ============================================================================

/**
 * Prepara o formulário para editar uma reserva existente
 */
function iniciarEdicao(reserva) {
  reservaEmEdicaoId = reserva.id;

  // Atualiza cabeçalho e badges
  formTitle.textContent = `Editar Reserva #${reserva.id}`;
  badgeModoEdicao.classList.remove("hidden");
  groupId.style.display = "flex";
  campoId.value = `#${reserva.id}`;

  // Popula campos com os dados da reserva
  campoNome.value = reserva.nomeHospede;
  campoQuarto.value = reserva.numeroQuarto;
  campoHospedes.value = reserva.quantidadeHospedes;
  campoCheckin.value = reserva.dataCheckin;
  campoCheckout.value = reserva.dataCheckout;
  campoStatus.value = reserva.status;

  // Botões de ação
  btnSubmitText.textContent = "Salvar Alterações";
  btnCancelarEdicao.classList.remove("hidden");

  limparErrosFormulario();

  // Scroll suave até o formulário
  document.querySelector(".form-section").scrollIntoView({ behavior: "smooth", block: "start" });
  campoNome.focus();
}

/**
 * Cancela a edição e retorna o formulário ao modo de cadastro
 */
function cancelarEdicao() {
  reservaEmEdicaoId = null;

  formTitle.textContent = "Nova Reserva";
  badgeModoEdicao.classList.add("hidden");
  groupId.style.display = "none";
  campoId.value = "";

  btnSubmitText.textContent = "Cadastrar Reserva";
  btnCancelarEdicao.classList.add("hidden");

  resetarFormulario();
}

function resetarFormulario() {
  formReserva.reset();
  limparErrosFormulario();
  campoStatus.value = "Confirmada";
}

// ============================================================================
// CONTROLE DO MODAL DE EXCLUSÃO
// ============================================================================

function abrirModalExclusao(reserva) {
  reservaPendenteExclusao = reserva;
  modalReservaDetalhes.innerHTML = `
    <div><strong>Hóspede:</strong> ${reserva.nomeHospede}</div>
    <div><strong>Quarto:</strong> nº ${reserva.numeroQuarto} &bull; <strong>ID:</strong> #${reserva.id}</div>
    <div><strong>Período:</strong> ${formatarDataBR(reserva.dataCheckin)} a ${formatarDataBR(reserva.dataCheckout)}</div>
  `;
  modalExclusao.classList.remove("hidden");
  btnConfirmarExclusao.focus();
}

function fecharModalExclusao() {
  modalExclusao.classList.add("hidden");
  reservaPendenteExclusao = null;
}

// ============================================================================
// LISTENERS DE EVENTOS
// ============================================================================

// Submissão do Formulário de Reserva (Cadastro ou Edição)
formReserva.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const dadosFormulario = {
    nomeHospede: campoNome.value.trim(),
    numeroQuarto: parseInt(campoQuarto.value, 10),
    quantidadeHospedes: parseInt(campoHospedes.value, 10),
    dataCheckin: campoCheckin.value,
    dataCheckout: campoCheckout.value,
    status: campoStatus.value
  };

  if (!validarDadosReserva(dadosFormulario)) {
    mostrarToast("Corrija os erros apontados no formulário antes de prosseguir.", "error", "Validação");
    return;
  }

  if (reservaEmEdicaoId !== null) {
    // Modo Edição: Dispara PUT
    await atualizarReserva(reservaEmEdicaoId, dadosFormulario);
  } else {
    // Modo Cadastro: Dispara POST
    await cadastrarReserva(dadosFormulario);
  }
});

// Botão Cancelar Edição
btnCancelarEdicao.addEventListener("click", () => {
  cancelarEdicao();
  mostrarToast("Edição cancelada.", "info");
});

// Botão Limpar Campos
btnLimpar.addEventListener("click", () => {
  if (reservaEmEdicaoId !== null) {
    cancelarEdicao();
  } else {
    resetarFormulario();
  }
});

// Formulário de Busca por ID
formBuscaId.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const id = parseInt(inputBuscaId.value, 10);
  if (!id || id <= 0) {
    mostrarToast("Digite um identificador numérico válido para consulta.", "error");
    inputBuscaId.focus();
    return;
  }
  await buscarReservaPorId(id);
});

// Limpar Busca por ID
function limparBuscaEFiltro() {
  inputBuscaId.value = "";
  bannerFiltro.classList.add("hidden");
  btnLimparBusca.classList.add("hidden");
  renderizarPainel(todasAsReservas);
}

btnLimparBusca.addEventListener("click", limparBuscaEFiltro);
btnRemoverFiltro.addEventListener("click", limparBuscaEFiltro);

// Ações do Modal de Exclusão
btnCancelarExclusao.addEventListener("click", fecharModalExclusao);
btnConfirmarExclusao.addEventListener("click", async () => {
  if (reservaPendenteExclusao) {
    await excluirReserva(reservaPendenteExclusao.id);
  }
});

// Fechar modal ao clicar fora ou pressionar ESC
modalExclusao.addEventListener("click", (e) => {
  if (e.target === modalExclusao) fecharModalExclusao();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modalExclusao.classList.contains("hidden")) {
    fecharModalExclusao();
  }
});

// ============================================================================
// INICIALIZAÇÃO DA APLICAÇÃO
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Define datas padrões amigáveis no formulário (hoje e amanhã)
  const hoje = new Date();
  const amanha = new Date();
  amanha.setDate(hoje.getDate() + 2);

  const formatarParaInputDate = (d) => d.toISOString().split("T")[0];
  campoCheckin.value = formatarParaInputDate(hoje);
  campoCheckout.value = formatarParaInputDate(amanha);

  // Carrega as reservas reais diretamente da API
  carregarReservas();
});
