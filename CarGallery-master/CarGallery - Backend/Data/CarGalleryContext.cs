using Microsoft.EntityFrameworkCore;
using CarGallery.Entities;
using System.Text.Json;


namespace CarGallery.Data
{
    public class CarGalleryContext : DbContext
    {
        public CarGalleryContext(DbContextOptions<CarGalleryContext> options)
            : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Car>()
                .HasOne(c => c.Brand)          
                .WithMany(c=>c.Cars)         
                .HasForeignKey(c => c.BrandId)
                .OnDelete(DeleteBehavior.Restrict);

            // ImageUrls JSON olarak sakla
            modelBuilder.Entity<Car>()
                .Property(c => c.ImageUrls)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null)
                );
        }

        public DbSet<Car> Cars { get; set; }

        public DbSet<BrandEntity> Brands { get; set; }

        public DbSet<User> Users { get; set; }

    }
}
