using System;

namespace gpro_web.Models
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

        public virtual EstadoHoras EstadoHorasTrabNavigation { get; set; }
        public virtual PerfilEmpleado PerfilEmpleado { get; set; }
        public virtual Tarea TareaIdTareaNavigation { get; set; }
    }
}
