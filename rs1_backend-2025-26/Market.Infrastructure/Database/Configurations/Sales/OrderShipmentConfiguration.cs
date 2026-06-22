using Market.Domain.Entities.Sales;
using Microsoft.EntityFrameworkCore;

namespace Market.Infrastructure.Database.Configurations.Sales;

public class OrderShipmentConfiguration : IEntityTypeConfiguration<OrderShipmentEntity>
{
    public void Configure(EntityTypeBuilder<OrderShipmentEntity> builder)
    {
        builder
            .ToTable("OrderShipments");

        builder
            .Property(x => x.ShipmentNumber)
            .HasMaxLength(OrderShipmentEntity.Constraints.ShipmentNumberMaxLength);

        builder
            .HasOne(x => x.Order)
            .WithMany()
            .HasForeignKey(x => x.OrderId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
