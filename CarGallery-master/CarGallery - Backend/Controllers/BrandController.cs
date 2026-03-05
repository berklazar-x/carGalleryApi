using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CarGallery.Data;
using CarGallery.DTOS;
using CarGallery.Entities;
using Microsoft.EntityFrameworkCore;

namespace CarGallery.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrandController : ControllerBase
    {
        private readonly CarGalleryContext _context;

        public BrandController(CarGalleryContext context)
        {
            _context = context;
        }

        [HttpPost("Post")]

        public async Task<IActionResult> Create(AddBrandDto dto)
        {
            var brand = new BrandEntity
            {
              BrandName = dto.BrandName,
                UpdateDate = null

            };

            _context.Brands.Add(brand);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = brand.Id }, brand);
        }
     

        [HttpGet("GetAll")]

        public async Task<IActionResult> GetAll()
        {

            var brand = await _context.Brands
              .Where(x => !x.IsDeleted)
              .Select(z => new
              {
                  z.BrandName,
                  z.Id,
                  z.CreatedDate,
                  z.UpdateDate
              })
              .ToListAsync();

            return Ok(brand);
        }
        [HttpGet("Get by id")]
        public async Task<IActionResult> GetById(int id)
        {
            var brand = await _context.Brands.FindAsync(id);

            if (brand == null)
                return NotFound();

            return Ok(brand);
        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateBrandDto dto)
        {

            var brand = await _context.Brands.FindAsync(dto.Id);

            if (brand == null)
                return NotFound();

            brand.BrandName = dto.BrandName;
            brand.UpdateDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(brand);
        }


        [HttpDelete("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            var brand = await _context.Brands.FindAsync(id);

            if(brand == null)
                return NotFound();
            brand.IsDeleted = true;
            brand.UpdateDate = DateTime.UtcNow;


            await _context.SaveChangesAsync();

        return NoContent();
        }
    }
}
