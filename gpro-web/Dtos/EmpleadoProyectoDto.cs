using gpro_web.Models;
using System.Collections.Generic;

namespace gpro_web.Dtos
{
    public class EmpleadoProyectoDto
    {
        public int IdEmpleado { get; set; }
        public int IdProyecto { get; set; }

        public string TituloProyecto { get; set; }
        public string DescripcionProyecto { get; set; }
        public string EstadoProyecto { get; set; }
        public string DescripcionPerfil { get; set; }
    }
}
