using Data.Library.User;
using Microsoft.EntityFrameworkCore;


namespace Data.Library
{
    public class dbContext : DbContext
    {
        public DbSet<User.User> Users { get; set; }

        public dbContext(DbContextOptions<dbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User.User>().HasData(
                new User.User { 
                    Id = Guid.NewGuid(),
                    FirstName = "Admin", 
                    LastName = "Admin",
                    Email = "Admin@Admin.com",
                    PhoneNumber = "1234567890",
                    Designation = "CEO",
                    Password = "Admin"           
                }
                );
            base.OnModelCreating(modelBuilder);

        }
    }
}
