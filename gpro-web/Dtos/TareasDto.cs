using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace gpro_web.Dtos
{
    public class TareasDto
{
        public int ProyectoIdProyecto { get; set; }
        public int IdTarea { get; set; }
        public int PerfilEmpleadoIdPerfil { get; set; }
        public int PerfilEmpleadoIdEmpleado { get; set; }
        public string DescripcionTarea { get; set; }
        public int HorasEstimadasTarea { get; set; }
        public int? HorasOverbudgetTarea { get; set; }

        public string ApellidoEmpleado { get; set; }
        public string NombreEmpleado { get; set; }
        public int Dni { get; set; }

        public string DescripcionPerfil { get; set; }
        public float ValorHora { get; set; }

    }
}
