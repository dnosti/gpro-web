using System.Collections.Generic;

namespace gpro_web.Models
{
    public partial class Tarea
    {
        public Tarea()
        {
            HoraTrabajada = new HashSet<HoraTrabajada>();
        }

        public int ProyectoIdProyecto { get; set; }
        public int IdTarea { get; set; }
        public int PerfilEmpleadoIdPerfil { get; set; }
        public int PerfilEmpleadoIdEmpleado { get; set; }
        public string DescripcionTarea { get; set; }
        public int HorasEstimadasTarea { get; set; }
        public int? HorasOverbudgetTarea { get; set; }

        public virtual ICollection<HoraTrabajada> HoraTrabajada { get; set; }
    }
}
