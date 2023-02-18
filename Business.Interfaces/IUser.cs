namespace Business.Interfaces
{
    public interface IUser
    {
        public Guid Id { get; }
        public string FirstName { get; }
        public string LastName { get; }
        public string Email { get; }
        public string PhoneNumber { get; }
        public string Designation { get; }
        public string Password { get; }
    }
}