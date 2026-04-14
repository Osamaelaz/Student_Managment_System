using Microsoft.AspNetCore.Identity;

namespace API02.Models
{
    public class ApplicationUser : IdentityUser<int>
    {
        public string? FullName { get; set; }
    }
}