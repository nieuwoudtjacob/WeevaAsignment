using Business.Interfaces;

namespace Data.Library.User
{
    public class UserRepository : IUserRepository
    {
        dbContext _context;
        public UserRepository(dbContext context)
        {
            _context = context;
        }

        public IUser Get(Guid id)
        {
            var dataUser = _context.Users.Find(id);
            if (dataUser != null)
            {
                return Map(dataUser);
            }
            else
            {
                return null;
            }
        }

        public IEnumerable<IUser> GetAll()
        {
            var result = new List<Business.Library.User.User>();
            foreach (var user in _context.Users)
            {
                result.Add(Map(user));
            }
            return result;
        }

        public IUser Add(IUser user)
        {
            var dataUser = new User();
            dataUser.Id = user.Id;
            dataUser.FirstName = user.FirstName;
            dataUser.LastName = user.LastName;
            dataUser.Email = user.Email;
            dataUser.PhoneNumber = user.PhoneNumber;
            dataUser.Designation = user.Designation;
            dataUser.Password = user.Password;
            _context.Users.Add(dataUser);
            _context.SaveChanges();
            return Map(dataUser);
        }

        public IUser Update(IUser user)
        {
            var currentUser = _context.Users.FirstOrDefault(x => x.Id == user.Id);
            currentUser.FirstName = user.FirstName;
            currentUser.LastName = user.LastName;
            currentUser.Email = user.Email;
            currentUser.PhoneNumber = user.PhoneNumber;
            currentUser.Designation = user.Designation;
            _context.SaveChanges();
            return Map(currentUser);
        }

        public bool Delete(Guid id)
        {
            var currentUser = _context.Users.FirstOrDefault(x => x.Id == id);
            _context.Users.Remove(currentUser);
            _context.SaveChanges();
            return true;
        }

        public bool LoginRequest(string userName, string password)
        {
            var currentUser = _context.Users.FirstOrDefault(x => x.Email == userName && x.Password == password);
            if(currentUser != null)
            {
                return true;
            }
            return false;
        }

        public Business.Library.User.User Map(User user)
        {
            // Ideally we would use an automapper here. 
            return new Business.Library.User.User(user.Id, user.FirstName, user.LastName, user.Email, user.PhoneNumber, user.Designation, user.Password);
        }      
    }
}
