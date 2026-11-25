# Roteiro de Gravação — AS (API Pousada)

Este roteiro foi elaborado passo a passo para a gravação narrada da **Avaliação Semestral (AS)**, utilizando exatamente os arquivos, comandos e requisições reais do projeto.

---

## Etapa 1 — Apresentação do projeto e do repositório GitHub

- **O que mostrar na tela:** Página do repositório no GitHub (`https://github.com/kaueschwanck7/api-pousada`) ou o projeto aberto no VS Code.
- **Qual arquivo abrir:** Nenhum (visão geral do repositório / explorador de arquivos).
- **O que falar:**
  > "Olá, meu nome é Kauê, sou estudante de Análise e Desenvolvimento de Sistemas na Ulbra e esta é a entrega da Avaliação Semestral (AS) da disciplina. Estou utilizando o mesmo repositório das etapas AP1 e AP2, com o tema Pousada, onde evoluímos a Minimal API em ASP.NET Core com .NET 10, Entity Framework Core e SQLite, agora organizada por responsabilidades e testada integralmente pelo Bruno."

---

## Etapa 2 — Explicação da estrutura de pastas

- **O que mostrar na tela:** Árvore de pastas no explorador lateral do VS Code (`Models/`, `Dtos/`, `Data/`, `Migrations/`, `wwwroot/`, `bruno/`, `Program.cs`, `README.md`).
- **O que falar:**
  > "Para atender à organização exigida na AS, separei o projeto por responsabilidades. Temos a pasta `Models` para as entidades, `Dtos` para os objetos de transferência de entrada, `Data` para o contexto do Entity Framework Core, `Migrations` com o histórico do banco, `wwwroot` com o frontend da AP2 preservado, e a pasta `bruno` com a Collection nativa para os testes."

---

## Etapa 3 — Explicação das entidades Model

- **O que mostrar na tela:** Código-fonte dos arquivos de modelo.
- **Qual arquivo abrir:** `Models/Reserva.cs` e `Models/Quarto.cs`.
- **O que falar:**
  > "Na pasta `Models`, temos a classe `Reserva` em `Reserva.cs`, com as propriedades `Id`, `NomeHospede`, `DataCheckin`, `DataCheckout`, `NumeroQuarto`, `QuantidadeHospedes` e `Status`. Também separei o record `Quarto` em `Quarto.cs`, que é utilizado nas rotas mantidas da AP1."

---

## Etapa 4 — Explicação dos DTOs

- **O que mostrar na tela:** Código-fonte dos DTOs.
- **Qual arquivo abrir:** `Dtos/ReservaDTO.cs`, `Dtos/ReservaAtualizadaDTO.cs`, `Dtos/QuartoDTO.cs` e `Dtos/QuartoAtualizadoDTO.cs`.
- **O que falar:**
  > "Na pasta `Dtos`, separei os records usados como entrada nos endpoints de criação e atualização. Para reservas temos `ReservaDTO` e `ReservaAtualizadaDTO`, e para quartos temos `QuartoDTO` e `QuartoAtualizadoDTO`. Cada tipo está no seu próprio arquivo, sem duplicações."

---

## Etapa 5 — Explicação do contexto do banco (`AppDbContext.cs`)

- **O que mostrar na tela:** Código do `AppDbContext`.
- **Qual arquivo abrir:** `Data/AppDbContext.cs`.
- **O que falar:**
  > "Em `Data/AppDbContext.cs`, temos a classe `AppDbContext` herdando de `DbContext`. Ela expõe o `DbSet<Reserva> Reservas` e possui o método `OnModelCreating` com o seed inicial de 3 reservas para demonstração imediata."

---

## Etapa 6 — Explicação dos namespaces e imports

- **O que mostrar na tela:** Topo do arquivo `Program.cs` e topo dos arquivos em `Models/`, `Dtos/` e `Data/`.
- **Qual arquivo abrir:** `Program.cs` (linhas 1 a 4).
- **O que falar:**
  > "Cada pasta utiliza seu namespace correspondente: `ApiPousada.Models`, `ApiPousada.Dtos` e `ApiPousada.Data`. No topo do `Program.cs`, importamos esses namespaces com `using`, permitindo que a aplicação utilize todas as classes e records separados sem definições duplicadas."

---

## Etapa 7 e 8 — Explicação do `Program.cs`, inicialização, middlewares e endpoints

- **O que mostrar na tela:** Rolar pelo `Program.cs` mostrando a configuração e os endpoints.
- **Qual arquivo abrir:** `Program.cs`.
- **O que falar:**
  > "No `Program.cs`, mantivemos apenas a configuração e o roteamento da Minimal API. Configuramos a connection string do SQLite, registramos o `AppDbContext`, habilitamos o CORS e aplicamos as migrations automaticamente na inicialização com `db.Database.Migrate()`. Também configuramos `UseDefaultFiles` e `UseStaticFiles` para servir o frontend em `wwwroot`. Em seguida temos os endpoints de `/api/quartos` e os endpoints de `/api/reservas` com `GET`, `POST`, `PUT` e `DELETE`, incluindo as validações que retornam `400 Bad Request` e os tratamentos que retornam `404 Not Found` quando o ID não existe."

---

## Etapa 9 — Compilação utilizando `dotnet build`

- **O que mostrar na tela:** Terminal integrado do VS Code.
- **Qual comando executar:**
  ```bash
  dotnet build
  ```
- **O que falar:**
  > "Agora vou compilar o projeto no terminal usando `dotnet build` para confirmar que não há nenhum erro de compilação, namespace ou referência."
- **Resultado esperado na tela:** `Compilação com êxito. 0 Aviso(s), 0 Erro(s).`

