namespace CarGallery.Entities;

public class FavoriteEntity : BaseEntity
{
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    
    public int CarId { get; set; }
    public Car Car { get; set; } = null!;
    
    public decimal AddedPrice { get; set; }  // Favoriye eklendiği andaki fiyat
}
