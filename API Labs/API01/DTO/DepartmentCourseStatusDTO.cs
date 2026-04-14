namespace API02.DTO
{
    public class DepartmentCourseStatusDTO
    {
        public int Crs_Id { get; set; }
        public string Crs_Name { get; set; } = string.Empty;
        public int? Crs_Duration { get; set; }
        public int? Top_Id { get; set; }
        public bool IsAssigned { get; set; }
        public int AssignedStudentsCount { get; set; }
    }
}
