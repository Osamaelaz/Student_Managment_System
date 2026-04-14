namespace API02.DTO
{
    public class CourseDTO
    {
        public int Crs_Id { get; set; }
        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.StringLength(50, MinimumLength = 2)]
        public string Crs_Name { get; set; } = string.Empty;

        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.Range(1, 1000)]
        public int? Crs_Duration { get; set; }

        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.Range(1, int.MaxValue)]
        public int? Top_Id { get; set; }
    }
}
