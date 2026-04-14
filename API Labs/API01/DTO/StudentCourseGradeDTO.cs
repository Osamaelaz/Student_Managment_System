namespace API02.DTO
{
    public class StudentCourseGradeDTO
    {
        public int Crs_Id { get; set; }
        public string Crs_Name { get; set; } = string.Empty;
        public int? Grade { get; set; }
    }
}