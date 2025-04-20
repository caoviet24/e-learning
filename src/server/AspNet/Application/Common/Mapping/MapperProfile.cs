using Application.Courses.Commands;
using Application.Faculties.Commands;
using Application.Lecturers.Commands;
using Application.Lessons.Commands;
using Application.Majors.Commands;
using AutoMapper;
using Domain.Entites;

namespace Application.Common.Mapping
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<CreateLessonCommand, Lesson>();

            CreateMap<User, MySeftDto>()
                .ForMember(dest => dest.StudentProfile, opt => opt.MapFrom(src => src.Student))
                .ForMember(dest => dest.LecturerProfile, opt => opt.MapFrom(src => src.Lecturer));
            CreateMap<MySeftDto, User>();

            CreateMap<User, UserDto>()
                .ForMember(dest => dest.StudentProfile, opt => opt.MapFrom(src => src.Student))
                .ForMember(dest => dest.LecturerProfile, opt => opt.MapFrom(src => src.Lecturer));
            CreateMap<UserDto, User>();
            CreateMap<StudentProfileDto, Student>();
            CreateMap<Student, StudentProfileDto>();
            CreateMap<LecturerProfileDto, Lecturer>();
            CreateMap<Lecturer, LecturerProfileDto>();

            CreateMap<Faculty, FacultyDto>();
            CreateMap<FacultyDto, Faculty>();
            CreateMap<CreateFacultyCommand, Faculty>();
            CreateMap<UpdateFacultyCommand, Faculty>();


            CreateMap<Domain.Entites.Major, MajorDto>();
            CreateMap<MajorDto, Domain.Entites.Major>();
            CreateMap<MajorDtoWithFaculty, Domain.Entites.Major>();
            CreateMap<Domain.Entites.Major, MajorDtoWithFaculty>();
            CreateMap<CreateMajorCommand, Domain.Entites.Major>();

            CreateMap<Lecturer, LecturerDto>();
            CreateMap<LecturerDto, Lecturer>();
            CreateMap<CreateLecturerCommand, Lecturer>();
            CreateMap<CreateLecturerCommand, User>();
            CreateMap<Lecturer, User>();

            CreateMap<Course, CourseDto>();
            CreateMap<CourseDto, Course>();
            CreateMap<CreateCourseCommand, Course>();
            CreateMap<Course, CourseWithAuthorDto>()
                .ForMember(dest => dest.author, opt => opt.MapFrom(src => src.User));
            CreateMap<CourseWithAuthorDto, Course>();
            CreateMap<UpdateCourseCommand, Course>();


        }
    }
}