using System;
using System.Collections.Generic;

namespace gpro-web.Models.new
{
    public partial class EmpleadoProyecto
    {
        public int IdEmpleado { get; set; }
        public int IdProyecto { get; set; }

        public Empleado IdEmpleadoNavigation { get; set; }
        public Proyecto IdProyectoNavigation { get; set; }
    }
}
