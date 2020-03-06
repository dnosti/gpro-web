using AutoMapper;
using gpro_web.Dtos;
using gpro_web.Helpers;
using gpro_web.Models;
using gpro_web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Globalization;

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
        [HttpGet("{id}")]
        public IActionResult GetLiquidacion([FromRoute]int id)
        {
            return Ok(_liquidacionService.GetLiquidacion(id));
        }

        [HttpGet("porFecha/{inicio}/{fin}")]
        public IActionResult LiqPorFecha([FromRoute] String inicio, [FromRoute] String fin)
        {
            var datos = _liquidacionService.GetLiquidacionesPorFecha(DateTime.ParseExact(inicio, "yyyyMMdd", CultureInfo.InvariantCulture, DateTimeStyles.None), DateTime.ParseExact(fin, "yyyyMMdd", CultureInfo.InvariantCulture, DateTimeStyles.None));

            return Ok(datos);
        }

        [HttpPost]
        public IActionResult NuevaLiquidacion([FromBody]LiquidacionDto liquidacionDto)
        {
            _liquidacionService.NuevaLiquidacion(_mapper.Map<Liquidacion>(liquidacionDto));
            return Ok();
        }
    }
}
