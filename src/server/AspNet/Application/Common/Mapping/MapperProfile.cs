using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.DTOs;
using Application.Courses.Commands.Create;
using Application.Courses.Commands.Update;
using Application.Faculties.Commands.CreateFaculty;
using Application.Faculties.Commands.UpdateFaculty;
using Application.Lecturers.Commands.Create;
using Application.Major.Commands.Create;
using AutoMapper;
using Domain.Entites;

namespace Application.Common.Mapping
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();

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