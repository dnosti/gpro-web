using AutoMapper;
using gpro_web.Dtos;
using gpro_web.Helpers;
using gpro_web.Models;
using gpro_web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
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
    }
}
