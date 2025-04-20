using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateV10 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Classes_TeachSchedule_TeachScheduleId",
                table: "Classes");

            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Posts_postId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_ExamQuestions_Exams_examId",
                table: "ExamQuestions");

            migrationBuilder.DropForeignKey(
                name: "FK_Exams_Classes_classId",
                table: "Exams");

            migrationBuilder.DropForeignKey(
                name: "FK_Exams_Courses_courseId",
                table: "Exams");

            migrationBuilder.DropForeignKey(
                name: "FK_Exams_Faculties_facultyId",
                table: "Exams");

            migrationBuilder.DropForeignKey(
                name: "FK_Exams_Majors_majorId",
                table: "Exams");

            migrationBuilder.DropForeignKey(
                name: "FK_Exams_Subject_SubjectId",
                table: "Exams");

            migrationBuilder.DropForeignKey(
                name: "FK_ExamSchedule_Classes_classId",
                table: "ExamSchedule");

            migrationBuilder.DropForeignKey(
                name: "FK_ExamSchedule_Exams_examId",
                table: "ExamSchedule");

            migrationBuilder.DropForeignKey(
                name: "FK_ExamSchedule_Subject_subjectId",
                table: "ExamSchedule");

            migrationBuilder.DropForeignKey(
                name: "FK_ExamSchedule_Users_createdBy",
                table: "ExamSchedule");

            migrationBuilder.DropForeignKey(
                name: "FK_ExamSchedule_Users_superVisoryId",
                table: "ExamSchedule");

            migrationBuilder.DropForeignKey(
                name: "FK_Lessons_Subject_SubjectId",
                table: "Lessons");

            migrationBuilder.DropForeignKey(
                name: "FK_Permisstion_Users_assignedUserId",
                table: "Permisstion");

            migrationBuilder.DropForeignKey(
                name: "FK_Permisstion_Users_createdBy",
                table: "Permisstion");

            migrationBuilder.DropForeignKey(
                name: "FK_Subject_Classes_ClassId",
                table: "Subject");

            migrationBuilder.DropForeignKey(
                name: "FK_Subject_Faculties_facultyId",
                table: "Subject");

            migrationBuilder.DropForeignKey(
                name: "FK_Subject_Majors_majorId",
                table: "Subject");

            migrationBuilder.DropForeignKey(
                name: "FK_Subject_Users_createdBy",
                table: "Subject");

            migrationBuilder.DropTable(
                name: "LikePosts");

            migrationBuilder.DropTable(
                name: "SavedPosts");

            migrationBuilder.DropTable(
                name: "TeachSchedule");

            migrationBuilder.DropTable(
                name: "Posts");

            migrationBuilder.DropIndex(
                name: "IX_Exams_courseId",
                table: "Exams");

            migrationBuilder.DropIndex(
                name: "IX_Exams_facultyId",
                table: "Exams");

            migrationBuilder.DropIndex(
                name: "IX_Exams_majorId",
                table: "Exams");

            migrationBuilder.DropIndex(
                name: "IX_Classes_TeachScheduleId",
                table: "Classes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Subject",
                table: "Subject");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Permisstion",
                table: "Permisstion");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ExamSchedule",
                table: "ExamSchedule");

            migrationBuilder.DropColumn(
                name: "courseId",
                table: "Exams");

            migrationBuilder.DropColumn(
                name: "facultyId",
                table: "Exams");

            migrationBuilder.DropColumn(
                name: "isActive",
                table: "Exams");

            migrationBuilder.DropColumn(
                name: "majorId",
                table: "Exams");

            migrationBuilder.DropColumn(
                name: "answers",
                table: "ExamQuestions");

            migrationBuilder.DropColumn(
                name: "audioUrl",
                table: "ExamQuestions");

            migrationBuilder.DropColumn(
                name: "correctAnswer",
                table: "ExamQuestions");

            migrationBuilder.DropColumn(
                name: "imageUrl",
                table: "ExamQuestions");

            migrationBuilder.DropColumn(
                name: "isMultipleChoice",
                table: "ExamQuestions");

            migrationBuilder.DropColumn(
                name: "videoUrl",
                table: "ExamQuestions");

            migrationBuilder.DropColumn(
                name: "tag",
                table: "Comments");

            migrationBuilder.DropColumn(
                name: "TeachScheduleId",
                table: "Classes");

            migrationBuilder.RenameTable(
                name: "Subject",
                newName: "Subjects");

            migrationBuilder.RenameTable(
                name: "Permisstion",
                newName: "Permisstions");

            migrationBuilder.RenameTable(
                name: "ExamSchedule",
                newName: "ExamSchedules");

            migrationBuilder.RenameColumn(
                name: "classId",
                table: "Exams",
                newName: "ClassId");

            migrationBuilder.RenameColumn(
                name: "SubjectId",
                table: "Exams",
                newName: "subjectId");

            migrationBuilder.RenameIndex(
                name: "IX_Exams_SubjectId",
                table: "Exams",
                newName: "IX_Exams_subjectId");

            migrationBuilder.RenameIndex(
                name: "IX_Exams_classId",
                table: "Exams",
                newName: "IX_Exams_ClassId");

            migrationBuilder.RenameColumn(
                name: "content",
                table: "ExamQuestions",
                newName: "questionId");

            migrationBuilder.RenameIndex(
                name: "IX_Subject_majorId",
                table: "Subjects",
                newName: "IX_Subjects_majorId");

            migrationBuilder.RenameIndex(
                name: "IX_Subject_facultyId",
                table: "Subjects",
                newName: "IX_Subjects_facultyId");

            migrationBuilder.RenameIndex(
                name: "IX_Subject_createdBy",
                table: "Subjects",
                newName: "IX_Subjects_createdBy");

            migrationBuilder.RenameIndex(
                name: "IX_Subject_ClassId",
                table: "Subjects",
                newName: "IX_Subjects_ClassId");

            migrationBuilder.RenameColumn(
                name: "isTeachScheduleAssignment",
                table: "Permisstions",
                newName: "isManagedUsers");

            migrationBuilder.RenameColumn(
                name: "isManagedPosts",
                table: "Permisstions",
                newName: "isManagedSubjects");

            migrationBuilder.RenameIndex(
                name: "IX_Permisstion_createdBy",
                table: "Permisstions",
                newName: "IX_Permisstions_createdBy");

            migrationBuilder.RenameIndex(
                name: "IX_Permisstion_assignedUserId",
                table: "Permisstions",
                newName: "IX_Permisstions_assignedUserId");

            migrationBuilder.RenameIndex(
                name: "IX_ExamSchedule_superVisoryId",
                table: "ExamSchedules",
                newName: "IX_ExamSchedules_superVisoryId");

            migrationBuilder.RenameIndex(
                name: "IX_ExamSchedule_subjectId",
                table: "ExamSchedules",
                newName: "IX_ExamSchedules_subjectId");

            migrationBuilder.RenameIndex(
                name: "IX_ExamSchedule_examId",
                table: "ExamSchedules",
                newName: "IX_ExamSchedules_examId");

            migrationBuilder.RenameIndex(
                name: "IX_ExamSchedule_createdBy",
                table: "ExamSchedules",
                newName: "IX_ExamSchedules_createdBy");

            migrationBuilder.RenameIndex(
                name: "IX_ExamSchedule_classId",
                table: "ExamSchedules",
                newName: "IX_ExamSchedules_classId");

            migrationBuilder.AddColumn<string>(
                name: "documentUrl",
                table: "Lessons",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "password",
                table: "Exams",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "documentUrl",
                table: "Courses",
                type: "text",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "postId",
                table: "Comments",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "imageUrl",
                table: "Comments",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "audioUrl",
                table: "Comments",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "lessonId",
                table: "Comments",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "videoUrl",
                table: "Comments",
                type: "text",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Subjects",
                table: "Subjects",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Permisstions",
                table: "Permisstions",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ExamSchedules",
                table: "ExamSchedules",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Question",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    content = table.Column<string>(type: "text", nullable: false),
                    imageUrl = table.Column<string>(type: "text", nullable: true),
                    videoUrl = table.Column<string>(type: "text", nullable: true),
                    audioUrl = table.Column<string>(type: "text", nullable: true),
                    isMultipleChoice = table.Column<bool>(type: "boolean", nullable: false),
                    answers = table.Column<string>(type: "text", nullable: true),
                    correctAnswer = table.Column<string>(type: "text", nullable: true),
                    facultyId = table.Column<string>(type: "text", nullable: true),
                    majorId = table.Column<string>(type: "text", nullable: true),
                    subjectId = table.Column<string>(type: "text", nullable: true),
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
                    table.PrimaryKey("PK_Question", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Question_Faculties_facultyId",
                        column: x => x.facultyId,
                        principalTable: "Faculties",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Question_Majors_majorId",
                        column: x => x.majorId,
                        principalTable: "Majors",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Question_Subjects_subjectId",
                        column: x => x.subjectId,
                        principalTable: "Subjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ExamQuestions_questionId",
                table: "ExamQuestions",
                column: "questionId");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_lessonId",
                table: "Comments",
                column: "lessonId");

            migrationBuilder.CreateIndex(
                name: "IX_Question_facultyId",
                table: "Question",
                column: "facultyId");

            migrationBuilder.CreateIndex(
                name: "IX_Question_majorId",
                table: "Question",
                column: "majorId");

            migrationBuilder.CreateIndex(
                name: "IX_Question_subjectId",
                table: "Question",
                column: "subjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Courses_postId",
                table: "Comments",
                column: "postId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Lessons_lessonId",
                table: "Comments",
                column: "lessonId",
                principalTable: "Lessons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ExamQuestions_Exams_examId",
                table: "ExamQuestions",
                column: "examId",
                principalTable: "Exams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ExamQuestions_Question_questionId",
                table: "ExamQuestions",
                column: "questionId",
                principalTable: "Question",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Exams_Classes_ClassId",
                table: "Exams",
                column: "ClassId",
                principalTable: "Classes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Exams_Subjects_subjectId",
                table: "Exams",
                column: "subjectId",
                principalTable: "Subjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ExamSchedules_Classes_classId",
                table: "ExamSchedules",
                column: "classId",
                principalTable: "Classes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ExamSchedules_Exams_examId",
                table: "ExamSchedules",
                column: "examId",
                principalTable: "Exams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ExamSchedules_Subjects_subjectId",
                table: "ExamSchedules",
                column: "subjectId",
                principalTable: "Subjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ExamSchedules_Users_createdBy",
                table: "ExamSchedules",
                column: "createdBy",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ExamSchedules_Users_superVisoryId",
                table: "ExamSchedules",
                column: "superVisoryId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Lessons_Subjects_SubjectId",
                table: "Lessons",
                column: "SubjectId",
                principalTable: "Subjects",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Permisstions_Users_assignedUserId",
                table: "Permisstions",
                column: "assignedUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Permisstions_Users_createdBy",
                table: "Permisstions",
                column: "createdBy",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Subjects_Classes_ClassId",
                table: "Subjects",
                column: "ClassId",
                principalTable: "Classes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Subjects_Faculties_facultyId",
                table: "Subjects",
                column: "facultyId",
                principalTable: "Faculties",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Subjects_Majors_majorId",
                table: "Subjects",
                column: "majorId",
                principalTable: "Majors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Subjects_Users_createdBy",
                table: "Subjects",
                column: "createdBy",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Courses_postId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Lessons_lessonId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_ExamQuestions_Exams_examId",
                table: "ExamQuestions");

            migrationBuilder.DropForeignKey(
                name: "FK_ExamQuestions_Question_questionId",
                table: "ExamQuestions");

            migrationBuilder.DropForeignKey(
                name: "FK_Exams_Classes_ClassId",
                table: "Exams");

            migrationBuilder.DropForeignKey(
                name: "FK_Exams_Subjects_subjectId",
                table: "Exams");

            migrationBuilder.DropForeignKey(
                name: "FK_ExamSchedules_Classes_classId",
                table: "ExamSchedules");

            migrationBuilder.DropForeignKey(
                name: "FK_ExamSchedules_Exams_examId",
                table: "ExamSchedules");

            migrationBuilder.DropForeignKey(
                name: "FK_ExamSchedules_Subjects_subjectId",
                table: "ExamSchedules");

            migrationBuilder.DropForeignKey(
                name: "FK_ExamSchedules_Users_createdBy",
                table: "ExamSchedules");

            migrationBuilder.DropForeignKey(
                name: "FK_ExamSchedules_Users_superVisoryId",
                table: "ExamSchedules");

            migrationBuilder.DropForeignKey(
                name: "FK_Lessons_Subjects_SubjectId",
                table: "Lessons");

            migrationBuilder.DropForeignKey(
                name: "FK_Permisstions_Users_assignedUserId",
                table: "Permisstions");

            migrationBuilder.DropForeignKey(
                name: "FK_Permisstions_Users_createdBy",
                table: "Permisstions");

            migrationBuilder.DropForeignKey(
                name: "FK_Subjects_Classes_ClassId",
                table: "Subjects");

            migrationBuilder.DropForeignKey(
                name: "FK_Subjects_Faculties_facultyId",
                table: "Subjects");

            migrationBuilder.DropForeignKey(
                name: "FK_Subjects_Majors_majorId",
                table: "Subjects");

            migrationBuilder.DropForeignKey(
                name: "FK_Subjects_Users_createdBy",
                table: "Subjects");

            migrationBuilder.DropTable(
                name: "Question");

            migrationBuilder.DropIndex(
                name: "IX_ExamQuestions_questionId",
                table: "ExamQuestions");

            migrationBuilder.DropIndex(
                name: "IX_Comments_lessonId",
                table: "Comments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Subjects",
                table: "Subjects");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Permisstions",
                table: "Permisstions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ExamSchedules",
                table: "ExamSchedules");

            migrationBuilder.DropColumn(
                name: "documentUrl",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "password",
                table: "Exams");

            migrationBuilder.DropColumn(
                name: "documentUrl",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "audioUrl",
                table: "Comments");

            migrationBuilder.DropColumn(
                name: "lessonId",
                table: "Comments");

            migrationBuilder.DropColumn(
                name: "videoUrl",
                table: "Comments");

            migrationBuilder.RenameTable(
                name: "Subjects",
                newName: "Subject");

            migrationBuilder.RenameTable(
                name: "Permisstions",
                newName: "Permisstion");

            migrationBuilder.RenameTable(
                name: "ExamSchedules",
                newName: "ExamSchedule");

            migrationBuilder.RenameColumn(
                name: "subjectId",
                table: "Exams",
                newName: "SubjectId");

            migrationBuilder.RenameColumn(
                name: "ClassId",
                table: "Exams",
                newName: "classId");

            migrationBuilder.RenameIndex(
                name: "IX_Exams_subjectId",
                table: "Exams",
                newName: "IX_Exams_SubjectId");

            migrationBuilder.RenameIndex(
                name: "IX_Exams_ClassId",
                table: "Exams",
                newName: "IX_Exams_classId");

            migrationBuilder.RenameColumn(
                name: "questionId",
                table: "ExamQuestions",
                newName: "content");

            migrationBuilder.RenameIndex(
                name: "IX_Subjects_majorId",
                table: "Subject",
                newName: "IX_Subject_majorId");

            migrationBuilder.RenameIndex(
                name: "IX_Subjects_facultyId",
                table: "Subject",
                newName: "IX_Subject_facultyId");

            migrationBuilder.RenameIndex(
                name: "IX_Subjects_createdBy",
                table: "Subject",
                newName: "IX_Subject_createdBy");

            migrationBuilder.RenameIndex(
                name: "IX_Subjects_ClassId",
                table: "Subject",
                newName: "IX_Subject_ClassId");

            migrationBuilder.RenameColumn(
                name: "isManagedUsers",
                table: "Permisstion",
                newName: "isTeachScheduleAssignment");

            migrationBuilder.RenameColumn(
                name: "isManagedSubjects",
                table: "Permisstion",
                newName: "isManagedPosts");

            migrationBuilder.RenameIndex(
                name: "IX_Permisstions_createdBy",
                table: "Permisstion",
                newName: "IX_Permisstion_createdBy");

            migrationBuilder.RenameIndex(
                name: "IX_Permisstions_assignedUserId",
                table: "Permisstion",
                newName: "IX_Permisstion_assignedUserId");

            migrationBuilder.RenameIndex(
                name: "IX_ExamSchedules_superVisoryId",
                table: "ExamSchedule",
                newName: "IX_ExamSchedule_superVisoryId");

            migrationBuilder.RenameIndex(
                name: "IX_ExamSchedules_subjectId",
                table: "ExamSchedule",
                newName: "IX_ExamSchedule_subjectId");

            migrationBuilder.RenameIndex(
                name: "IX_ExamSchedules_examId",
                table: "ExamSchedule",
                newName: "IX_ExamSchedule_examId");

            migrationBuilder.RenameIndex(
                name: "IX_ExamSchedules_createdBy",
                table: "ExamSchedule",
                newName: "IX_ExamSchedule_createdBy");

            migrationBuilder.RenameIndex(
                name: "IX_ExamSchedules_classId",
                table: "ExamSchedule",
                newName: "IX_ExamSchedule_classId");

            migrationBuilder.AddColumn<string>(
                name: "courseId",
                table: "Exams",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "facultyId",
                table: "Exams",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "isActive",
                table: "Exams",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "majorId",
                table: "Exams",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "answers",
                table: "ExamQuestions",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "audioUrl",
                table: "ExamQuestions",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "correctAnswer",
                table: "ExamQuestions",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "imageUrl",
                table: "ExamQuestions",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "isMultipleChoice",
                table: "ExamQuestions",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "videoUrl",
                table: "ExamQuestions",
                type: "text",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "postId",
                table: "Comments",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "imageUrl",
                table: "Comments",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "tag",
                table: "Comments",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TeachScheduleId",
                table: "Classes",
                type: "text",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Subject",
                table: "Subject",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Permisstion",
                table: "Permisstion",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ExamSchedule",
                table: "ExamSchedule",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "LikePosts",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: true),
                    createdAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    createdBy = table.Column<string>(type: "text", nullable: false),
                    deletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deletedBy = table.Column<string>(type: "text", nullable: true),
                    emjoji = table.Column<string>(type: "text", nullable: false),
                    isDeleted = table.Column<bool>(type: "boolean", nullable: true),
                    postId = table.Column<string>(type: "text", nullable: false),
                    updatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LikePosts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LikePosts_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Posts",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    createdBy = table.Column<string>(type: "text", nullable: false),
                    facultyId = table.Column<string>(type: "text", nullable: true),
                    majorId = table.Column<string>(type: "text", nullable: true),
                    content = table.Column<string>(type: "text", nullable: false),
                    createdAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    deletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deletedBy = table.Column<string>(type: "text", nullable: true),
                    hashtag = table.Column<string>(type: "text", nullable: true),
                    imageUrl = table.Column<string>(type: "text", nullable: true),
                    isActive = table.Column<bool>(type: "boolean", nullable: false),
                    isDeleted = table.Column<bool>(type: "boolean", nullable: true),
                    likeCount = table.Column<int>(type: "integer", nullable: false),
                    status = table.Column<string>(type: "text", nullable: false),
                    tag = table.Column<string>(type: "text", nullable: false),
                    title = table.Column<string>(type: "text", nullable: false),
                    updatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedBy = table.Column<string>(type: "text", nullable: true),
                    videoUrl = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Posts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Posts_Faculties_facultyId",
                        column: x => x.facultyId,
                        principalTable: "Faculties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Posts_Majors_majorId",
                        column: x => x.majorId,
                        principalTable: "Majors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Posts_Users_createdBy",
                        column: x => x.createdBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TeachSchedule",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    classId = table.Column<string>(type: "text", nullable: false),
                    createdBy = table.Column<string>(type: "text", nullable: false),
                    lecturerId = table.Column<string>(type: "text", nullable: false),
                    subjectId = table.Column<string>(type: "text", nullable: false),
                    createdAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    deletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deletedBy = table.Column<string>(type: "text", nullable: true),
                    isDeleted = table.Column<bool>(type: "boolean", nullable: true),
                    numOfPeriods = table.Column<string>(type: "text", nullable: false),
                    room = table.Column<string>(type: "text", nullable: false),
                    teachDay = table.Column<string>(type: "text", nullable: false),
                    updatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedBy = table.Column<string>(type: "text", nullable: true)
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

            migrationBuilder.CreateTable(
                name: "SavedPosts",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    createdBy = table.Column<string>(type: "text", nullable: false),
                    postId = table.Column<string>(type: "text", nullable: false),
                    createdAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    deletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deletedBy = table.Column<string>(type: "text", nullable: true),
                    isDeleted = table.Column<bool>(type: "boolean", nullable: true),
                    type = table.Column<string>(type: "text", nullable: false),
                    updatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavedPosts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SavedPosts_Posts_postId",
                        column: x => x.postId,
                        principalTable: "Posts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SavedPosts_Users_createdBy",
                        column: x => x.createdBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Exams_courseId",
                table: "Exams",
                column: "courseId");

            migrationBuilder.CreateIndex(
                name: "IX_Exams_facultyId",
                table: "Exams",
                column: "facultyId");

            migrationBuilder.CreateIndex(
                name: "IX_Exams_majorId",
                table: "Exams",
                column: "majorId");

            migrationBuilder.CreateIndex(
                name: "IX_Classes_TeachScheduleId",
                table: "Classes",
                column: "TeachScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_LikePosts_UserId",
                table: "LikePosts",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Posts_createdBy",
                table: "Posts",
                column: "createdBy");

            migrationBuilder.CreateIndex(
                name: "IX_Posts_facultyId",
                table: "Posts",
                column: "facultyId");

            migrationBuilder.CreateIndex(
                name: "IX_Posts_majorId",
                table: "Posts",
                column: "majorId");

            migrationBuilder.CreateIndex(
                name: "IX_SavedPosts_createdBy",
                table: "SavedPosts",
                column: "createdBy");

            migrationBuilder.CreateIndex(
                name: "IX_SavedPosts_postId",
                table: "SavedPosts",
                column: "postId");

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
                name: "FK_Comments_Posts_postId",
                table: "Comments",
                column: "postId",
                principalTable: "Posts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ExamQuestions_Exams_examId",
                table: "ExamQuestions",
                column: "examId",
                principalTable: "Exams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Exams_Classes_classId",
                table: "Exams",
                column: "classId",
                principalTable: "Classes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Exams_Courses_courseId",
                table: "Exams",
                column: "courseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Exams_Faculties_facultyId",
                table: "Exams",
                column: "facultyId",
                principalTable: "Faculties",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Exams_Majors_majorId",
                table: "Exams",
                column: "majorId",
                principalTable: "Majors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Exams_Subject_SubjectId",
                table: "Exams",
                column: "SubjectId",
                principalTable: "Subject",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ExamSchedule_Classes_classId",
                table: "ExamSchedule",
                column: "classId",
                principalTable: "Classes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ExamSchedule_Exams_examId",
                table: "ExamSchedule",
                column: "examId",
                principalTable: "Exams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ExamSchedule_Subject_subjectId",
                table: "ExamSchedule",
                column: "subjectId",
                principalTable: "Subject",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ExamSchedule_Users_createdBy",
                table: "ExamSchedule",
                column: "createdBy",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ExamSchedule_Users_superVisoryId",
                table: "ExamSchedule",
                column: "superVisoryId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Lessons_Subject_SubjectId",
                table: "Lessons",
                column: "SubjectId",
                principalTable: "Subject",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Permisstion_Users_assignedUserId",
                table: "Permisstion",
                column: "assignedUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Permisstion_Users_createdBy",
                table: "Permisstion",
                column: "createdBy",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Subject_Classes_ClassId",
                table: "Subject",
                column: "ClassId",
                principalTable: "Classes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Subject_Faculties_facultyId",
                table: "Subject",
                column: "facultyId",
                principalTable: "Faculties",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Subject_Majors_majorId",
                table: "Subject",
                column: "majorId",
                principalTable: "Majors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Subject_Users_createdBy",
                table: "Subject",
                column: "createdBy",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
