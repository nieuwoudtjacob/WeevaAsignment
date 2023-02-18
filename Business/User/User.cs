using Business.Interfaces;

namespace Business.Library.User
{
    public class User : IUser
    {
        public Guid Id { get; }
        public string FirstName { get; private set; }
        public string LastName { get; private set; }
        public string Email { get; private set; }
        public string PhoneNumber { get; private set; }
        public string Designation { get; private set; }
        public string Password { get; private set; }

        public User(Guid id, string firstName, string lastName, string email, string? phoneNumber, string? designation, string password)
        {
            var valid = ValidateUserDetails(firstName, lastName, email, password);
            if (valid)
            {
                Id = id;
                FirstName = firstName;
                LastName = lastName;
                Email = email;
                PhoneNumber = phoneNumber;
                Designation = designation;
                Password = password;
            }
            else
            {
                throw new ArgumentException();
            }
        }

        private bool ValidateUserDetails(string firstName, string lastName, string email, string password = null)
        {
            if (firstName.Length < 1)
            {
                return false;
            }
            // ...
            // TODO: Further validation as per business logic. 
            return true;
        }

        public void UpdateDetails(string firstName, string lastName, string email, string? phoneNumber, string? designation)
        {
            var valid = ValidateUserDetails(firstName, lastName, email);
            if (valid)
            {
                this.FirstName = firstName;
                this.LastName = lastName;
                this.Email = email;
                this.PhoneNumber = phoneNumber;
                this.Designation = designation;
            }
            else
            {
                throw new ArgumentException();
            }
        }

        private void ResetUserPassword(string password)
        {
            //Sample function
        }
    }
}
