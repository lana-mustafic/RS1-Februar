using Market.Domain.Common;

namespace Market.Domain.Entities.Sales;

/// <summary>
/// Represents a shipment for an order.
/// </summary>
public class OrderShipmentEntity : BaseEntity
{
    /// <summary>
    /// Tracking number for the shipment (e.g., SHP-00001).
    /// </summary>
    public required string ShipmentNumber { get; set; }

    /// <summary>
    /// Current status of the shipment.
    /// </summary>
    public required OrderShipmentStatusType Status { get; set; }

    /// <summary>
    /// Cost of shipping.
    /// </summary>
    public required decimal ShippingCost { get; set; }

    /// <summary>
    /// ID of the related order.
    /// </summary>
    public required int OrderId { get; set; }

    /// <summary>
    /// Associated order entity.
    /// </summary>
    public OrderEntity? Order { get; set; }

    /// <summary>
    /// Date when the shipment was shipped (UTC).
    /// </summary>
    public required DateTime ShippedAtUtc { get; set; }

    /// <summary>
    /// Date when the shipment was delivered (UTC). Null if not yet delivered.
    /// </summary>
    public DateTime? DeliveredAtUtc { get; set; }

    /// <summary>
    /// Single source of truth for technical/business constraints.
    /// </summary>
    public static class Constraints
    {
        public const int ShipmentNumberMaxLength = 20;
    }
}
