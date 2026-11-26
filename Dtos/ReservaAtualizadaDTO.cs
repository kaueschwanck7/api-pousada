namespace ApiPousada.Dtos;

public record ReservaAtualizadaDTO(
    string NomeHospede,
    string DataCheckin,
    string DataCheckout,
    int NumeroQuarto,
    int QuantidadeHospedes,
    string Status
);
