using Market.Application.Abstractions;
using Market.Domain.Entities.Sales;
using Market.Domain.Entities.Fakture;

namespace Market.Infrastructure.Database;

public partial class DatabaseContext : DbContext, IAppDbContext
{
    public DbSet<ProductCategoryEntity> ProductCategories => Set<ProductCategoryEntity>();
    public DbSet<ProductEntity> Products => Set<ProductEntity>();
    public DbSet<PromotionEntity> Promotions => Set<PromotionEntity>();
    public DbSet<MarketUserEntity> Users => Set<MarketUserEntity>();
    public DbSet<RefreshTokenEntity> RefreshTokens => Set<RefreshTokenEntity>();

    public DbSet<OrderEntity> Orders => Set<OrderEntity>();
    public DbSet<OrderItemEntity> OrderItems => Set<OrderItemEntity>();

    public DbSet<FakturaEntity> Fakture => Set<FakturaEntity>();
    public DbSet<OrderShipmentEntity> OrderShipments => Set<OrderShipmentEntity>();
    public DbSet<UplataEntity> Uplate => Set<UplataEntity>();

    private readonly TimeProvider _clock;
    public DatabaseContext(DbContextOptions<DatabaseContext> options, TimeProvider clock) : base(options)
    {
        _clock = clock;
    }
}