---

## Etapa 10 e 11 — Inicialização da API e explicação do EF Core + SQLite

- **O que mostrar na tela:** Terminal integrado executando a API.
- **Qual comando executar:**
  ```bash
  dotnet run
  ```
- **O que falar:**
  > "Vou iniciar a API com `dotnet run`. Como podemos ver nos logs, o Entity Framework Core verifica a tabela de histórico de migrations no arquivo `pousada.db` do SQLite e sobe o servidor escutando em `http://localhost:5050`."
- **Resultado esperado na tela:** `Now listening on: http://localhost:5050` e `Application started.`

---

## Etapa 12 — Abertura da Collection no Bruno

- **O que mostrar na tela:** Aplicativo Bruno aberto.
- **Ação na tela:** Abrir a Collection `bruno/API Pousada AS` e selecionar o ambiente **`Local`** no canto superior direito.
- **O que falar:**
  > "Agora aqui no Bruno, abri a Collection nativa `API Pousada AS` que está dentro da pasta `bruno/` do repositório, e selecionei o ambiente `Local`, onde a variável `baseUrl` aponta para `http://localhost:5050`."

---

## Etapa 13 — Execução real de todos os testes CRUD

Execute cada requisição na ordem e narre o resultado:

1. **Requisição:** `01 - Listar Reservas` (`GET {{baseUrl}}/api/reservas`)
   - **Falar:** "Primeiro listo todas as reservas existentes."
   - **Resultado:** Status `200 OK` com a lista JSON.
2. **Requisição:** `02 - Criar Reserva` (`POST {{baseUrl}}/api/reservas`)
   - **Falar:** "Agora crio uma nova reserva. O script pós-resposta do Bruno captura automaticamente o ID gerado na variável `idCriado`."
   - **Resultado:** Status `201 Created` e o objeto JSON criado com o novo `id`.
3. **Requisição:** `03 - Buscar Reserva Criada` (`GET {{baseUrl}}/api/reservas/{{idCriado}}`)
   - **Falar:** "Busco a reserva recém-criada usando a variável `{{idCriado}}`."
   - **Resultado:** Status `200 OK` com os mesmos dados enviados no POST.
4. **Requisição:** `04 - Atualizar Reserva` (`PUT {{baseUrl}}/api/reservas/{{idCriado}}`)
   - **Falar:** "Atualizo o nome do hóspede, o quarto, as datas e o status via PUT."
   - **Resultado:** Status `200 OK` com os dados já atualizados.
5. **Requisição:** `05 - Confirmar Atualizacao` (`GET {{baseUrl}}/api/reservas/{{idCriado}}`)
   - **Falar:** "Faço um novo GET para confirmar que a alteração foi salva no banco."
   - **Resultado:** Status `200 OK` exibindo os novos valores.
6. **Requisição:** `06 - Excluir Reserva` (`DELETE {{baseUrl}}/api/reservas/{{idCriado}}`)
   - **Falar:** "Agora excluo essa reserva de teste."
   - **Resultado:** Status `204 No Content` sem corpo na resposta.

---

## Etapa 14 — Demonstração do status 404 após excluir um registro

- **Requisição:** `07 - Confirmar Exclusao (404)` (`GET {{baseUrl}}/api/reservas/{{idCriado}}`)
- **O que falar:**
  > "Consultando novamente o mesmo ID após a exclusão, a API retorna `404 Not Found` com a mensagem indicando que a reserva não foi encontrada."
- **Resultado esperado:** Status `404 Not Found`.

---

## Etapa 15 — Demonstração da persistência após reiniciar a API

- **Ação 1 (Bruno):** Enviar **`08 - Criar Reserva para Teste de Persistencia`** (`POST {{baseUrl}}/api/reservas`).
  - **Falar:** "Para provar a persistência real em disco com o SQLite, crio uma nova reserva de persistência. O Bruno salva o ID na variável `idPersistencia`."
  - **Resultado:** Status `201 Created` (anote ou mostre o ID retornado).
- **Ação 2 (Terminal):** Ir ao terminal, pressionar **`Ctrl+C`** para encerrar completamente a API e iniciar novamente com:
  ```bash
  dotnet run
  ```
  - **Falar:** "Vou encerrar completamente a aplicação no terminal com Ctrl+C e iniciar o servidor novamente com `dotnet run`. Se os dados estivessem apenas em memória, esse registro teria sido perdido."
- **Ação 3 (Bruno):** Enviar **`09 - Consultar Reserva Apos Reiniciar API`** (`GET {{baseUrl}}/api/reservas/{{idPersistencia}}`).
  - **Falar:** "Com a API reiniciada, consulto novamente o mesmo ID e ele retorna `200 OK` com todos os dados intactos, provando que o SQLite manteve o registro em disco."
  - **Resultado:** Status `200 OK` com os dados de `"Teste Persistencia - Joao Pereira"`.

---

## Etapa 16 e 17 — Apresentação da Collection salva e do README

- **O que mostrar na tela:** Pasta `bruno/API Pousada AS/` no explorador e o arquivo `README.md` aberto (em modo preview ou código).
- **O que falar:**
  > "Aqui no repositório estão todos os arquivos `.bru` da Collection nativa, o `bruno.json` e o ambiente `Local.bru`. No `README.md`, documentei toda a estrutura do projeto, os comandos para preparar e executar, os endpoints, o funcionamento da persistência e o passo a passo dos testes no Bruno."

---

## Etapa 18 — Encerramento

- **O que falar:**
  > "Com isso finalizamos a demonstração completa da Avaliação Semestral da API Pousada. Muito obrigado pela atenção!"
