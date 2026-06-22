namespace Market.Application.Modules.Sales.Uplate.Queries.List;

public sealed class ListUplateQueryDto
{
    public required int Id { get; init; }
    public required string BrojUplate { get; init; }
    public required int OrderId { get; init; }
    public required string OrderReferenceNumber { get; init; }
    public required string? Napomena { get; init; }
    public required decimal UkupanIznos { get; init; }
    public required DateTime DatumKreiranja { get; init; }
}
