using System.ComponentModel.DataAnnotations;

namespace API02.DTO
{
    public class DepartmentCourseGradeDTO
    {
        [Range(0, 100)]
        public int Grade { get; set; }
    }
}
