namespace API02.DTO
{
    /// <summary>
    /// Data transfer object for student resources.
    /// </summary>
    public class StudentDTO
    {
        /// <summary>
        /// Student identifier.
        /// </summary>
        public int St_Id { get; set; }

        /// <summary>
        /// Student first name.
        /// </summary>
        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.StringLength(50, MinimumLength = 2)]
        public string St_Fname { get; set; } = string.Empty;

        /// <summary>
        /// Student last name.
        /// </summary>
        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.StringLength(50, MinimumLength = 2)]
        public string St_Lname { get; set; } = string.Empty;

        /// <summary>
        /// Student address.
        /// </summary>
        [System.ComponentModel.DataAnnotations.StringLength(100)]
        public string? St_Address { get; set; }

        /// <summary>
        /// Student age.
        /// </summary>
        [System.ComponentModel.DataAnnotations.Range(1, 120)]
        public int? St_Age { get; set; }

        /// <summary>
        /// Department identifier.
        /// </summary>
        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.Range(1, int.MaxValue)]
        public int? Dept_Id { get; set; }

        /// <summary>
        /// Department display name.
        /// </summary>
        public string? Dept_Name { get; set; }

        /// <summary>
        /// Full grade details for all assigned courses.
        /// </summary>
        public List<StudentCourseGradeDTO> Grades { get; set; } = new();
    }
}