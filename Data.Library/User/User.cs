using System.ComponentModel.DataAnnotations;

namespace Data.Library.User
{
    public class User
    {
        [Key]
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Designation { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;

    }
}
