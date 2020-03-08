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
using Microsoft.AspNetCore.Authorization;

namespace gpro_web.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ProyectosController : ControllerBase
    {
        private readonly gpro_dbContext _context;
        private IMapper _mapper;

        public ProyectosController(gpro_dbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Proyectos
        [Authorize(Roles = "Admin, PM, Member")]
        [HttpGet]
        public IActionResult GetProyecto()
        {
            var proyectos = from b in _context.Proyecto
                           select b;

            var proyectosDto = _mapper.Map<IList<ProyectoDto>>(proyectos.ToList());
            return Ok(proyectosDto);
        }

        // GET: api/Proyectos/5
        [HttpGet("{id}")]
        public IActionResult GetProyecto([FromRoute] int id)
        {
            var proyectos = from b in _context.Proyecto
                            where b.IdEmpleadoPm.Equals(id)
                            select b;

            var proyectosDto = _mapper.Map<IList<ProyectoDto>>(proyectos.ToList());
            return Ok(proyectosDto);
        }

        // PUT: api/Proyectos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProyecto([FromRoute] int id, [FromBody] Proyecto proyecto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != proyecto.IdProyecto)
            {
                return BadRequest();
            }

            _context.Entry(proyecto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProyectoExists(id))
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

        // POST: api/Proyectos
        [HttpPost]
        public async Task<IActionResult> PostProyecto([FromBody] Proyecto proyecto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Proyecto.Add(proyecto);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProyecto", new { id = proyecto.IdProyecto }, proyecto);
        }

        // DELETE: api/Proyectos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProyecto([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var proyecto = await _context.Proyecto.FindAsync(id);
            if (proyecto == null)
            {
                return NotFound();
            }

            _context.Proyecto.Remove(proyecto);
            await _context.SaveChangesAsync();

            return Ok(proyecto);
        }

        private bool ProyectoExists(int id)
        {
            return _context.Proyecto.Any(e => e.IdProyecto == id);
        }

        [HttpGet ("porEstado/{estado}")]
        public IActionResult ProyectosPorEstado(string estado)
        {
            var proyectos = from b in _context.Proyecto
                            where b.EstadoProyecto == estado
                            select b;

            if (proyectos.ToList().Count() == 0)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<IList<ProyectoDto>>(proyectos.ToList()));
        }

        [HttpGet("porTitulo/{titulo}")]
        public IActionResult ProyectosPorTitulo(string titulo)
        {
            var proyectos = from b in _context.Proyecto
                            where b.TituloProyecto.Contains(titulo)
                            select b;

            if (proyectos.ToList().Count() == 0)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<IList<ProyectoDto>>(proyectos.ToList()));
        }
    }
}