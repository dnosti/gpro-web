using System;
using System.Collections.Generic;

namespace gpro_web.Models
{
    public partial class Liquidacion
    {
        public int Id { get; set; }
        public string Estado { get; set; }
        public int IdEmpleado { get; set; }
        public float Importe { get; set; }
        public DateTime FechaDesde { get; set; }
        public DateTime FechaHasta { get; set; }
        public int IdEscalaPerfiles { get; set; }
        public int IdEscalaHoras { get; set; }

        public virtual Empleado IdEmpleadoNavigation { get; set; }
        public virtual EscalaHoras IdEscalaHorasNavigation { get; set; }
        public virtual EscalaPerfiles IdEscalaPerfilesNavigation { get; set; }
    }
}
