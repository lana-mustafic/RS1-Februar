using Market.Domain.Entities.Sales;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Market.Infrastructure.Database.Configurations.Sales;

public class UplataConfiguration : IEntityTypeConfiguration<UplataEntity>
{
    public void Configure(EntityTypeBuilder<UplataEntity> builder)
    {
        builder
            .ToTable("Uplate");

        builder
            .Property(x => x.BrojUplate)
            .HasMaxLength(UplataEntity.Constraints.BrojUplateMaxLength)
            .IsRequired();

        builder
            .Property(x => x.Napomena)
            .HasMaxLength(UplataEntity.Constraints.NapomenaMaxLength);

        builder
            .HasOne(x => x.Order)
            .WithMany()
            .HasForeignKey(x => x.OrderId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
