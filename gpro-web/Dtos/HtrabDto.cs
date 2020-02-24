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
    }
    public class HtrabPorRecDto
    {
        public int TotalHorasRec { get; set; }
        public List<SumaPerfiles> PorPerfil { get; set; }
        public List <HtrabDto> PorProyecto { get; set; }
    }
}