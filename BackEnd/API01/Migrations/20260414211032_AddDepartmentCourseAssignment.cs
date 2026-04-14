using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API02.Migrations
{
    /// <inheritdoc />
    public partial class AddDepartmentCourseAssignment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DepartmentCourseAssignment",
                columns: table => new
                {
                    Dept_Id = table.Column<int>(type: "int", nullable: false),
                    Crs_Id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DepartmentCourseAssignment", x => new { x.Dept_Id, x.Crs_Id });
                    table.ForeignKey(
                        name: "FK_DepartmentCourseAssignment_Course",
                        column: x => x.Crs_Id,
                        principalTable: "Course",
                        principalColumn: "Crs_Id");
                    table.ForeignKey(
                        name: "FK_DepartmentCourseAssignment_Department",
                        column: x => x.Dept_Id,
                        principalTable: "Department",
                        principalColumn: "Dept_Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_DepartmentCourseAssignment_Crs_Id",
                table: "DepartmentCourseAssignment",
                column: "Crs_Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DepartmentCourseAssignment");
        }
    }
}
