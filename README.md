# API Pousada

## Tema

Pousada.

## Objetivo

Esta API foi criada para cadastrar, consultar, atualizar e remover quartos de uma pousada.

## Requisitos

- .NET 10
- ASP.NET Core Minimal API

## Como executar

No terminal, execute:

```bash
dotnet run --urls http://localhost:5050
```

A API será executada em:

```text
http://localhost:5050
```

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | `/` | Verifica se a API está no ar |
| GET | `/api/quartos` | Lista todos os quartos |
| GET | `/api/quarto/{id}` | Busca um quarto pelo ID |
| POST | `/api/quartos` | Cadastra um novo quarto |
| PUT | `/api/quartos/{id}` | Atualiza um quarto |
| DELETE | `/api/quartos/{id}` | Remove um quarto |

## JSON usado no POST

```json
{
  "titulo": "Quarto 3"
}
```

## JSON usado no PUT

```json
{
  "titulo": "Quarto 3 Luxo",
  "disponivel": false
}
```

## Dados

Os dados ficam somente em memória usando uma `List<T>`. Eles serão perdidos quando a API for reiniciada.

## Testes

As requisições foram feitas no Bruno.

A Collection está na pasta:

```text
bruno
```

## Vídeo de demonstração

Link do vídeo:

https://drive.google.com/drive/folders/1mQLH6qK3THz5VH08QcmeXsywz1Qvaqy5?usp=sharing
