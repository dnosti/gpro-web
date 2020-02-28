using System;
using gpro_web.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using gpro_web.Models;
using gpro_web.Dtos;
using AutoMapper;
using gpro_web.Helpers;
using Microsoft.Extensions.Options;
using System.Globalization;

namespace gpro_web.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class HoraTrabajadasController : ControllerBase
    {
        private IHoraTrabajadaService _horaTrabajadaService;
        private readonly gpro_dbContext _context;
        private IMapper _mapper;
        private readonly AppSettings _appSettings;

        public HoraTrabajadasController(gpro_dbContext context, IMapper mapper,
            IOptions<AppSettings> appSettings, IHoraTrabajadaService horaTrabajadaService)
        {
            _horaTrabajadaService = horaTrabajadaService;
            _context = context;
            _mapper = mapper;
            _appSettings = appSettings.Value;

        }

        // GET: HoraTrabajadas
        [HttpGet]
        public IActionResult GetHoraTrabajadaProy()
        {
            var datos = _horaTrabajadaService.HorasPorProyecto();
            
            return Ok(datos);
        }

        [HttpGet("{id}/{inicio}/{fin}")]
        public IActionResult GetHoraTrabajadaRec([FromRoute] int id, [FromRoute] String inicio, [FromRoute] String fin)
        {
            var datos = _horaTrabajadaService.HorasPorRecurso(id, DateTime.ParseExact(inicio, "yyyyMMdd", CultureInfo.InvariantCulture, DateTimeStyles.None), DateTime.ParseExact(fin, "yyyyMMdd", CultureInfo.InvariantCulture, DateTimeStyles.None));

            return Ok(datos);
        }

        // GET: HoraTrabajadas/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetHoraTrabajada([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var horaTrabajada = _mapper.Map<HoraTrabajadasDto>(await _context.HoraTrabajada.FindAsync(id));

            if (horaTrabajada == null)
            {
                return NotFound();
            }

            return Ok(horaTrabajada);
        }

        // PUT: HoraTrabajadas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHoraTrabajada([FromRoute] int id, [FromBody] HoraTrabajada horaTrabajada)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != horaTrabajada.ProyectoIdProyecto)
            {
                return BadRequest();
            }

            _context.Entry(horaTrabajada).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HoraTrabajadaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: HoraTrabajadas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHoraTrabajada([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var horaTrabajada = await _context.HoraTrabajada.FindAsync(id);
            if (horaTrabajada == null)
            {
                return NotFound();
            }

            _context.HoraTrabajada.Remove(horaTrabajada);
            await _context.SaveChangesAsync();

            return Ok(horaTrabajada);
        }

        private bool HoraTrabajadaExists(int id)
        {
            return _context.HoraTrabajada.Any(e => e.ProyectoIdProyecto == id);
        }

        [HttpGet("porProy/{id}")]
        public IActionResult HorasAdeudPorProy([FromRoute] int id)
        {
            return Ok(_horaTrabajadaService.HorasByProyecto(id));
        }

        [HttpPut("estado")]
        public IActionResult PagarHoras([FromBody] int idEmpleado, String inicio, String fin)
        {
            _horaTrabajadaService.PagarHoras(idEmpleado, 
                DateTime.ParseExact(inicio, "yyyyMMdd", CultureInfo.InvariantCulture, DateTimeStyles.None), 
                DateTime.ParseExact(fin, "yyyyMMdd", CultureInfo.InvariantCulture, DateTimeStyles.None));
            
            return Ok(); 
        }

        [HttpPost]
        public IActionResult PostHoraTrabajada([FromBody] HoraTrabajadasDto horaTrabajada)
        {
            var horas = _mapper.Map<HoraTrabajada>(horaTrabajada);
            return Ok(_horaTrabajadaService.CargaHorasEmpl(horas));
        }
    }
}