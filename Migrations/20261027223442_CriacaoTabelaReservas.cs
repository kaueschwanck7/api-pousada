using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ApiPousada.Migrations
{
    /// <inheritdoc />
    public partial class CriacaoTabelaReservas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Reservas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    NomeHospede = table.Column<string>(type: "TEXT", nullable: false),
                    DataCheckin = table.Column<string>(type: "TEXT", nullable: false),
                    DataCheckout = table.Column<string>(type: "TEXT", nullable: false),
                    NumeroQuarto = table.Column<int>(type: "INTEGER", nullable: false),
                    QuantidadeHospedes = table.Column<int>(type: "INTEGER", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reservas", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Reservas",
                columns: new[] { "Id", "DataCheckin", "DataCheckout", "NomeHospede", "NumeroQuarto", "QuantidadeHospedes", "Status" },
                values: new object[,]
                {
                    { 1, "2026-11-01", "2026-11-05", "Carlos Eduardo Silva", 101, 2, "Confirmada" },
                    { 2, "2026-11-10", "2026-11-15", "Mariana Souza Oliveira", 201, 3, "Pendente" },
                    { 3, "2026-11-12", "2026-11-14", "Roberto Alencar Santos", 102, 1, "Concluída" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Reservas");
        }
    }
}
