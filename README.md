# API Pousada — Sistema de Gestão de Quartos e Reservas

## Apresentação

A **API Pousada** é uma aplicação web desenvolvida com **ASP.NET Core (.NET 10)** no modelo **Minimal API**, com o tema **Pousada**, voltada para o gerenciamento de quartos e reservas de hóspedes.

### Contexto Acadêmico

O projeto foi construído de forma evolutiva ao longo das avaliações da disciplina na ULBRA (Análise e Desenvolvimento de Sistemas):

- **AP1:** Criação da Minimal API em ASP.NET Core com operações CRUD em memória para quartos (`/api/quartos`).
- **AP2:** Implementação do recurso de reservas (`/api/reservas`) com **Entity Framework Core**, banco de dados relacional **SQLite** e interface web integrada na pasta `wwwroot/`.
- **AS (Avaliação Semestral):** Consolidação e organização arquitetural do código por responsabilidades (`Models/`, `Dtos/`, `Data/`), limpeza do `Program.cs`, revisão do `.gitignore`, documentação completa e criação da Collection nativa do **Bruno** para testes completos de CRUD e persistência.

### Funcionalidades Existentes

- Listagem, consulta por ID, cadastro, atualização e exclusão de **reservas** com persistência em SQLite.
- Validação de campos obrigatórios e retorno padronizado dos códigos HTTP (`200 OK`, `201 Created`, `204 No Content`, `400 Bad Request`, `404 Not Found`).
- Listagem, consulta, cadastro, atualização e exclusão de **quartos** (rotas da AP1 preservadas).
- Interface web responsiva em `wwwroot/` integrada à API via `Fetch API`.

---

## Tecnologias Utilizadas

- **C#** e **.NET 10**
- **ASP.NET Core Minimal API**
- **Entity Framework Core** (`Microsoft.EntityFrameworkCore.Sqlite` e `Microsoft.EntityFrameworkCore.Design`)
- **SQLite**
- **HTML5, CSS3 e JavaScript (Vanilla JS)**
- **Bruno** (Collection nativa `.bru` para testes de API)

---

## Requisitos

