using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using gpro_web.Models;
using AutoMapper;
using gpro_web.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace gpro_web.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PerfilesController : ControllerBase
    {
        private readonly gpro_dbContext _context;
        private IMapper _mapper;

        public PerfilesController(gpro_dbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: /Perfiles
        [Authorize(Roles = "Admin, PM")]
        [HttpGet]
        public IActionResult GetPerfil()
        {
            var perfiles = from b in _context.Perfil
                                  select b;

            var perfilesDto = _mapper.Map<IList<PerfilDto>>(perfiles.ToList());
            return Ok(perfilesDto);
        }
    }
}