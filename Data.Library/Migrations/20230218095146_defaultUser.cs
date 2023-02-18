using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Library.Migrations
{
    /// <inheritdoc />
    public partial class defaultUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Designation", "Email", "FirstName", "LastName", "Password", "PhoneNumber" },
                values: new object[] { new Guid("90a51195-d1ea-4e49-8a2b-2ecab838a15b"), "CEO", "Admin@Admin.com", "Admin", "Admin", "Admin", "1234567890" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("90a51195-d1ea-4e49-8a2b-2ecab838a15b"));
        }
    }
}
