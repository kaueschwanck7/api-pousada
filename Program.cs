using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var quartos = new List<Quarto>
{
    new Quarto(1,"Quarto 1", true),
    new Quarto(2, "Quarto 2", false)
};

app.MapGet("/", () => "Api da Pousada esta no ar!");

app.MapGet("/api/quartos",() =>
{
    return Results.Ok(quartos);
});


app.MapGet("/api/quarto/{id}", (int id) =>
{
    var quartosEncontrado = quartos.Find(quartos => quartos.id == id);
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

app.MapPut("/api/quartos/{id:int}", (int id, QuartoAtualizadoDTO dados)=>
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

app.Run();

record Quarto (int id, string titulo, bool disponivel);

record QuartoDTO (string titulo);

record QuartoAtualizadoDTO (string titulo, bool disponivel);
