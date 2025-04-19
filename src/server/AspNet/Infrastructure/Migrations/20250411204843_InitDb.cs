using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    username = table.Column<string>(type: "text", nullable: false),
                    password = table.Column<string>(type: "text", nullable: false),
                    role = table.Column<string>(type: "text", nullable: false),
                    fullName = table.Column<string>(type: "text", nullable: true),
                    nickname = table.Column<string>(type: "text", nullable: true),
                    gender = table.Column<byte>(type: "smallint", nullable: true),
                    birth = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    avatar = table.Column<string>(type: "text", nullable: true),
                    currentAddress = table.Column<string>(type: "text", nullable: true),
                    email = table.Column<string>(type: "text", nullable: true),
                    phone = table.Column<string>(type: "text", nullable: true),
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
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Faculties",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    code = table.Column<string>(type: "text", nullable: false),
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
                    table.PrimaryKey("PK_Faculties", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Faculties_Users_createdBy",
                        column: x => x.createdBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Majors",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    code = table.Column<string>(type: "text", nullable: false),
                    facultyId = table.Column<string>(type: "text", nullable: false),
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
                    table.PrimaryKey("PK_Majors", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Majors_Faculties_facultyId",
                        column: x => x.facultyId,
                        principalTable: "Faculties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Majors_Users_createdBy",
                        column: x => x.createdBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Courses",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    title = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    Thumbnail = table.Column<string>(type: "text", nullable: false),
                    isActive = table.Column<bool>(type: "boolean", nullable: false),
                    status = table.Column<string>(type: "text", nullable: false),
                    facultyId = table.Column<string>(type: "text", nullable: false),
                    majorId = table.Column<string>(type: "text", nullable: false),
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
                    table.PrimaryKey("PK_Courses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Courses_Faculties_facultyId",
                        column: x => x.facultyId,
                        principalTable: "Faculties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Courses_Majors_majorId",
                        column: x => x.majorId,
                        principalTable: "Majors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Courses_Users_createdBy",
                        column: x => x.createdBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Lecturers",
                columns: table => new
                {
                    cardId = table.Column<string>(type: "text", nullable: false),
                    classId = table.Column<string>(type: "text", nullable: false),
                    majorId = table.Column<string>(type: "text", nullable: false),
                    facultyId = table.Column<string>(type: "text", nullable: false),
                    userId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lecturers", x => x.cardId);
                    table.ForeignKey(
                        name: "FK_Lecturers_Faculties_facultyId",
                        column: x => x.facultyId,
                        principalTable: "Faculties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Lecturers_Majors_majorId",
                        column: x => x.majorId,
                        principalTable: "Majors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Lecturers_Users_userId",
                        column: x => x.userId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Lessons",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    title = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    thumbnail = table.Column<string>(type: "text", nullable: false),
                    urlVideo = table.Column<string>(type: "text", nullable: false),
                    courseId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lessons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Lessons_Courses_courseId",
                        column: x => x.courseId,
                        principalTable: "Courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Classes",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    facultyId = table.Column<string>(type: "text", nullable: false),
                    majorId = table.Column<string>(type: "text", nullable: false),
                    lecturerId = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: true),
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
                    table.PrimaryKey("PK_Classes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Classes_Faculties_facultyId",
                        column: x => x.facultyId,
                        principalTable: "Faculties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Classes_Lecturers_lecturerId",
                        column: x => x.lecturerId,
                        principalTable: "Lecturers",
                        principalColumn: "cardId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Classes_Majors_majorId",
                        column: x => x.majorId,
                        principalTable: "Majors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Classes_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Students",
                columns: table => new
                {
                    cardId = table.Column<string>(type: "text", nullable: false),
                    classId = table.Column<string>(type: "text", nullable: false),
                    majorId = table.Column<string>(type: "text", nullable: false),
                    facultyId = table.Column<string>(type: "text", nullable: false),
                    userId = table.Column<string>(type: "text", nullable: false),
                    CourseId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Students", x => x.cardId);
                    table.ForeignKey(
                        name: "FK_Students_Classes_classId",
                        column: x => x.classId,
                        principalTable: "Classes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Students_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Students_Faculties_facultyId",
                        column: x => x.facultyId,
                        principalTable: "Faculties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Students_Majors_majorId",
                        column: x => x.majorId,
                        principalTable: "Majors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Students_Users_userId",
                        column: x => x.userId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    title = table.Column<string>(type: "text", nullable: false),
                    content = table.Column<string>(type: "text", nullable: false),
                    isRead = table.Column<bool>(type: "boolean", nullable: false),
                    isForAll = table.Column<bool>(type: "boolean", nullable: false),
                    facultyId = table.Column<string>(type: "text", nullable: true),
                    majorId = table.Column<string>(type: "text", nullable: true),
                    classId = table.Column<string>(type: "text", nullable: true),
                    receiverId = table.Column<string>(type: "text", nullable: true),
                    LecturercardId = table.Column<string>(type: "text", nullable: true),
                    StudentcardId = table.Column<string>(type: "text", nullable: true),
                    createdAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    createdBy = table.Column<string>(type: "text", nullable: true),
                    updatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedBy = table.Column<string>(type: "text", nullable: true),
                    isDeleted = table.Column<bool>(type: "boolean", nullable: true),
                    deletedBy = table.Column<string>(type: "text", nullable: true),
                    deletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notifications_Classes_classId",
                        column: x => x.classId,
                        principalTable: "Classes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Notifications_Faculties_facultyId",
                        column: x => x.facultyId,
                        principalTable: "Faculties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Notifications_Lecturers_LecturercardId",
                        column: x => x.LecturercardId,
                        principalTable: "Lecturers",
                        principalColumn: "cardId");
                    table.ForeignKey(
                        name: "FK_Notifications_Majors_majorId",
                        column: x => x.majorId,
                        principalTable: "Majors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Notifications_Students_StudentcardId",
                        column: x => x.StudentcardId,
                        principalTable: "Students",
                        principalColumn: "cardId");
                    table.ForeignKey(
                        name: "FK_Notifications_Users_createdBy",
                        column: x => x.createdBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Notifications_Users_receiverId",
                        column: x => x.receiverId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Classes_facultyId",
                table: "Classes",
                column: "facultyId");

            migrationBuilder.CreateIndex(
                name: "IX_Classes_lecturerId",
                table: "Classes",
                column: "lecturerId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Classes_majorId",
                table: "Classes",
                column: "majorId");

            migrationBuilder.CreateIndex(
                name: "IX_Classes_UserId",
                table: "Classes",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Courses_createdBy",
                table: "Courses",
                column: "createdBy");

            migrationBuilder.CreateIndex(
                name: "IX_Courses_facultyId",
                table: "Courses",
                column: "facultyId");

            migrationBuilder.CreateIndex(
                name: "IX_Courses_majorId",
                table: "Courses",
                column: "majorId");

            migrationBuilder.CreateIndex(
                name: "IX_Faculties_createdBy",
                table: "Faculties",
                column: "createdBy");

            migrationBuilder.CreateIndex(
                name: "IX_Lecturers_facultyId",
                table: "Lecturers",
                column: "facultyId");

            migrationBuilder.CreateIndex(
                name: "IX_Lecturers_majorId",
                table: "Lecturers",
                column: "majorId");

            migrationBuilder.CreateIndex(
                name: "IX_Lecturers_userId",
                table: "Lecturers",
                column: "userId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_courseId",
                table: "Lessons",
                column: "courseId");

            migrationBuilder.CreateIndex(
                name: "IX_Majors_createdBy",
                table: "Majors",
                column: "createdBy");

            migrationBuilder.CreateIndex(
                name: "IX_Majors_facultyId",
                table: "Majors",
                column: "facultyId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_classId",
                table: "Notifications",
                column: "classId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_createdBy",
                table: "Notifications",
                column: "createdBy");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_facultyId",
                table: "Notifications",
                column: "facultyId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_LecturercardId",
                table: "Notifications",
                column: "LecturercardId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_majorId",
                table: "Notifications",
                column: "majorId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_receiverId",
                table: "Notifications",
                column: "receiverId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_StudentcardId",
                table: "Notifications",
                column: "StudentcardId");

            migrationBuilder.CreateIndex(
                name: "IX_Students_classId",
                table: "Students",
                column: "classId");

            migrationBuilder.CreateIndex(
                name: "IX_Students_CourseId",
                table: "Students",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_Students_facultyId",
                table: "Students",
                column: "facultyId");

            migrationBuilder.CreateIndex(
                name: "IX_Students_majorId",
                table: "Students",
                column: "majorId");

            migrationBuilder.CreateIndex(
                name: "IX_Students_userId",
                table: "Students",
                column: "userId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Lessons");

            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.DropTable(
                name: "Students");

            migrationBuilder.DropTable(
                name: "Classes");

            migrationBuilder.DropTable(
                name: "Courses");

            migrationBuilder.DropTable(
                name: "Lecturers");

            migrationBuilder.DropTable(
                name: "Majors");

            migrationBuilder.DropTable(
                name: "Faculties");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
