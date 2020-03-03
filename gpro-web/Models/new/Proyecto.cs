using System;
using System.Collections.Generic;

namespace gpro-web.Models.new
{
    public partial class Proyecto
    {
        public Proyecto()
        {
            EmpleadoProyecto = new HashSet<EmpleadoProyecto>();
        }

        public int IdProyecto { get; set; }
        public int ClienteId { get; set; }
        public string TituloProyecto { get; set; }
        public string DescripcionProyecto { get; set; }
        public string EstadoProyecto { get; set; }
        public int IdEmpleadoPm { get; set; }

        public Cliente Cliente { get; set; }
        public EstadoProyecto EstadoProyectoNavigation { get; set; }
        public Empleado IdEmpleadoPmNavigation { get; set; }
        public ICollection<EmpleadoProyecto> EmpleadoProyecto { get; set; }
    }
}
