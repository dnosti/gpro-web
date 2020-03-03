using System;
using System.Collections.Generic;

namespace gpro-web.Models.new
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

        public Empleado IdEmpleadoNavigation { get; set; }
        public EscalaHoras IdEscalaHorasNavigation { get; set; }
        public EscalaPerfiles IdEscalaPerfilesNavigation { get; set; }
    }
}
