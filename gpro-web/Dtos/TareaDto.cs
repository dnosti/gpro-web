using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace gpro_web.Dtos
{
    public class TareaDto
{
        public int ProyectoIdProyecto { get; set; }
        public string TituloProyecto { get; set; }
        public int IdTarea { get; set; }
        public int PerfilEmpleadoIdPerfil { get; set; }
        public int PerfilEmpleadoIdEmpleado { get; set; }
        public string NombreEmpleado { get; set; }
        public string ApellidoEmpleado { get; set; }
        public string DescripcionTarea { get; set; }
        public int HorasEstimadasTarea { get; set; }
        public int? HorasOverbudgetTarea { get; set; }
    }
}
