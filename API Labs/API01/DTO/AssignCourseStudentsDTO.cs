namespace API02.DTO
{
    public class AssignCourseStudentsDTO
    {
        [System.ComponentModel.DataAnnotations.Range(1, int.MaxValue)]
        public int Crs_Id { get; set; }

        [System.ComponentModel.DataAnnotations.Range(1, int.MaxValue)]
        public int Dept_Id { get; set; }

        [System.ComponentModel.DataAnnotations.MinLength(1)]
        public List<int> Students { get; set; } = new();
    }
}
