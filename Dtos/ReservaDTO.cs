namespace ApiPousada.Dtos;

public record ReservaDTO(
    string NomeHospede,
    string DataCheckin,
    string DataCheckout,
    int NumeroQuarto,
    int QuantidadeHospedes,
    string Status
);
