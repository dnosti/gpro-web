using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace gpro_web.Dtos
{
    public class InformeDto
{
        public int Id { get; set; }
        public int IdEmpleado { get; set; }
        public string ApellidoEmpleado { get; set; }
        public string NombreEmpleado { get; set; }
        public float Importe { get; set; }
        public DateTime FechaDesde { get; set; }
        public DateTime FechaHasta { get; set; }
        public int CantHorasTrab { get; set; }
        public int IdEscalaHoras { get; set; }
        public float PorcentajeHoras { get; set; }
        public int HorasOverBudget { get; set; }
        public int IdEscalaPerfiles { get; set; }
        public int CantPerfiles { get; set; }
        public float PorcentajePerfil { get; set; }
        public int CantAnios { get; set; }
        public int IdEscalaAntiguedad { get; set; }
        public float Porcentaje { get; set; }
    }
}
