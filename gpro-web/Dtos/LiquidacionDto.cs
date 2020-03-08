using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace gpro_web.Dtos
{
    public class LiquidacionDto
{
        public int Id { get; set; }
        public int Estado { get; set; }
        public int IdEmpleado { get; set; }
        public float Importe { get; set; }
        public string FechaDesde { get; set; }
        public string FechaHasta { get; set; }
        public int IdEscalaPerfiles { get; set; }
        public int IdEscalaHoras { get; set; }
        public int IdEscalaAntiguedad { get; set; }
    }
}
