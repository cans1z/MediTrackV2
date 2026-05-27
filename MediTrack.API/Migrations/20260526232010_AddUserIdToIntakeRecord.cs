using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MediTrack.API.Migrations
{
    /// <inheritdoc />
    public partial class AddUserIdToIntakeRecord : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsTaken",
                table: "Intakes",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "DateTaken",
                table: "Intakes",
                newName: "ScheduledAt");

            migrationBuilder.AddColumn<DateTime>(
                name: "TakenAt",
                table: "Intakes",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Intakes_UserId",
                table: "Intakes",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Intakes_Users_UserId",
                table: "Intakes",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Intakes_Users_UserId",
                table: "Intakes");

            migrationBuilder.DropIndex(
                name: "IX_Intakes_UserId",
                table: "Intakes");

            migrationBuilder.DropColumn(
                name: "TakenAt",
                table: "Intakes");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Intakes",
                newName: "IsTaken");

            migrationBuilder.RenameColumn(
                name: "ScheduledAt",
                table: "Intakes",
                newName: "DateTaken");
        }
    }
}
