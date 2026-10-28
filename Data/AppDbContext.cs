using Microsoft.EntityFrameworkCore;
using ApiPousada.Models;

namespace ApiPousada.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Reserva> Reservas => Set<Reserva>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Seed inicial de desenvolvimento: insere 3 reservas padrão para demonstração imediata
        modelBuilder.Entity<Reserva>().HasData(
            new Reserva
            {
                Id = 1,
                NomeHospede = "Carlos Eduardo Silva",
                DataCheckin = "2026-11-01",
                DataCheckout = "2026-11-05",
                NumeroQuarto = 101,
                QuantidadeHospedes = 2,
                Status = "Confirmada"
            },
            new Reserva
            {
                Id = 2,
                NomeHospede = "Mariana Souza Oliveira",
                DataCheckin = "2026-11-10",
                DataCheckout = "2026-11-15",
                NumeroQuarto = 201,
                QuantidadeHospedes = 3,
                Status = "Pendente"
            },
            new Reserva
            {
                Id = 3,
                NomeHospede = "Roberto Alencar Santos",
                DataCheckin = "2026-11-12",
                DataCheckout = "2026-11-14",
                NumeroQuarto = 102,
                QuantidadeHospedes = 1,
                Status = "Concluída"
            }
        );
    }
}
