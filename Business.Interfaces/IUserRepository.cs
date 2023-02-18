namespace Business.Interfaces
{
    public interface IUserRepository
    {
        IEnumerable<IUser> GetAll();
        IUser Get(Guid id);
        IUser Add(IUser user);
        IUser Update(IUser user);
        bool Delete(Guid id);
        bool LoginRequest(string username, string password);

    }
}