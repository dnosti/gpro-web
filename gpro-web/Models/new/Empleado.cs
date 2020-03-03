using System;
using System.Collections.Generic;

namespace gpro-web.Models.new
{
    public partial class Empleado
    {
        public Empleado()
        {
            EmpleadoProyecto = new HashSet<EmpleadoProyecto>();
            Liquidacion = new HashSet<Liquidacion>();
            PerfilEmpleado = new HashSet<PerfilEmpleado>();
            Proyecto = new HashSet<Proyecto>();
            Usuario = new HashSet<Usuario>();
        }

        public int IdEmpleado { get; set; }
        public string ApellidoEmpleado { get; set; }
        public string NombreEmpleado { get; set; }
        public DateTime FechaIngreso { get; set; }
        public string Telefono { get; set; }
        public string Domicilio { get; set; }
        public string Localidad { get; set; }
        public string Provincia { get; set; }
        public int Dni { get; set; }
        public string Nacionalidad { get; set; }

        public ICollection<EmpleadoProyecto> EmpleadoProyecto { get; set; }
        public ICollection<Liquidacion> Liquidacion { get; set; }
        public ICollection<PerfilEmpleado> PerfilEmpleado { get; set; }
        public ICollection<Proyecto> Proyecto { get; set; }
        public ICollection<Usuario> Usuario { get; set; }
    }
}
