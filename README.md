# API Pousada

## Nome, tema e objetivo

**API Pousada** é uma API REST desenvolvida em ASP.NET Core (Minimal API) para gerenciar **reservas** de uma pousada. O objetivo é permitir o cadastro, consulta, atualização e remoção de reservas de hóspedes (check-in, check-out, número do quarto, quantidade de hóspedes e status da reserva), como exercício de fixação dos conceitos de Minimal APIs, DTOs e persistência em memória.

## Requisito de ambiente

- [.NET 10 SDK](https://dotnet.microsoft.com/download) instalado.

## Como executar o projeto

```bash
dotnet restore
dotnet build
dotnet run --urls http://localhost:5050
```

A API sobe em: **http://localhost:5050**

> ⚠️ **Os dados ficam somente em memória.** A lista de reservas é armazenada em uma `List<Reserva>` dentro da aplicação e é reiniciada (voltando aos dois registros iniciais) toda vez que a API for reiniciada. Não há banco de dados nem persistência em disco.

## URL local utilizada nos testes

```
http://localhost:5050
```

## Endpoints

| Método | Rota                     | Descrição                                                        |
|--------|--------------------------|--------------------------------------------------------------------|
| GET    | `/`                      | Informa que a API está no ar.                                     |
| GET    | `/api/reservas`          | Lista todas as reservas. Retorna `200 OK`.                        |
| GET    | `/api/reservas/{id}`     | Busca uma reserva pelo id. Retorna `200 OK` ou `404 Not Found`.   |
| POST   | `/api/reservas`          | Cria uma nova reserva. Retorna `201 Created`.                     |
| PUT    | `/api/reservas/{id}`     | Atualiza uma reserva existente. Retorna `200 OK` ou `404 Not Found`. |
| DELETE | `/api/reservas/{id}`     | Remove uma reserva. Retorna `204 No Content` ou `404 Not Found`.  |

## Modelo de dados

**Reserva** (record principal, armazenado em `List<Reserva>`):

- `Id` (int)
- `NomeHospede` (string)
- `DataCheckIn` (date)
- `DataCheckOut` (date)
- `NumeroQuarto` (int)
- `QuantidadeHospedes` (int)
- `Status` (string)

## Exemplo de JSON — POST `/api/reservas`

```json
{
  "nomeHospede": "Carlos Lima",
  "dataCheckIn": "2026-10-01",
  "dataCheckOut": "2026-10-05",
  "numeroQuarto": 305,
  "quantidadeHospedes": 2,
  "status": "Confirmada"
}
```

Resposta (`201 Created`):

```json
{
  "id": 3,
  "nomeHospede": "Carlos Lima",
  "dataCheckIn": "2026-10-01",
  "dataCheckOut": "2026-10-05",
  "numeroQuarto": 305,
  "quantidadeHospedes": 2,
  "status": "Confirmada"
}
```

## Exemplo de JSON — PUT `/api/reservas/{id}`

```json
{
  "nomeHospede": "Carlos Lima",
  "dataCheckIn": "2026-10-01",
  "dataCheckOut": "2026-10-06",
  "numeroQuarto": 305,
  "quantidadeHospedes": 3,
  "status": "Check-in realizado"
}
```

## Collection de testes

A Collection do **Bruno** usada nos testes está na pasta [`bruno/`](./bruno) deste repositório, contendo:

- `00 - API no ar`
- `01 - Listar`
- `02 - Buscar por id`
- `03 - Cadastrar`
- `04 - Atualizar`
- `05 - Remover`
- `06 - Confirmar remoção`

O environment `Local` (dentro de `bruno/environments`) define `baseUrl = http://localhost:5050`.

## Vídeo de demonstração

> 🎥 **Link do vídeo:** 

O vídeo apresenta o tema e o recurso escolhido, o repositório, a API sendo iniciada com `dotnet run`, uma explicação breve do `record`, do DTO de entrada, da `List<T>` e das rotas, além da execução no Bruno de todas as requisições (GET lista, GET por id, POST, PUT, DELETE), mostrando os códigos `200`, `201`, `204` e um `404`.
