using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDb7 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Exams",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    title = table.Column<string>(type: "text", nullable: false),
                    courseId = table.Column<string>(type: "text", nullable: true),
                    classId = table.Column<string>(type: "text", nullable: true),
                    majorId = table.Column<string>(type: "text", nullable: true),
                    facultyId = table.Column<string>(type: "text", nullable: true),
                    testerId = table.Column<string>(type: "text", nullable: true),
                    isActive = table.Column<bool>(type: "boolean", nullable: false),
                    duration = table.Column<int>(type: "integer", nullable: false),
                    totalQuestion = table.Column<int>(type: "integer", nullable: false),
                    startTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    endTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
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
                    table.PrimaryKey("PK_Exams", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Exams_Classes_classId",
                        column: x => x.classId,
                        principalTable: "Classes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Exams_Courses_courseId",
                        column: x => x.courseId,
                        principalTable: "Courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Exams_Faculties_facultyId",
                        column: x => x.facultyId,
                        principalTable: "Faculties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Exams_Majors_majorId",
                        column: x => x.majorId,
                        principalTable: "Majors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Exams_Users_createdBy",
                        column: x => x.createdBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Exams_Users_testerId",
                        column: x => x.testerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "LikePosts",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    postId = table.Column<string>(type: "text", nullable: false),
                    emjoji = table.Column<string>(type: "text", nullable: false),
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
                    title = table.Column<string>(type: "text", nullable: false),
                    content = table.Column<string>(type: "text", nullable: false),
                    imageUrl = table.Column<string>(type: "text", nullable: true),
                    videoUrl = table.Column<string>(type: "text", nullable: true),
                    status = table.Column<string>(type: "text", nullable: false),
                    isActive = table.Column<bool>(type: "boolean", nullable: false),
                    likeCount = table.Column<int>(type: "integer", nullable: false),
                    tag = table.Column<string>(type: "text", nullable: false),
                    hashtag = table.Column<string>(type: "text", nullable: true),
                    facultyId = table.Column<string>(type: "text", nullable: true),
                    majorId = table.Column<string>(type: "text", nullable: true),
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
                name: "ExamQuestions",
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
                    examId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExamQuestions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExamQuestions_Exams_examId",
                        column: x => x.examId,
                        principalTable: "Exams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ExamResultsByUser",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    examId = table.Column<string>(type: "text", nullable: false),
                    score = table.Column<double>(type: "double precision", nullable: false),
                    duration = table.Column<double>(type: "double precision", nullable: false),
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
                    table.PrimaryKey("PK_ExamResultsByUser", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExamResultsByUser_Exams_examId",
                        column: x => x.examId,
                        principalTable: "Exams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ExamResultsByUser_Users_createdBy",
                        column: x => x.createdBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Comments",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    content = table.Column<string>(type: "text", nullable: false),
                    imageUrl = table.Column<string>(type: "text", nullable: false),
                    likeCount = table.Column<int>(type: "integer", nullable: false),
                    tag = table.Column<string>(type: "text", nullable: false),
                    postId = table.Column<string>(type: "text", nullable: false),
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
                    table.PrimaryKey("PK_Comments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Comments_Posts_postId",
                        column: x => x.postId,
                        principalTable: "Posts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Comments_Users_createdBy",
                        column: x => x.createdBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SavedPosts",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    postId = table.Column<string>(type: "text", nullable: false),
                    type = table.Column<string>(type: "text", nullable: false),
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

            migrationBuilder.CreateTable(
                name: "ReplyComments",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    content = table.Column<string>(type: "text", nullable: false),
                    imageUrl = table.Column<string>(type: "text", nullable: false),
                    likeCount = table.Column<int>(type: "integer", nullable: false),
                    tag = table.Column<string>(type: "text", nullable: false),
                    receiverId = table.Column<string>(type: "text", nullable: false),
                    commentId = table.Column<string>(type: "text", nullable: false),
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
                    table.PrimaryKey("PK_ReplyComments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReplyComments_Comments_commentId",
                        column: x => x.commentId,
                        principalTable: "Comments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ReplyComments_Users_createdBy",
                        column: x => x.createdBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ReplyComments_Users_receiverId",
                        column: x => x.receiverId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Comments_createdBy",
                table: "Comments",
                column: "createdBy");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_postId",
                table: "Comments",
                column: "postId");

            migrationBuilder.CreateIndex(
                name: "IX_ExamQuestions_examId",
                table: "ExamQuestions",
                column: "examId");

            migrationBuilder.CreateIndex(
                name: "IX_ExamResultsByUser_createdBy",
                table: "ExamResultsByUser",
                column: "createdBy");

            migrationBuilder.CreateIndex(
                name: "IX_ExamResultsByUser_examId",
                table: "ExamResultsByUser",
                column: "examId");

            migrationBuilder.CreateIndex(
                name: "IX_Exams_classId",
                table: "Exams",
                column: "classId");

            migrationBuilder.CreateIndex(
                name: "IX_Exams_courseId",
                table: "Exams",
                column: "courseId");

            migrationBuilder.CreateIndex(
                name: "IX_Exams_createdBy",
                table: "Exams",
                column: "createdBy");

            migrationBuilder.CreateIndex(
                name: "IX_Exams_facultyId",
                table: "Exams",
                column: "facultyId");

            migrationBuilder.CreateIndex(
                name: "IX_Exams_majorId",
                table: "Exams",
                column: "majorId");

            migrationBuilder.CreateIndex(
                name: "IX_Exams_testerId",
                table: "Exams",
                column: "testerId");

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
                name: "IX_ReplyComments_commentId",
                table: "ReplyComments",
                column: "commentId");

            migrationBuilder.CreateIndex(
                name: "IX_ReplyComments_createdBy",
                table: "ReplyComments",
                column: "createdBy");

            migrationBuilder.CreateIndex(
                name: "IX_ReplyComments_receiverId",
                table: "ReplyComments",
                column: "receiverId");

            migrationBuilder.CreateIndex(
                name: "IX_SavedPosts_createdBy",
                table: "SavedPosts",
                column: "createdBy");

            migrationBuilder.CreateIndex(
                name: "IX_SavedPosts_postId",
                table: "SavedPosts",
                column: "postId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ExamQuestions");

            migrationBuilder.DropTable(
                name: "ExamResultsByUser");

            migrationBuilder.DropTable(
                name: "LikePosts");

            migrationBuilder.DropTable(
                name: "ReplyComments");

            migrationBuilder.DropTable(
                name: "SavedPosts");

            migrationBuilder.DropTable(
                name: "Exams");

            migrationBuilder.DropTable(
                name: "Comments");

            migrationBuilder.DropTable(
                name: "Posts");
        }
    }
}
