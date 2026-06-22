namespace Market.Domain.Entities.Sales;

/// <summary>
/// Definiše načine plaćanja za uplatu.
/// </summary>
public enum NacinPlacanjaType
{
    /// <summary>
    /// Plaćanje gotovinom (keš).
    /// </summary>
    Kes = 1,

    /// <summary>
    /// Plaćanje karticom.
    /// </summary>
    Kartica = 2
}
