namespace Market.Application.Modules.Sales.Uplate.Queries.List;

public sealed class ListUplateQueryHandler(IAppDbContext ctx)
        : IRequestHandler<ListUplateQuery, PageResult<ListUplateQueryDto>>
{
    public async Task<PageResult<ListUplateQueryDto>> Handle(ListUplateQuery request, CancellationToken ct)
    {
        var q = ctx.Uplate.AsNoTracking();

        var projectedQuery = q.OrderByDescending(x => x.CreatedAtUtc)
            .Select(x => new ListUplateQueryDto
            {
                Id = x.Id,
                BrojUplate = x.BrojUplate,
                OrderId = x.OrderId,
                OrderReferenceNumber = x.Order!.ReferenceNumber,
                Napomena = x.Napomena,
                UkupanIznos = x.UkupanIznos,
                DatumKreiranja = x.CreatedAtUtc
            });

        return await PageResult<ListUplateQueryDto>.FromQueryableAsync(projectedQuery, request.Paging, ct);
    }
}
