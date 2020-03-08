using System;
using System.Collections.Generic;

namespace gpro_web.Dtos
{
    public class HtrabDto
    {
        public int IdProy { get; set; }
        public int TotalHorasProy { get; set; }
        public List<SumaPerfiles> SumaPorPerfil { get; set; }

    }
    public class SumaPerfiles
    {
        public int IdPerfil { get; set; }
        public int HorasPerfil { get; set; }
        public int HorasTotales { get; set; }
        public int HorasEstimadas { get; set; }
        public string EstadoHorasTrab { get; set; }
        public DateTime FechaHorasTrab { get; set; }
        public string DescripcionPerfil { get; set; }
        public float ValorHora { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
    }
    public class HtrabPorRecDto
    {
        public int TotalHorasRec { get; set; }
        public List<SumaPerfiles> PorPerfil { get; set; }
        public List <HtrabDto> PorProyecto { get; set; }
    }
}