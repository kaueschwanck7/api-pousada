var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// =======================================================
// Recurso principal: Reserva (reserva de hóspede na Pousada)
// =======================================================
record Reserva(
    int Id,
    string NomeHospede,
    DateOnly DataCheckIn,
    DateOnly DataCheckOut,
    int NumeroQuarto,
    int QuantidadeHospedes,
    string Status
);

// DTO completo (usado nas respostas), inclui o Id
record ReservaDto(
    int Id,
    string NomeHospede,
    DateOnly DataCheckIn,
    DateOnly DataCheckOut,
    int NumeroQuarto,
    int QuantidadeHospedes,
    string Status
);

// DTO de entrada (usado no POST e PUT), sem o Id
record ReservaInputDto(
    string NomeHospede,
    DateOnly DataCheckIn,
    DateOnly DataCheckOut,
    int NumeroQuarto,
    int QuantidadeHospedes,
    string Status
);

// =======================================================
// "Banco de dados" em memória
// =======================================================
var reservas = new List<Reserva>
{
    new Reserva(
        Id: 1,
        NomeHospede: "Marina Souza",
        DataCheckIn: new DateOnly(2026, 9, 10),
        DataCheckOut: new DateOnly(2026, 9, 15),
        NumeroQuarto: 101,
        QuantidadeHospedes: 2,
        Status: "Confirmada"
    ),
    new Reserva(
        Id: 2,
        NomeHospede: "João Pereira",
        DataCheckIn: new DateOnly(2026, 9, 20),
        DataCheckOut: new DateOnly(2026, 9, 22),
        NumeroQuarto: 204,
        QuantidadeHospedes: 1,
        Status: "Pendente"
    )
};

var proximoId = reservas.Count + 1;

// Função auxiliar para converter Reserva -> ReservaDto
static ReservaDto ParaDto(Reserva r) =>
    new ReservaDto(r.Id, r.NomeHospede, r.DataCheckIn, r.DataCheckOut, r.NumeroQuarto, r.QuantidadeHospedes, r.Status);

// =======================================================
// Rota raiz
// =======================================================
app.MapGet("/", () => Results.Ok(new { mensagem = "API da Pousada está no ar!" }));

// =======================================================
// CRUD de Reservas
// =======================================================

// GET /api/reservas - lista todas as reservas
app.MapGet("/api/reservas", () =>
{
    var lista = reservas.Select(ParaDto).ToList();
    return Results.Ok(lista);
});

// GET /api/reservas/{id} - busca uma reserva pelo id
app.MapGet("/api/reservas/{id:int}", (int id) =>
{
    var reserva = reservas.FirstOrDefault(r => r.Id == id);
    if (reserva is null)
        return Results.NotFound(new { mensagem = $"Reserva com Id {id} não encontrada." });

    return Results.Ok(ParaDto(reserva));
});

// POST /api/reservas - cria uma nova reserva
app.MapPost("/api/reservas", (ReservaInputDto input) =>
{
    var novaReserva = new Reserva(
        Id: proximoId++,
        NomeHospede: input.NomeHospede,
        DataCheckIn: input.DataCheckIn,
        DataCheckOut: input.DataCheckOut,
        NumeroQuarto: input.NumeroQuarto,
        QuantidadeHospedes: input.QuantidadeHospedes,
        Status: input.Status
    );

    reservas.Add(novaReserva);

    return Results.Created($"/api/reservas/{novaReserva.Id}", ParaDto(novaReserva));
});

// PUT /api/reservas/{id} - atualiza uma reserva existente
app.MapPut("/api/reservas/{id:int}", (int id, ReservaInputDto input) =>
{
    var index = reservas.FindIndex(r => r.Id == id);
    if (index == -1)
        return Results.NotFound(new { mensagem = $"Reserva com Id {id} não encontrada." });

    var reservaAtualizada = new Reserva(
        Id: id,
        NomeHospede: input.NomeHospede,
        DataCheckIn: input.DataCheckIn,
        DataCheckOut: input.DataCheckOut,
        NumeroQuarto: input.NumeroQuarto,
        QuantidadeHospedes: input.QuantidadeHospedes,
        Status: input.Status
    );

    reservas[index] = reservaAtualizada;

    return Results.Ok(ParaDto(reservaAtualizada));
});

// DELETE /api/reservas/{id} - remove uma reserva
app.MapDelete("/api/reservas/{id:int}", (int id) =>
{
    var reserva = reservas.FirstOrDefault(r => r.Id == id);
    if (reserva is null)
        return Results.NotFound(new { mensagem = $"Reserva com Id {id} não encontrada." });

    reservas.Remove(reserva);

    return Results.NoContent();
});

app.Run();
