using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDb8 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Permisstion",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    isManagedPosts = table.Column<bool>(type: "boolean", nullable: false),
                    isManagedCourses = table.Column<bool>(type: "boolean", nullable: false),
                    isTeachScheduleAssignment = table.Column<bool>(type: "boolean", nullable: false),
                    assignedUserId = table.Column<string>(type: "text", nullable: false),
                    createdAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    createdBy = table.Column<string>(type: "text", nullable: false),
                    updatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedBy = table.Column<string>(type: "text", nullable: true),
                    isDeleted = table.Column<bool>(type: "boolean", nullable: true),
                    deletedBy = table.Column<string>(type: "text", nullable: true),
                    deletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Permisstion", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Permisstion_Users_assignedUserId",
                        column: x => x.assignedUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Permisstion_Users_createdBy",
                        column: x => x.createdBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Permisstion_assignedUserId",
                table: "Permisstion",
                column: "assignedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Permisstion_createdBy",
                table: "Permisstion",
                column: "createdBy");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Permisstion");
        }
    }
}
