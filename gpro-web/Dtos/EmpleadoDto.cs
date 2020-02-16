using System;

namespace gpro_web.Dtos
{
    public class EmpleadoDto
    {
        public long IdEmpleado { get; set; }
        public string ApellidoEmpleado { get; set; }
        public string NombreEmpleado { get; set; }
        public DateTime FechaIngreso { get; set; }
        public string Telefono { get; set; }
        public string Domicilio { get; set; }
        public string Localidad { get; set; }
        public string Provincia { get; set; }
        public int Dni { get; set; }
        public string Nacionalidad { get; set; }
    }
}