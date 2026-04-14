namespace API02.DTO
{
    public class LoginDTO
    {
        [System.ComponentModel.DataAnnotations.Required]
        public string UserName { get; set; } = string.Empty;

        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.MinLength(6)]
        public string Password { get; set; } = string.Empty;
    }
}