Para executar o projeto localmente, é necessário ter instalado:

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Git](https://git-scm.com/)
- Ferramenta de linha de comando do EF Core (`dotnet-ef`), caso deseje rodar migrations manualmente:
  ```bash
  dotnet tool install --global dotnet-ef
  ```
- [Bruno](https://www.usebruno.com/) (para executar a Collection de testes)
- Navegador web moderno (Chrome, Edge, Firefox, etc.)

---

## Preparação e Execução

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/kaueschwanck7/api-pousada.git
   cd api-pousada
   ```

2. **Restaurar as dependências:**
   ```bash
   dotnet restore
   ```

3. **Preparar o banco de dados (Migrations):**
   A aplicação aplica as migrations automaticamente na inicialização (`db.Database.Migrate()`), mas você também pode aplicar manualmente com:
   ```bash
   dotnet ef database update
   ```

4. **Compilar o projeto:**
   ```bash
   dotnet build
   ```

5. **Executar a aplicação:**
   ```bash
   dotnet run
   ```
   A API será iniciada na porta configurada em `Properties/launchSettings.json`: `http://localhost:5050`.

6. **Acessar pelo navegador:**
   Abra `http://localhost:5050` para utilizar a interface gráfica de gerenciamento de reservas.

---

## Estrutura de Pastas

```text
API-pousada/
├── Data/
│   └── AppDbContext.cs
├── Dtos/
│   ├── QuartoAtualizadoDTO.cs
│   ├── QuartoDTO.cs
│   ├── ReservaAtualizadaDTO.cs
│   └── ReservaDTO.cs
├── Migrations/
│   ├── 20261027223442_CriacaoTabelaReservas.cs
│   ├── 20261027223442_CriacaoTabelaReservas.Designer.cs
│   └── AppDbContextModelSnapshot.cs
├── Models/
│   ├── Quarto.cs
│   └── Reserva.cs
├── Properties/
│   └── launchSettings.json
├── bruno/
│   ├── API Pousada AS/
│   │   ├── bruno.json
│   │   ├── environments/
│   │   │   └── Local.bru
│   │   ├── Quartos/
│   │   │   ├── Listar Quartos.bru
│   │   │   ├── Buscar Quarto por ID.bru
│   │   │   ├── Criar Quarto.bru
│   │   │   ├── Atualizar Quarto.bru
│   │   │   └── Excluir Quarto.bru
│   │   ├── 01 - Listar Reservas.bru
│   │   ├── 02 - Criar Reserva.bru
│   │   ├── 03 - Buscar Reserva Criada.bru
│   │   ├── 04 - Atualizar Reserva.bru
│   │   ├── 05 - Confirmar Atualizacao.bru
│   │   ├── 06 - Excluir Reserva.bru
│   │   ├── 07 - Confirmar Exclusao (404).bru
│   │   ├── 08 - Criar Reserva para Teste de Persistencia.bru
│   │   └── 09 - Consultar Reserva Apos Reiniciar API.bru
│   ├── Api Pousada AP1/
│   └── Api Pousada AP2/
├── wwwroot/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── .gitignore
├── ApiPousada.csproj
├── appsettings.json
├── Program.cs
├── README.md
└── ROTEIRO_VIDEO_AS.md
```

### Responsabilidade de cada diretório/arquivo

- **`Models/`**: Contém as entidades de domínio da aplicação (`Reserva.cs` e `Quarto.cs`).
- **`Dtos/`**: Contém os *Data Transfer Objects* (records) usados para receber dados nas requisições `POST` e `PUT` (`ReservaDTO.cs`, `ReservaAtualizadaDTO.cs`, `QuartoDTO.cs`, `QuartoAtualizadoDTO.cs`).
- **`Data/`**: Contém o `AppDbContext.cs`, responsável pela configuração do Entity Framework Core, pelo `DbSet<Reserva>` e pelo seed inicial de 3 reservas.
- **`Migrations/`**: Histórico de migrações do EF Core que definem a estrutura da tabela `Reservas` no SQLite.
- **`wwwroot/`**: Arquivos estáticos do frontend (`index.html`, `style.css`, `script.js`) servidos pela própria aplicação ASP.NET Core.
- **`bruno/`**: Contém a Collection nativa da AS (`bruno/API Pousada AS/`) além das coleções anteriores da AP1 e AP2.
- **`Program.cs`**: Ponto de entrada da aplicação. Configura os serviços (DbContext, SQLite, CORS), middlewares (arquivos estáticos), aplica migrations pendentes e define os endpoints da Minimal API.

---

## Documentação da API

### Reservas (`/api/reservas` — Persistência em SQLite)

| Método | Rota | Descrição | Status HTTP Esperados |
|---|---|---|---|
| `GET` | `/api/reservas` | Lista todas as reservas cadastradas | `200 OK` |
| `GET` | `/api/reservas/{id}` | Consulta uma reserva específica pelo ID | `200 OK`, `404 Not Found` |
| `POST` | `/api/reservas` | Cadastra uma nova reserva | `201 Created`, `400 Bad Request` |
| `PUT` | `/api/reservas/{id}` | Atualiza os dados de uma reserva existente | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/api/reservas/{id}` | Exclui uma reserva do banco de dados | `204 No Content`, `404 Not Found` |

#### Exemplo de JSON — Criação (`POST /api/reservas`)

```json
{
  "nomeHospede": "Teste CRUD - Ana Silva",
  "dataCheckin": "2026-12-10",
  "dataCheckout": "2026-12-15",
  "numeroQuarto": 201,
  "quantidadeHospedes": 2,
  "status": "Confirmada"
}
```

#### Exemplo de JSON — Atualização (`PUT /api/reservas/{id}`)

```json
{
  "nomeHospede": "Teste CRUD - Ana Silva Atualizada",
  "dataCheckin": "2026-12-10",
  "dataCheckout": "2026-12-18",
  "numeroQuarto": 202,
  "quantidadeHospedes": 3,
  "status": "Concluída"
}
```

### Quartos (`/api/quartos` — Rotas da AP1)

| Método | Rota | Descrição | Status HTTP Esperados |
|---|---|---|---|
| `GET` | `/` | Retorna o `index.html` no navegador ou mensagem de status em clientes HTTP | `200 OK` |
| `GET` | `/api/quartos` | Lista os quartos | `200 OK` |
| `GET` | `/api/quarto/{id}` | Busca um quarto pelo ID | `200 OK`, `404 Not Found` |
| `POST` | `/api/quartos` | Cadastra um novo quarto | `201 Created` |
| `PUT` | `/api/quartos/{id}` | Atualiza um quarto existente | `200 OK`, `404 Not Found` |
| `DELETE` | `/api/quartos/{id}` | Remove um quarto | `204 No Content`, `404 Not Found` |

---

## Persistência

- **SQLite:** O banco de dados é armazenado localmente no arquivo `pousada.db` (definido em `appsettings.json` pela chave `DefaultConnection: "Data Source=pousada.db"`).
- **Entity Framework Core:** O `AppDbContext` é registrado no container de injeção de dependência via `builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite(connectionString))` e injetado diretamente nos endpoints de `/api/reservas`.
- **Migrations:** Ao iniciar a aplicação, o bloco `db.Database.Migrate()` garante que o banco e a tabela `Reservas` sejam criados e populados com os dados iniciais caso ainda não existam.
- **Persistência após reinício:** Como os dados são gravados em disco no arquivo `pousada.db` por meio do `await db.SaveChangesAsync()`, ao encerrar o processo da API (`Ctrl+C`) e iniciá-lo novamente com `dotnet run`, todos os registros criados ou atualizados continuam disponíveis para consulta.

---

## Testes no Bruno

A Collection oficial da AS está localizada em formato nativo na pasta:

```text
bruno/API Pousada AS/
```

### Como abrir e executar no Bruno

1. Abra o aplicativo **Bruno**.
2. Clique em **Open Collection** e selecione a pasta `bruno/API Pousada AS` dentro do repositório.
3. No canto superior direito do Bruno, selecione o ambiente **`Local`** (configurado em `environments/Local.bru` com `baseUrl = http://localhost:5050`).
4. Certifique-se de que a API está em execução (`dotnet run`).
5. Execute as requisições na ordem numérica:
   - **`01 - Listar Reservas`**: Verifica o retorno `200 OK` com a lista inicial.
   - **`02 - Criar Reserva`**: Envia o `POST` (`201 Created`). O script pós-resposta (`script:post-response`) salva automaticamente o ID retornado na variável `{{idCriado}}`.
   - **`03 - Buscar Reserva Criada`**: Consulta `GET /api/reservas/{{idCriado}}` (`200 OK`).
   - **`04 - Atualizar Reserva`**: Atualiza os dados via `PUT /api/reservas/{{idCriado}}` (`200 OK`).
   - **`05 - Confirmar Atualizacao`**: Consulta novamente o registro atualizado (`200 OK`).
   - **`06 - Excluir Reserva`**: Remove o registro via `DELETE /api/reservas/{{idCriado}}` (`204 No Content`).
   - **`07 - Confirmar Exclusao (404)`**: Tenta consultar o ID excluído e valida o retorno `404 Not Found`.
6. **Teste de Persistência após reiniciar a API:**
   - Execute **`08 - Criar Reserva para Teste de Persistencia`** (`201 Created`). O ID retornado é salvo automaticamente na variável `{{idPersistencia}}`.
   - No terminal onde a API está rodando, pressione `Ctrl+C` para encerrar completamente o servidor.
   - Inicie a API novamente com `dotnet run`.
   - Execute **`09 - Consultar Reserva Apos Reiniciar API`** (`GET /api/reservas/{{idPersistencia}}`) e confirme o retorno `200 OK` com os mesmos dados gravados antes do reinício.

---

## Vídeo de demonstração — AS

> **[PENDENTE]** O link do vídeo de demonstração da AS será inserido aqui após a gravação e publicação.

### Histórico de Vídeos Anteriores
- **AP1:** https://drive.google.com/drive/folders/1mQLH6qK3THz5VH08QcmeXsywz1Qvaqy5?usp=sharing
