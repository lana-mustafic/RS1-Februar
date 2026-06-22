using Market.Application.Modules.Sales.Uplate.Queries.List;
namespace Market.API.Controllers;

[ApiController]
[Route("[controller]")]
public class UplateController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<PageResult<ListUplateQueryDto>> List([FromQuery] ListUplateQuery query, CancellationToken ct)
    {
        var result = await sender.Send(query, ct);
        return result;
    }

}
