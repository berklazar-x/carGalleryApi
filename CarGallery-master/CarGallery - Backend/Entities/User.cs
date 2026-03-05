namespace CarGallery.Entities
{
    public class User : BaseEntity
    {
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; } = "user"; // "admin" or "user"
    }
}
