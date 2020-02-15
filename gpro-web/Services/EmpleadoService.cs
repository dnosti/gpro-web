using gpro_web.Models;
using System.Collections.Generic;
using System.Linq;

namespace gpro_web.Services
{

    public interface IEmpleadoService
    {
        List<Empleado> AllEmpleados();
        Empleado BuscarPorDni(int dni);
        List<Empleado> BuscarEmpleados(string dato);
        void NuevoEmpleado(Empleado empleado);
        void UpdateEmpleado(Empleado empleado);
    }

    public class EmpleadoService : IEmpleadoService
    {
        private gpro_dbContext _context;

        public EmpleadoService(gpro_dbContext context)
        {
            _context = context;
        }

        public List<Empleado> AllEmpleados()
        {
            var empleados = from e in _context.Empleado select e;

            if (empleados.ToList().Count() == 0)
            {
                return null;
            }

            return empleados.ToList();
        }

        public List<Empleado> BuscarEmpleados(string dato)
        {
            var empleados = from e in _context.Empleado
                            where e.ApellidoEmpleado.Contains(dato) || e.NombreEmpleado.Contains(dato)
                            select e;

            if (empleados.ToList().Count() == 0)
            {
                return null;
            }

            return empleados.ToList();
        }

        public Empleado BuscarPorDni(int dni)
        {
            var empleado = from e in _context.Empleado
                           where e.Dni.Equals(dni)
                           select e;

            if (empleado.ToList().Count() == 0)
            {
                return null;
            }

            return empleado.ToList().ElementAt(0);
        }

        public void NuevoEmpleado(Empleado empleado)
        {
            _context.Empleado.Add(empleado);
            _context.SaveChanges();
        }

        public void UpdateEmpleado(Empleado empleado)
        {            
            _context.Empleado.Update(empleado);
            _context.SaveChanges();
        }
    }

}

