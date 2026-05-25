using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MediTrack.API.Migrations
{
    /// <inheritdoc />
    public partial class AddIsActiveToPrescription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Prescriptions",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Prescriptions");
        }
    }
}
