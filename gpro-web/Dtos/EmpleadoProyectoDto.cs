using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace gpro_web.Dtos
{
    public class EmpleadoProyectoDto
    {
        public int IdEmpleado { get; set; }
        public int IdProyecto { get; set; }

        public string TituloProyecto { get; set; }
        public string DescripcionProyecto { get; set; }
        public string EstadoProyecto { get; set; }
    }
}
