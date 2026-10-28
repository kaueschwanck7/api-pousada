# API Pousada - Sistema de Gestão de Quartos e Reservas (AP1 & AP2)

## Tema

Pousada.

## Objetivo do Projeto

Sistema completo de gerenciamento para uma pousada:
- **AP1 (Back-End):** Minimal API em ASP.NET Core para cadastro e controle de quartos.
- **AP2 (Front-End & Persistência com ORM):** Interface web moderna, responsiva e acessível para gerenciamento de reservas de hóspedes, conectada à API REST com persistência relacional utilizando **Entity Framework Core e SQLite**.

---

## Requisitos do Sistema

- [.NET 10 SDK](https://dotnet.microsoft.com/)
- Ferramenta global do Entity Framework Core (`dotnet-ef`)
- Navegador web moderno (Chrome, Edge, Firefox, Safari)

---

## Instalação e Preparação do Banco de Dados

### 1. Instalar a ferramenta de migrations (caso ainda não possua):

```bash
dotnet tool install --global dotnet-ef
```

### 2. Criar e atualizar o banco de dados SQLite:

Execute o comando de migrations para criar a estrutura do banco local (`pousada.db`):

```bash
dotnet ef database update
```

> **Nota sobre o Seed de Desenvolvimento:** A migration inicial já inclui um seed automático com **3 reservas padrão** (IDs 1, 2 e 3) para facilitar testes imediatos pelo avaliador, sem depender de banco pré-existente. O banco de dados local (`*.db`) é gerado sob demanda e está ignorado no Git.

---

## Como Executar a Aplicação

No terminal, na pasta raiz do projeto, execute:

```bash
dotnet run --urls http://localhost:5050
```

Abra o navegador em:

```text
http://localhost:5050
```

> **Frontend Integrado:** O frontend está localizado na pasta `wwwroot/` e é servido nativamente pelo ASP.NET Core via `UseDefaultFiles()` e `UseStaticFiles()`. O CORS está habilitado para permitir acessos de origens cruzadas caso desejado.

---

## Endpoints da API

### Reservas (AP2 - Entity Framework Core + SQLite)

| Método | Rota | Descrição | Códigos HTTP |
|---|---|---|---|
| `GET` | `/api/reservas` | Lista todas as reservas cadastradas | `200 OK` |
| `GET` | `/api/reservas/{id}` | Consulta uma reserva específica por ID | `200 OK` / `404 Not Found` |
| `POST` | `/api/reservas` | Cadastra uma nova reserva de hóspede | `201 Created` / `400 Bad Request` |
| `PUT` | `/api/reservas/{id}` | Atualiza os dados de uma reserva | `200 OK` / `400 Bad Request` / `404 Not Found` |
| `DELETE` | `/api/reservas/{id}` | Exclui definitivamente uma reserva | `204 NoContent` / `404 Not Found` |

#### Exemplo de JSON para POST / PUT (`/api/reservas`):

```json
{
  "nomeHospede": "Carolina Mendes",
  "dataCheckin": "2026-11-20",
  "dataCheckout": "2026-11-25",
  "numeroQuarto": 104,
  "quantidadeHospedes": 2,
  "status": "Confirmada"
}
```

---

### Quartos (AP1 - Minimal API em Memória)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/` | Verifica se a API está no ar (`"Api da Pousada esta no ar!"`) |
| `GET` | `/api/quartos` | Lista todos os quartos |
| `GET` | `/api/quarto/{id}` | Busca um quarto pelo ID |
| `POST` | `/api/quartos` | Cadastra um novo quarto |
| `PUT` | `/api/quartos/{id}` | Atualiza um quarto |
| `DELETE` | `/api/quartos/{id}` | Remove um quarto |

---

## Testes Automatizados com o Bruno

As coleções de teste estão organizadas na pasta `bruno/`:

- **AP1 (Quartos):** `bruno/Api Pousada AP1/`
- **AP2 (Reservas):** `bruno/Api Pousada AP2/` (inclui asserções automáticas de códigos de resposta: `200`, `201`, `204` e `404`).

---

## Estrutura do Frontend (`wwwroot/`)

```text
wwwroot/
├── index.html   # Estrutura semântica, cards de métricas, formulário e tabela
├── style.css    # Design elegante, responsividade mobile-first e animações
└── script.js    # Lógica em JavaScript puro (Vanilla JS) e Fetch API
```

---

## Vídeos de Demonstração

### Vídeo da AP1:
Link: https://drive.google.com/drive/folders/1mQLH6qK3THz5VH08QcmeXsywz1Qvaqy5?usp=sharing

### Vídeo da AP2:
Link: [INSERIR_AQUI_O_LINK_DO_SEU_VIDEO_AP2]
