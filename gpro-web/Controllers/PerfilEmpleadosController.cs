using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using gpro_web.Models;
using AutoMapper;
using gpro_web.Dtos;

namespace gpro_web.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PerfilEmpleadosController : ControllerBase
    {
        private readonly gpro_dbContext _context;
        private IMapper _mapper;

        public PerfilEmpleadosController(gpro_dbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/PerfilEmpleados
        [HttpGet]
        public IActionResult GetPerfilEmpleados()
        {
            var perfilEmpleados = from b in _context.PerfilEmpleado
                                  select b;

            var perfilEmpleadosDto = _mapper.Map<IList<PerfilEmpleadoDto>>(perfilEmpleados.ToList());
            return Ok(perfilEmpleadosDto);
        }

        // POST: api/PerfilEmpleados
        [HttpPost]
        public async Task<IActionResult> PostPerfilEmpleado([FromBody] PerfilEmpleado perfilEmpleado)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.PerfilEmpleado.Add(perfilEmpleado);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PerfilEmpleadoExists(perfilEmpleado.PerfilEmpleadoIdPerfil))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPerfilEmpleado", new { id = perfilEmpleado.PerfilEmpleadoIdPerfil }, perfilEmpleado);
        }

        // DELETE: api/PerfilEmpleados/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePerfilEmpleado([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var perfilEmpleado = await _context.PerfilEmpleado.FindAsync(id);
            if (perfilEmpleado == null)
            {
                return NotFound();
            }

            _context.PerfilEmpleado.Remove(perfilEmpleado);
            await _context.SaveChangesAsync();

            return Ok(perfilEmpleado);
        }

        private bool PerfilEmpleadoExists(int id)
        {
            return _context.PerfilEmpleado.Any(e => e.PerfilEmpleadoIdPerfil == id);
        }
    }
}