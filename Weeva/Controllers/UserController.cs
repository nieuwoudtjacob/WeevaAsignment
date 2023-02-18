using API.Models;
using Business.Interfaces;
using Business.Library.User;
using Microsoft.AspNetCore.Mvc;

namespace Weeva.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        UserService _userService;
        public UserController(UserService userService)
        {
            this._userService = userService;
        }

        [HttpGet]
        public IEnumerable<UserResponse> GetAll()
        {
            return _userService.GetAll().Select(x => Map(x));
        }

        [HttpGet("{id:Guid}")]
        public UserResponse Get(Guid id)
        {
            return Map(_userService.Get(id));
        }

        [HttpDelete("{id:Guid}")]
        public bool Delete(Guid id)
        {
            return _userService.DeleteUser(id);
        }

        [HttpPost()]
        public bool Add([FromBody] RegisterUserRequest request)
        {
            var user = new User(Guid.NewGuid(),
            request.FirstName,
            request.LastName,
            request.Email,
            request.PhoneNumber,
            request.Designation,
            request.Password);
            return _userService.SaveUser(user);
        }

        [HttpPut()]
        public bool Update([FromBody] UserResponse request)
        {
            var user = (User)_userService.Get(request.Id);
            user.UpdateDetails(request.FirstName, request.LastName, request.Email, request.PhoneNumber, request.Designation);
            return _userService.SaveUser(user);
        }

        [HttpPost("login")]
        public bool LoginRequest([FromBody] RegisterUserRequest request)
        {
            return _userService.LoginRequest(request.Email,request.Password);
        }

        private UserResponse Map(IUser user)
        {
            // Ideally we would use an automapper here. 
            var apiModel = new UserResponse();
            apiModel.Id = user.Id;
            apiModel.FirstName = user.FirstName;
            apiModel.LastName = user.LastName;
            apiModel.Email = user.Email;
            apiModel.Designation = user.Designation;
            apiModel.PhoneNumber = user.PhoneNumber;
            return apiModel;
        }
    }
}
