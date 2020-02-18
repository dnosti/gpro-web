using System;

namespace gpro_web.Dtos
{
    public class PerfilEmpleadoDto
{
        public int PerfilEmpleadoIdPerfil { get; set; }
        public int PerfilEmpleadoIdEmpleado { get; set; }
        
        public string ApellidoEmpleado { get; set; }
        public string NombreEmpleado { get; set; }
        public DateTime FechaIngreso { get; set; }
        public int Dni { get; set; }

        public string DescripcionPerfil { get; set; }
        public float ValorHora { get; set; }
    }
}
