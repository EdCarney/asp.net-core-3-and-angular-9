using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WorldCities.Migrations
{
    public partial class AddslistofcontainedcitiesandatotalcitycounttoCountry : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TotalCities",
                table: "Countries",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalCities",
                table: "Countries");
        }
    }
}
