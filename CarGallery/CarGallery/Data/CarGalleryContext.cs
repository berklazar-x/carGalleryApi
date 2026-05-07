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

            // Favorite ilişkileri
            modelBuilder.Entity<FavoriteEntity>()
                .HasOne(f => f.User)
                .WithMany()
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<FavoriteEntity>()
                .HasOne(f => f.Car)
                .WithMany()
                .HasForeignKey(f => f.CarId)
                .OnDelete(DeleteBehavior.Cascade);

            // Bir kullanıcı bir arabayı sadece bir kez favoriye ekleyebilir
            modelBuilder.Entity<FavoriteEntity>()
                .HasIndex(f => new { f.UserId, f.CarId })
                .IsUnique();
        }

        public DbSet<Car> Cars { get; set; }

        public DbSet<BrandEntity> Brands { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<FavoriteEntity> Favorites { get; set; }

    }
}
