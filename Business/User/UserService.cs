using Business.Interfaces;

namespace Business.Library.User
{
    public class UserService
    {
        IUserRepository _repository;
        public UserService(IUserRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<IUser> GetAll()
        {
            return _repository.GetAll();
        }

        public IUser Get(Guid id)
        {
            return _repository.Get(id);
        }

        public bool SaveUser(IUser user)
        {
            var existing = (User)_repository.Get(user.Id);
            if (existing != null)
            {
                _repository.Update(user);
                return true;
            }
            else
            {
                _repository.Add(user);
                return true;
            }
        }

        public bool DeleteUser(Guid id)
        {
            var existing = (User)_repository.Get(id);
            if (existing != null)
            {
                _repository.Delete(id);
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool LoginRequest(string userName, string password)
        {
            return _repository.LoginRequest(userName, password);   
        }
    }
}
