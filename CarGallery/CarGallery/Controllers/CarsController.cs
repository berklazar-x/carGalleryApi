using CarGallery.Data;
using CarGallery.DTOS;
using CarGallery.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;




namespace CarGallery.Controllers
{ [ApiController]
    [Route("api/[controller]")]

    public class CarsController : ControllerBase
    {
        private readonly CarGalleryContext _context;

        public CarsController(CarGalleryContext context)
        {
            _context = context;
        }

        [HttpGet("Get All")]
        public async Task<IActionResult> GetAll()
        {
            var cars = await _context.Cars
                .Where(x => !x.IsDeleted)
                .Include(x => x.Brand)
                .Select(r => new
                {
                    BrandName = r.Brand != null ? r.Brand.BrandName : "",
                    r.Model,
                    r.Year,
                    r.Price,
                    r.Id,
                    r.ImageUrl,
                    r.ImageUrls,
                    r.Color,
                    r.Stock,
                    r.CreatedDate,
                    r.CreateUserId,
                    r.UpdateDate,
                    r.UpdateUserId

                })
                .ToListAsync();
            return Ok(cars);
        }


        [HttpGet("Get by id")]
        public async Task<IActionResult> GetById(int id)
        {
            var car = await _context.Cars
                .Where(x => !x.IsDeleted && x.Id == id)
                .Include(x => x.Brand)
                .Select(r => new
                {
                    BrandName = r.Brand != null ? r.Brand.BrandName : "",
                    r.Model,
                    r.Year,
                    r.Price,
                    r.Id,
                    r.ImageUrl,
                    r.ImageUrls,
                    r.Color,
                    r.Stock,
                    r.CreatedDate,
                    r.CreateUserId,
                    r.UpdateDate,
                    r.UpdateUserId
                })
                .FirstOrDefaultAsync();

            if (car == null)
            {
                return NotFound(new { message = "Araç bulunamadı" });
            }

            return Ok(car);
        }

        [HttpPost("Post")]
        public async Task<IActionResult>  Create(AddCarDto dto)
        {

            var car = new Car
            {
                BrandId = dto.BrandId,
                CreateUserId = dto.CreateUserId,
                Model = dto.Model,
                Year = dto.Year,
                Price = dto.Price,
                ImageUrl = dto.ImageUrl,
                Color = dto.Color,
                Stock = dto.Stock

            };

            _context.Cars.Add(car);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = car.Id }, car);
        }


        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateCarDto dto)
        {
           

            var existingCar = await _context.Cars.FindAsync(dto.Id);

            if (existingCar == null)
                return NotFound();

            existingCar.Model = dto.Model;
            existingCar.Year = dto.Year;
            existingCar.Price = dto.Price;
            existingCar.UpdateDate = DateTime.UtcNow;
            existingCar.BrandId = dto.BrandId;
            existingCar.ImageUrl = dto.ImageUrl;
            existingCar.Color = dto.Color;
            existingCar.Stock = dto.Stock;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("UpdateImages/{id}")]
        public async Task<IActionResult> UpdateImages(int id, [FromBody] List<string> imageUrls)
        {
            var existingCar = await _context.Cars.FindAsync(id);

            if (existingCar == null)
                return NotFound();

            existingCar.ImageUrls = imageUrls;
            existingCar.UpdateDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            var car = await _context.Cars.FindAsync(id);

            if (car == null)
                return NotFound();

            car.IsDeleted = true;
            car.UpdateDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();  

            return NoContent();
        }
       
    }
}
