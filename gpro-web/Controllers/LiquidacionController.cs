using AutoMapper;
using gpro_web.Dtos;
using gpro_web.Helpers;
using gpro_web.Models;
using gpro_web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;

namespace gpro_web.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class LiquidacionController : ControllerBase
    {
        private ILiquidacionService _liquidacionService;
        private readonly gpro_dbContext _context;
        private IMapper _mapper;
        private readonly AppSettings _appSetings;

        public LiquidacionController(gpro_dbContext context, IMapper mapper,
            IOptions<AppSettings> appSettings, ILiquidacionService liquidacionService)
        {
            _liquidacionService = liquidacionService;
            _context = context;
            _appSetings = appSettings.Value;
            _mapper = mapper;
        }

        // GET: Liquidacion
        [Authorize(Roles = "Admin, PM, Member")]
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_mapper.Map<IList<LiquidacionDto>>(_liquidacionService.GetAll()));
        }

        // GET: Liquidacion
        [Authorize(Roles = "Admin, PM, Member")]
        [HttpGet("{id}")]
        public IActionResult GetLiquidacion([FromRoute]int id)
        {
            return Ok(_mapper.Map<LiquidacionDto>(_liquidacionService.GetLiquidacion(id)));
        }

        [Authorize(Roles = "Admin, PM")]
        [HttpGet("porFecha/{inicio}/{fin}")]
        public IActionResult LiqPorFecha([FromRoute] String inicio, [FromRoute] String fin)
        {
            var datos = _liquidacionService.GetLiquidacionesPorFecha(DateTime.ParseExact(inicio, "yyyyMMdd", CultureInfo.InvariantCulture, DateTimeStyles.None), DateTime.ParseExact(fin, "yyyyMMdd", CultureInfo.InvariantCulture, DateTimeStyles.None));

            return Ok(datos);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public IActionResult NuevaLiquidacion([FromBody]LiquidacionDto liquidacionDto)
        {
            try
            {
                _liquidacionService.NuevaLiquidacion(_mapper.Map<Liquidacion>(liquidacionDto));
                return Ok();
            }
            catch(AppException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpPut("update")]
        public async Task<IActionResult> UpdateLiq([FromBody]LiquidacionDto liquidacionDto)
        {
            var liquidacion = _mapper.Map<Liquidacion>(liquidacionDto);

            try
            {
                await _liquidacionService.UpdateLiq(liquidacion);
                return Ok(liquidacionDto);
            }
            catch(AppException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("informe/{inicio}/{fin}")]
        public IActionResult GenerarInforme(String inicio, String fin)
        {
            var informe = _liquidacionService.InformeDtos(DateTime.Parse(inicio, null, DateTimeStyles.RoundtripKind),
                DateTime.Parse(fin, null, DateTimeStyles.RoundtripKind));

            return Ok(informe);
        }
    }
}
