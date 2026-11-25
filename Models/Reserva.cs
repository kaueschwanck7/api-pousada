namespace ApiPousada.Models;

public class Reserva
{
    public int Id { get; set; }
    public string NomeHospede { get; set; } = string.Empty;
    public string DataCheckin { get; set; } = string.Empty;
    public string DataCheckout { get; set; } = string.Empty;
    public int NumeroQuarto { get; set; }
    public int QuantidadeHospedes { get; set; }
    public string Status { get; set; } = "Pendente";
}
