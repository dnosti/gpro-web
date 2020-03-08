using Microsoft.AspNetCore.Mvc;
using gpro_web.Dtos;
using gpro_web.Helpers;
using gpro_web.Models;
using gpro_web.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authorization;

namespace gpro_web.Controllers
{
    
    [ApiController]
    [Route("[controller]")]
    public class EscalasController : ControllerBase
    {
        private IEscalasService _escalasService;
        private IMapper _mapper;
        private readonly AppSettings _appSettings;
        private readonly gpro_dbContext _context;

        public EscalasController(
            IEscalasService escalasService,
            IMapper mapper,
            IOptions <AppSettings> appSettings,
            gpro_dbContext context)
        {
            _escalasService = escalasService;
            _mapper = mapper;
            _appSettings = appSettings.Value;
            _context = context;
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("escalaPerfiles")]
        public IActionResult GetEscalaPerfiles()
        {
            var escalaPerfiles = _escalasService.GetEscalaPerfiles();

            if (escalaPerfiles == null)
            {
                return NotFound();
            }

            var escalaPerfilesDto = _mapper.Map<IList<EscalaPerfilesDto>>(escalaPerfiles);

            return Ok(escalaPerfilesDto);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("escalaHoras")]
        public IActionResult GetEscalaHoras()
        {
            var escalaHoras = _escalasService.GetEscalaHoras();

            if (escalaHoras == null)
            {
                return NotFound();
            }

            var escalaHorasDto = _mapper.Map<IList<EscalaHorasDto>>(escalaHoras);

            return Ok(escalaHorasDto);
        }
    }
}
