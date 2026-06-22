namespace Market.Domain.Entities.Sales;

/// <summary>
/// Defines possible states of an order shipment.
/// </summary>
public enum OrderShipmentStatusType
{
    /// <summary>
    /// Shipment has been created.
    /// </summary>
    Kreirana = 1,

    /// <summary>
    /// Shipment is in the warehouse.
    /// </summary>
    USkladistu = 2,

    /// <summary>
    /// Shipment is in transit.
    /// </summary>
    UDostavi = 3,

    /// <summary>
    /// Shipment has been delivered.
    /// </summary>
    Dostavljena = 4,

    /// <summary>
    /// Shipment has been cancelled.
    /// </summary>
    Otkazana = 5
}
