using Microsoft.AspNetCore.Mvc;
using CarGallery.Data;
using CarGallery.Entities;
using Microsoft.EntityFrameworkCore;

namespace CarGallery.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavoritesController : ControllerBase
    {
        private readonly CarGalleryContext _context;

        public FavoritesController(CarGalleryContext context)
        {
            _context = context;
        }

        // Get user's favorite cars
        [HttpGet("user/{userId}")]
        public async Task<ActionResult> GetUserFavorites(int userId)
        {
            var favorites = await _context.Favorites
                .Where(f => f.UserId == userId)
                .Include(f => f.Car)
                    .ThenInclude(c => c.Brand)
                .Select(f => new
                {
                    f.Car.Id,
                    BrandName = f.Car.Brand != null ? f.Car.Brand.BrandName : "",
                    f.Car.Model,
                    f.Car.Year,
                    f.Car.Price,
                    AddedPrice = f.AddedPrice,  // Favoriye eklendiği andaki fiyat
                    f.Car.ImageUrl,
                    f.Car.Color,
                    f.Car.Stock,
                    f.Car.ImageUrls,
                    f.Car.CreatedDate,
                    f.Car.CreateUserId,
                    f.Car.UpdateDate,
                    f.Car.UpdateUserId
                })
                .ToListAsync();

            return Ok(favorites);
        }

        // Add to favorites
        [HttpPost]
        public async Task<ActionResult> AddToFavorites([FromBody] FavoriteDto dto)
        {
            // Check if already in favorites
            var exists = await _context.Favorites
                .AnyAsync(f => f.UserId == dto.UserId && f.CarId == dto.CarId);

            if (exists)
            {
                return BadRequest(new { message = "This car is already in your favorites" });
            }

            // Arabanın mevcut fiyatını al
            var car = await _context.Cars.FindAsync(dto.CarId);
            if (car == null)
            {
                return NotFound(new { message = "Car not found" });
            }

            var favorite = new FavoriteEntity
            {
                UserId = dto.UserId,
                CarId = dto.CarId,
                AddedPrice = car.Price,  // Favoriye eklendiği andaki fiyatı kaydet
                CreatedDate = DateTime.UtcNow,
                CreateUserId = dto.UserId,
                IsActive = true,
                IsDeleted = false
            };

            _context.Favorites.Add(favorite);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Added to favorites" });
        }

        // Remove from favorites
        [HttpDelete("user/{userId}/car/{carId}")]
        public async Task<ActionResult> RemoveFromFavorites(int userId, int carId)
        {
            var favorite = await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.CarId == carId);

            if (favorite == null)
            {
                return NotFound(new { message = "Favorite not found" });
            }

            _context.Favorites.Remove(favorite);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Removed from favorites" });
        }

        // Check if a car is in user's favorites
        [HttpGet("user/{userId}/car/{carId}/check")]
        public async Task<ActionResult<bool>> CheckIsFavorite(int userId, int carId)
        {
            var isFavorite = await _context.Favorites
                .AnyAsync(f => f.UserId == userId && f.CarId == carId);

            return Ok(new { isFavorite });
        }

        // Update old favorites with current prices (for migration)
        [HttpPost("update-prices")]
        public async Task<ActionResult> UpdateFavoritePrices()
        {
            var favorites = await _context.Favorites
                .Include(f => f.Car)
                .Where(f => f.AddedPrice == 0)
                .ToListAsync();

            foreach (var favorite in favorites)
            {
                if (favorite.Car != null)
                {
                    favorite.AddedPrice = favorite.Car.Price;
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = $"Updated {favorites.Count} favorites with current prices" });
        }
    }

    // DTO
    public class FavoriteDto
    {
        public int UserId { get; set; }
        public int CarId { get; set; }
    }
}
