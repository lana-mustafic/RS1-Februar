using Market.Domain.Common;

namespace Market.Domain.Entities.Sales;

/// <summary>
/// Predstavlja uplatu za narudžbu u sistemu.
/// </summary>
public class UplataEntity : BaseEntity
{
    /// <summary>
    /// Broj uplate (human-readable, npr. UPL-0001).
    /// </summary>
    public required string BrojUplate { get; set; }

    /// <summary>
    /// ID povezane narudžbe.
    /// </summary>
    public required int OrderId { get; set; }

    /// <summary>
    /// Navigacijski property na narudžbu.
    /// </summary>
    public OrderEntity? Order { get; set; }

    /// <summary>
    /// Napomena (opcionalno polje).
    /// </summary>
    public string? Napomena { get; set; }

    /// <summary>
    /// Ukupan iznos uplate.
    /// </summary>
    public required decimal UkupanIznos { get; set; }

    /// <summary>
    /// Single source of truth for technical/business constraints.
    /// Used in validators and EF configuration.
    /// </summary>
    public static class Constraints
    {
        public const int BrojUplateMaxLength = 20;
        public const int NapomenaMaxLength = 500;
    }
}
