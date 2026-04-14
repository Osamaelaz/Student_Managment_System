namespace API02.DTO
{
    public class DepartmentDTO
    {
        public int Dept_Id { get; set; }
        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.StringLength(50, MinimumLength = 2)]
        public string Dept_Name { get; set; } = string.Empty;
        [System.ComponentModel.DataAnnotations.StringLength(200)]
        public string? Dept_Desc { get; set; }
        [System.ComponentModel.DataAnnotations.StringLength(100)]
        public string? Dept_Location { get; set; }
        //public int? Dept_Manager { get; set; }
    }
}