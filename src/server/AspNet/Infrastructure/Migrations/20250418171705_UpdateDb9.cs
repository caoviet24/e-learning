using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDb9 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Exams_Users_testerId",
                table: "Exams");

            migrationBuilder.RenameColumn(
                name: "testerId",
                table: "Exams",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Exams_testerId",
                table: "Exams",
                newName: "IX_Exams_UserId");

            migrationBuilder.AddColumn<string>(
                name: "SubjectId",
                table: "Lessons",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SubjectId",
                table: "Exams",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TeachScheduleId",
                table: "Classes",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Subject",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    thumbNail = table.Column<string>(type: "text", nullable: false),
                    facultyId = table.Column<string>(type: "text", nullable: true),
                    majorId = table.Column<string>(type: "text", nullable: true),
                    ClassId = table.Column<string>(type: "text", nullable: true),
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
                    table.PrimaryKey("PK_Subject", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Subject_Classes_ClassId",
                        column: x => x.ClassId,
                        principalTable: "Classes",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Subject_Faculties_facultyId",
                        column: x => x.facultyId,
                        principalTable: "Faculties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Subject_Majors_majorId",
                        column: x => x.majorId,
                        principalTable: "Majors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Subject_Users_createdBy",
                        column: x => x.createdBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ExamSchedule",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    examId = table.Column<string>(type: "text", nullable: false),
                    subjectId = table.Column<string>(type: "text", nullable: false),
                    classId = table.Column<string>(type: "text", nullable: true),
                    examDay = table.Column<string>(type: "text", nullable: false),
                    superVisoryId = table.Column<string>(type: "text", nullable: false),
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
                    table.PrimaryKey("PK_ExamSchedule", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExamSchedule_Classes_classId",
                        column: x => x.classId,
                        principalTable: "Classes",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ExamSchedule_Exams_examId",
                        column: x => x.examId,
                        principalTable: "Exams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ExamSchedule_Subject_subjectId",
                        column: x => x.subjectId,
                        principalTable: "Subject",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ExamSchedule_Users_createdBy",
                        column: x => x.createdBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ExamSchedule_Users_superVisoryId",
                        column: x => x.superVisoryId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TeachSchedule",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    subjectId = table.Column<string>(type: "text", nullable: false),
                    classId = table.Column<string>(type: "text", nullable: false),
                    lecturerId = table.Column<string>(type: "text", nullable: false),
                    numOfPeriods = table.Column<string>(type: "text", nullable: false),
                    room = table.Column<string>(type: "text", nullable: false),
                    teachDay = table.Column<string>(type: "text", nullable: false),
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
                    table.PrimaryKey("PK_TeachSchedule", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TeachSchedule_Classes_classId",
                        column: x => x.classId,
                        principalTable: "Classes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TeachSchedule_Subject_subjectId",
                        column: x => x.subjectId,
                        principalTable: "Subject",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TeachSchedule_Users_createdBy",
                        column: x => x.createdBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TeachSchedule_Users_lecturerId",
                        column: x => x.lecturerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_SubjectId",
                table: "Lessons",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Exams_SubjectId",
                table: "Exams",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Classes_TeachScheduleId",
                table: "Classes",
                column: "TeachScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_ExamSchedule_classId",
                table: "ExamSchedule",
                column: "classId");

            migrationBuilder.CreateIndex(
                name: "IX_ExamSchedule_createdBy",
                table: "ExamSchedule",
                column: "createdBy");

            migrationBuilder.CreateIndex(
                name: "IX_ExamSchedule_examId",
                table: "ExamSchedule",
                column: "examId");

            migrationBuilder.CreateIndex(
                name: "IX_ExamSchedule_subjectId",
                table: "ExamSchedule",
                column: "subjectId");

            migrationBuilder.CreateIndex(
                name: "IX_ExamSchedule_superVisoryId",
                table: "ExamSchedule",
                column: "superVisoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Subject_ClassId",
                table: "Subject",
                column: "ClassId");

            migrationBuilder.CreateIndex(
                name: "IX_Subject_createdBy",
                table: "Subject",
                column: "createdBy");

            migrationBuilder.CreateIndex(
                name: "IX_Subject_facultyId",
                table: "Subject",
                column: "facultyId");

            migrationBuilder.CreateIndex(
                name: "IX_Subject_majorId",
                table: "Subject",
                column: "majorId");

            migrationBuilder.CreateIndex(
                name: "IX_TeachSchedule_classId",
                table: "TeachSchedule",
                column: "classId");

            migrationBuilder.CreateIndex(
                name: "IX_TeachSchedule_createdBy",
                table: "TeachSchedule",
                column: "createdBy");

            migrationBuilder.CreateIndex(
                name: "IX_TeachSchedule_lecturerId",
                table: "TeachSchedule",
                column: "lecturerId");

            migrationBuilder.CreateIndex(
                name: "IX_TeachSchedule_subjectId",
                table: "TeachSchedule",
                column: "subjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_Classes_TeachSchedule_TeachScheduleId",
                table: "Classes",
                column: "TeachScheduleId",
                principalTable: "TeachSchedule",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Exams_Subject_SubjectId",
                table: "Exams",
                column: "SubjectId",
                principalTable: "Subject",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Exams_Users_UserId",
                table: "Exams",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Lessons_Subject_SubjectId",
                table: "Lessons",
                column: "SubjectId",
                principalTable: "Subject",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Classes_TeachSchedule_TeachScheduleId",
                table: "Classes");

            migrationBuilder.DropForeignKey(
                name: "FK_Exams_Subject_SubjectId",
                table: "Exams");

            migrationBuilder.DropForeignKey(
                name: "FK_Exams_Users_UserId",
                table: "Exams");

            migrationBuilder.DropForeignKey(
                name: "FK_Lessons_Subject_SubjectId",
                table: "Lessons");

            migrationBuilder.DropTable(
                name: "ExamSchedule");

            migrationBuilder.DropTable(
                name: "TeachSchedule");

            migrationBuilder.DropTable(
                name: "Subject");

            migrationBuilder.DropIndex(
                name: "IX_Lessons_SubjectId",
                table: "Lessons");

            migrationBuilder.DropIndex(
                name: "IX_Exams_SubjectId",
                table: "Exams");

            migrationBuilder.DropIndex(
                name: "IX_Classes_TeachScheduleId",
                table: "Classes");

            migrationBuilder.DropColumn(
                name: "SubjectId",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "SubjectId",
                table: "Exams");

            migrationBuilder.DropColumn(
                name: "TeachScheduleId",
                table: "Classes");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Exams",
                newName: "testerId");

            migrationBuilder.RenameIndex(
                name: "IX_Exams_UserId",
                table: "Exams",
                newName: "IX_Exams_testerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Exams_Users_testerId",
                table: "Exams",
                column: "testerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
