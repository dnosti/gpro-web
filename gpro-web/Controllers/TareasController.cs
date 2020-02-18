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
using gpro_web.Helpers;

namespace gpro_web.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class TareasController : ControllerBase
    {
        private readonly gpro_dbContext _context;
        private IMapper _mapper;

        public TareasController(gpro_dbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetTareas()
        {
            var tareas = from b in _context.Tarea
                         select b;

            var tareasDto = _mapper.Map<IList<TareasDto>>(tareas.ToList());
            return Ok(tareasDto);
        }

        [HttpGet("{id}")]
        public IActionResult GetTareasByEmpleado([FromRoute] int id)
        {
            var tareas = from b in _context.Tarea
                         where b.PerfilEmpleadoIdEmpleado.Equals(id)
                         select b;

            var tareasDto = _mapper.Map<IList<TareasDto>>(tareas.ToList());
            return Ok(tareasDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTarea([FromRoute] int id, [FromBody] Tarea tarea)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tarea.ProyectoIdProyecto)
            {
                return BadRequest();
            }

            _context.Entry(tarea).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TareaExists(id))
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

        [HttpPost]
        public async Task<IActionResult> PostTarea([FromBody] Tarea tarea)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (_context.Tarea.Any(x => 
                (x.ProyectoIdProyecto == tarea.ProyectoIdProyecto) && 
                (x.PerfilEmpleadoIdEmpleado == tarea.PerfilEmpleadoIdEmpleado))
               )
            {
                throw new AppException("El empleado ya esta asignado a una tarea en el proyecto");
            }

            _context.Tarea.Add(tarea);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (TareaExists(tarea.ProyectoIdProyecto))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetTarea", new { id = tarea.ProyectoIdProyecto }, tarea);
        }

        // DELETE: api/Tareas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTarea([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var tarea = await _context.Tarea.FindAsync(id);
            if (tarea == null)
            {
                return NotFound();
            }

            _context.Tarea.Remove(tarea);
            await _context.SaveChangesAsync();

            return Ok(tarea);
        }

        private bool TareaExists(int id)
        {
            return _context.Tarea.Any(e => e.ProyectoIdProyecto == id);
        }
    }
}