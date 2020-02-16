using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace gpro_web.Dtos
{
    public class HoraTrabajadasDto
{
    public int ProyectoIdProyecto { get; set; }
    public int TareaIdTarea { get; set; }
    public int IdHoraTrabajada { get; set; }
    public int CatidadHorasTrab { get; set; }
    public DateTime FechaHorasTrab { get; set; }
    public string EstadoHorasTrab { get; set; }

}
}
