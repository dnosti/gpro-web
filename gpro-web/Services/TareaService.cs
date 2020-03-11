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
    Task NuevaTarea(Tarea tarea);
    Task UpdateTarea(Tarea tarea);
    Tarea GetTareaPorId(int id);
    Task PerfilEmpl(int idEmpl, int idProy, int idPerf);
    List<Tarea> GetAll();
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

    public List<Tarea> GetAll()
    {
      var tareas = from t in _context.Tarea select t;

      if (tareas.ToList().Count() == 0)
      {
        return null;
      }

      return tareas.ToList();
    }

    public async Task NuevaTarea(Tarea tarea)
    {
      if (_context.Proyecto.Any(x => x.IdProyecto.Equals(tarea.ProyectoIdProyecto) && !x.EstadoProyecto.Equals("Vigente")))
        {
            throw new AppException("No se pueden asignar la tarea por que el proyecto no esta vigente");
        }

      if (_context.Tarea.Any(x => x.PerfilEmpleadoIdEmpleado == tarea.PerfilEmpleadoIdEmpleado &&
      x.ProyectoIdProyecto == tarea.ProyectoIdProyecto))
        throw new AppException("El empleado " + tarea.PerfilEmpleadoIdEmpleado + " ya tiene tarea asignada para el mismo proyecto.");

      _context.Tarea.Add(tarea);
      await PerfilEmpl(tarea.PerfilEmpleadoIdEmpleado, tarea.ProyectoIdProyecto, tarea.PerfilEmpleadoIdPerfil);
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

    public async Task PerfilEmpl(int idEmpl, int idProy, int idPerf)
    {
      if (_context.PerfilEmpleado.Any(x => x.PerfilEmpleadoIdEmpleado == idEmpl &&
       x.ProyectoIdProyecto == idProy))
      {
        throw new AppException("El empleado " + idEmpl + " ya tiene tarea asignada para el mismo proyecto.");
      }
      // GENERO PERFIL-EMPLEADO
      PerfilEmpleado aux = new PerfilEmpleado
      {
        PerfilEmpleadoIdEmpleado = idEmpl,
        ProyectoIdProyecto = idProy,
        PerfilEmpleadoIdPerfil = idPerf
      };
      _context.PerfilEmpleado.Add(aux);
      // GENERO EMPLEADO-PROYECTO
      EmpleadoProyecto empPro = new EmpleadoProyecto
      {
        IdEmpleado = idEmpl,
        IdProyecto = idProy
      };
      _context.EmpleadoProyecto.Add(empPro);
      await _context.SaveChangesAsync();
    }
  }
}
