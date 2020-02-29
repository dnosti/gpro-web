using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using gpro_web.Models;
using Microsoft.AspNetCore.Authorization;
using gpro_web.Services;
using gpro_web.Helpers;
using AutoMapper;
using Microsoft.Extensions.Options;
using gpro_web.Dtos;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

namespace gpro_web.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class UsuariosController : ControllerBase
    {
        private IUsuarioService _userService;
        private IMapper _mapper;
        private readonly AppSettings _appSettings;

        public UsuariosController(
            IUsuarioService userService,
            IMapper mapper,
            IOptions<AppSettings> appSettings)
        {
            _userService = userService;
            _mapper = mapper;
            _appSettings = appSettings.Value;
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody]UserDto userDto)
        {
            var user = _userService.Authenticate(userDto.Username, userDto.Password);

            if (user == null)
                return BadRequest(new { message = "Username or password is incorrect" });

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Id.ToString()),
                    new Claim(ClaimTypes.Role, user.IdRolNavigation.Rol1),
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            // return basic user info (without password) and token to store client side
            return Ok(new
            {
                Id = user.Id,
                Username = user.Username,
                IdRol = user.IdRol,
                Rol = user.IdRolNavigation.Rol1,
                IdEmpleado = user.IdEmpleado,
                Token = tokenString
            });
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register([FromBody]UserDto userDto)
        {
            // map dto to entity
            var user = _mapper.Map<Usuario>(userDto);

            try
            {
                // save 
                _userService.Create(user, userDto.Password);
                return Ok();
            }
            catch (AppException ex)
            {
                // return error message if there was an exception
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize (Roles = "Admin, PM")]
        [HttpGet]
        public IActionResult GetAll()
        {
            var users = _userService.GetAll();
            var userDtos = _mapper.Map<IList<UserDto>>(users);
            return Ok(userDtos);
        }

        //[Authorize (Roles = "Admin")]
        [AllowAnonymous]
        [HttpGet("apynom/{dato}")]
        public IActionResult GetByApyNom([FromRoute] string dato)
        {
            var users = _userService.GetByDato(dato);
            var usersDto = _mapper.Map<IList<UserEmplDto>>(users);
            if (usersDto.Count() == 0)
            {
                return NotFound();
            }
            return Ok(usersDto);
        }

        [AllowAnonymous]
        [HttpGet("dni/{dni}")]
        public IActionResult GetByDni(int dni)
        {
            var user = _userService.GetByDni(dni);
            var usersDto = _mapper.Map<IList<UserEmplDto>>(user);

            if (usersDto.Count() == 0)
            {
                return NotFound();
            }

            return Ok(usersDto);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var user = _userService.GetById(id);

            /* agregado -> revisar */
            //if (user == null)
            //{
            //    return NotFound();
            //}


            // only allow admins to access other user records
            //var currentUserId = int.Parse(User.Identity.Name);
            //if (id != currentUserId && !User.IsInRole(Role.Admin))
            //{
            //    return Forbid();
            //}
            /* ******** */

            var userDto = _mapper.Map<UserDto>(user);
            return Ok(userDto);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody]UserDto userDto)
        {
            // map dto to entity and set id
            var user = _mapper.Map<Usuario>(userDto);
            user.Id = id;

            try
            {
                // save
                _userService.Update(user, userDto.Password);
                return Ok();
            }
            catch (AppException ex)
            {
                // return error message if there was an exception
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                _userService.Delete(id);
                return Ok();
            }catch (AppException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            
        }
    }
}