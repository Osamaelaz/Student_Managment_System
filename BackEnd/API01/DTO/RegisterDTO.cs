namespace API02.DTO
{
    public class RegisterDTO
    {
        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.StringLength(50, MinimumLength = 3)]
        public string UserName { get; set; } = string.Empty;

        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.EmailAddress]
        public string Email { get; set; } = string.Empty;

        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.MinLength(6)]
        public string Password { get; set; } = string.Empty;

        [System.ComponentModel.DataAnnotations.StringLength(100, MinimumLength = 3)]
        public string? FullName { get; set; }
    }
}