using System;
using System.Collections.Generic;

namespace gpro-web.Models.new
{
    public partial class HoraTrabajada
    {
        public int IdHoraTrabajada { get; set; }
        public int PerfilIdPerfil { get; set; }
        public int IdEmpleado { get; set; }
        public int ProyectoIdProyecto { get; set; }
        public int TareaIdTarea { get; set; }
        public int CatidadHorasTrab { get; set; }
        public DateTime FechaHorasTrab { get; set; }
        public string EstadoHorasTrab { get; set; }

        public EstadoHoras EstadoHorasTrabNavigation { get; set; }
        public PerfilEmpleado PerfilEmpleado { get; set; }
        public Tarea TareaIdTareaNavigation { get; set; }
    }
}
