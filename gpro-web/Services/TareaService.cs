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
        void NuevaTarea(Tarea tarea);
        Task UpdateTarea(Tarea tarea);
        Tarea GetTareaPorId(int id);
        
}
    public class TareaService : ITareaService
    {
        private gpro_dbContext _context;

        public TareaService (gpro_dbContext context)
        {
            _context = context;
        }
        public Tarea GetTareaPorId(int id)
        {
            return _context.Tarea.Find(id);
        }

        public void NuevaTarea(Tarea tarea)
        {
            if (_context.Tarea.Any(x => x.IdTarea == tarea.IdTarea))
                throw new AppException("La tarea " + tarea.IdTarea + " ya existe.");
            _context.Tarea.Add(tarea);
            _context.SaveChanges();
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
}
