using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using gpro_web.Helpers;
using gpro_web.Models;

namespace gpro_web.Services
{
    public interface ITareaService
{
        int NuevaTarea(Tarea tarea);
        Task UpdateTarea(Tarea tarea);
        Tarea GetTareaPorId(int id);
        Task PerfilEmpl(int idEmpl, int idProy, int idPerf);


}
    public class TareaService : ITareaService
    {
        private gpro_dbContext _context;

        public TareaService(gpro_dbContext context)
        {
            _context = context;
        }
        public Tarea GetTareaPorId(int id)
        {
            return _context.Tarea.Find(id);
        }

        public int NuevaTarea(Tarea tarea)
        {
            if (_context.Tarea.Any(x => x.PerfilEmpleadoIdEmpleado == tarea.PerfilEmpleadoIdEmpleado && 
            x.ProyectoIdProyecto == tarea.ProyectoIdProyecto))
                throw new AppException("El empleado " + tarea.PerfilEmpleadoIdEmpleado + " ya tiene tarea asignada para el mismo proyecto.");

            _context.Tarea.Add(tarea);
            PerfilEmpl(tarea.PerfilEmpleadoIdEmpleado, tarea.ProyectoIdProyecto, tarea.PerfilEmpleadoIdPerfil);
            _context.SaveChanges();

            return tarea.IdTarea;
        }
        
        public async Task UpdateTarea(Tarea tarea)
        {
            if (_context.
                Tarea.Any(x => (x.IdTarea == tarea.IdTarea)))
            {
                _context.Tarea.Update(tarea);
                await _context.SaveChangesAsync();
            }
        }
        public async Task PerfilEmpl (int idEmpl, int idProy, int idPerf)
        {
            if (_context.PerfilEmpleado.Any(x => x.PerfilEmpleadoIdEmpleado == idEmpl &&
             x.ProyectoIdProyecto == idProy)){
                throw new AppException("El empleado " + idEmpl + " ya tiene tarea asignada para el mismo proyecto.");
            }
            PerfilEmpleado aux = new PerfilEmpleado();
            aux.PerfilEmpleadoIdEmpleado = idEmpl;
            aux.ProyectoIdProyecto = idProy;
            aux.PerfilEmpleadoIdPerfil = idPerf;
            _context.PerfilEmpleado.Add(aux);
            await _context.SaveChangesAsync();
        }
    }
}
