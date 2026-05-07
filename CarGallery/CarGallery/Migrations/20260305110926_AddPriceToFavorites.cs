using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarGallery.Migrations
{
    /// <inheritdoc />
    public partial class AddPriceToFavorites : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "AddedPrice",
                table: "Favorites",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AddedPrice",
                table: "Favorites");
        }
    }
}
