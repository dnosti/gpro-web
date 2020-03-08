using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using gpro_web.Models;
using gpro_web.Dtos;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;

namespace gpro_web.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class RolsController : ControllerBase
    {
        private readonly gpro_dbContext _context;
        private IMapper _mapper;

        public RolsController(gpro_dbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public ActionResult GetAll()
        {
            var rols = from e in _context.Rol
                            select e;

            var rolsDto = _mapper.Map<IList<RolDto>>(rols.ToList());
            return Ok(rolsDto);
        }
        
    }
}