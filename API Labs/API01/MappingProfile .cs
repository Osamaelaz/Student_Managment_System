using API02.DTO;
using API02.Models;
using AutoMapper;

namespace API02.Mapping
{
    /// <summary>
    /// AutoMapper profile configuration for API DTO mappings.
    /// </summary>
    public class MappingProfile : Profile
    {
        /// <summary>
        /// Initializes profile maps.
        /// </summary>
        public MappingProfile()
        {
            CreateMap<Student, StudentDTO>()
                .ForMember(dest => dest.Dept_Name,
                    opt => opt.MapFrom(src => src.Dept != null ? src.Dept.Dept_Name : null))
                .ForMember(dest => dest.Grades,
                    opt => opt.MapFrom(src => src.Stud_Courses.OrderBy(sc => sc.Crs_Id)));

            CreateMap<Stud_Course, StudentCourseGradeDTO>()
                .ForMember(dest => dest.Crs_Name,
                    opt => opt.MapFrom(src => src.Crs != null ? src.Crs.Crs_Name : string.Empty));

            CreateMap<StudentDTO, Student>()
                .ForMember(dest => dest.St_Id, opt => opt.Ignore())
                .ForMember(dest => dest.Dept, opt => opt.Ignore())
                .ForMember(dest => dest.St_super, opt => opt.Ignore())
                .ForMember(dest => dest.St_superNavigation, opt => opt.Ignore())
                .ForMember(dest => dest.Stud_Courses, opt => opt.Ignore())
                .ForMember(dest => dest.InverseSt_superNavigation, opt => opt.Ignore());

            CreateMap<Department, DepartmentDTO>();
            CreateMap<DepartmentDTO, Department>().ForMember(dest => dest.Dept_Id, opt => opt.Ignore());
        }
    }
}