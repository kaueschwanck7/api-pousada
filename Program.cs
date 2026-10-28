using Microsoft.EntityFrameworkCore;
using ApiPousada.Data;
using ApiPousada.Models;

var builder = WebApplication.CreateBuilder(args);

// Configuração do DbContext com SQLite (Entity Framework Core)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Data Source=pousada.db";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

// Habilita CORS para permitir requisições de origens locais (ex.: Live Server, portas diferentes)
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Aplica migrations pendentes automaticamente ao iniciar a aplicação
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.UseCors();

// Habilita serviço de arquivos estáticos (pasta wwwroot)
app.UseDefaultFiles();
app.UseStaticFiles();

// ============================================================================
// DADOS E ROTAS EXISTENTES DA AP1 (QUARTOS) - MANTIDOS 100% INTACTOS
// ============================================================================
var quartos = new List<Quarto>
{
    new Quarto(1, "Quarto 1", true),
    new Quarto(2, "Quarto 2", false)
};

// Rota raiz: serve o index.html quando acessado pelo navegador e texto para clientes HTTP diretos
app.MapGet("/", (HttpContext context) =>
{
    var accept = context.Request.Headers.Accept.ToString();
    if (!string.IsNullOrEmpty(accept) && accept.Contains("text/html"))
    {
        return Results.File(Path.Combine(app.Environment.WebRootPath ?? "wwwroot", "index.html"), "text/html");
    }
    return Results.Text("Api da Pousada esta no ar!");
});

app.MapGet("/api/quartos", () =>
{
    return Results.Ok(quartos);
});

app.MapGet("/api/quarto/{id}", (int id) =>
{
    var quartosEncontrado = quartos.Find(q => q.id == id);
    if (quartosEncontrado is null)
    {
        return Results.NotFound();
    }
    return Results.Ok(quartosEncontrado);
});

app.MapPost("/api/quartos", (QuartoDTO dados) =>
{
    int proximoId = quartos.Count + 1;
    var novoQuarto = new Quarto(proximoId, dados.titulo, true);
    quartos.Add(novoQuarto);
    return Results.Created($"/api/quartos/{novoQuarto.id}", novoQuarto);
});

app.MapPut("/api/quartos/{id:int}", (int id, QuartoAtualizadoDTO dados) =>
{
    int indice = quartos.FindIndex(quartoDaLista => quartoDaLista.id == id);
    if (indice == -1)
    {
        return Results.NotFound();
    }
    var atualizado = new Quarto(id, dados.titulo, dados.disponivel);
    quartos[indice] = atualizado;
    return Results.Ok(atualizado);
});

app.MapDelete("/api/quartos/{id:int}", (int id) =>
{
    int indice = quartos.FindIndex(quartoDaLista => quartoDaLista.id == id);
    if (indice == -1)
    {
        return Results.NotFound();
    }
    quartos.RemoveAt(indice);
    return Results.NoContent();
});

// ============================================================================
// DADOS E ROTAS DA AP2 (RESERVAS) - PERSISTÊNCIA REAL COM EF CORE + SQLITE
// ============================================================================

// GET /api/reservas - Listar todas as reservas (Status 200)
app.MapGet("/api/reservas", async (AppDbContext db) =>
{
    var lista = await db.Reservas.AsNoTracking().ToListAsync();
    return Results.Ok(lista);
});

// GET /api/reservas/{id} - Consultar uma reserva pelo ID (Status 200 ou 404)
app.MapGet("/api/reservas/{id:int}", async (int id, AppDbContext db) =>
{
    var reserva = await db.Reservas.FindAsync(id);
    if (reserva is null)
    {
        return Results.NotFound(new { mensagem = $"Reserva com ID {id} não encontrada." });
    }
    return Results.Ok(reserva);
});

// POST /api/reservas - Cadastrar uma nova reserva (Status 201 ou 400)
app.MapPost("/api/reservas", async (ReservaDTO dados, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(dados.NomeHospede) ||
        string.IsNullOrWhiteSpace(dados.DataCheckin) ||
        string.IsNullOrWhiteSpace(dados.DataCheckout) ||
        dados.NumeroQuarto <= 0 ||
        dados.QuantidadeHospedes <= 0)
    {
        return Results.BadRequest(new { mensagem = "Dados inválidos para cadastro da reserva." });
    }

    var novaReserva = new Reserva
    {
        NomeHospede = dados.NomeHospede.Trim(),
        DataCheckin = dados.DataCheckin,
        DataCheckout = dados.DataCheckout,
        NumeroQuarto = dados.NumeroQuarto,
        QuantidadeHospedes = dados.QuantidadeHospedes,
        Status = string.IsNullOrWhiteSpace(dados.Status) ? "Pendente" : dados.Status
    };

    db.Reservas.Add(novaReserva);
    await db.SaveChangesAsync();

    return Results.Created($"/api/reservas/{novaReserva.Id}", novaReserva);
});

// PUT /api/reservas/{id} - Atualizar uma reserva existente (Status 200, 400 ou 404)
app.MapPut("/api/reservas/{id:int}", async (int id, ReservaAtualizadaDTO dados, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(dados.NomeHospede) ||
        string.IsNullOrWhiteSpace(dados.DataCheckin) ||
        string.IsNullOrWhiteSpace(dados.DataCheckout) ||
        dados.NumeroQuarto <= 0 ||
        dados.QuantidadeHospedes <= 0)
    {
        return Results.BadRequest(new { mensagem = "Dados inválidos para atualização da reserva." });
    }

    var reserva = await db.Reservas.FindAsync(id);
    if (reserva is null)
    {
        return Results.NotFound(new { mensagem = $"Reserva com ID {id} não encontrada." });
    }

    reserva.NomeHospede = dados.NomeHospede.Trim();
    reserva.DataCheckin = dados.DataCheckin;
    reserva.DataCheckout = dados.DataCheckout;
    reserva.NumeroQuarto = dados.NumeroQuarto;
    reserva.QuantidadeHospedes = dados.QuantidadeHospedes;
    if (!string.IsNullOrWhiteSpace(dados.Status))
    {
        reserva.Status = dados.Status;
    }

    await db.SaveChangesAsync();
    return Results.Ok(reserva);
});

// DELETE /api/reservas/{id} - Excluir uma reserva (Status 204 ou 404)
app.MapDelete("/api/reservas/{id:int}", async (int id, AppDbContext db) =>
{
    var reserva = await db.Reservas.FindAsync(id);
    if (reserva is null)
    {
        return Results.NotFound(new { mensagem = $"Reserva com ID {id} não encontrada." });
    }

    db.Reservas.Remove(reserva);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();

// ============================================================================
// MODELOS DA AP1 (QUARTOS)
// ============================================================================
record Quarto (int id, string titulo, bool disponivel);
record QuartoDTO (string titulo);
record QuartoAtualizadoDTO (string titulo, bool disponivel);
