using System.Collections.Generic;

namespace gpro_web.Models
{
    public partial class PerfilEmpleado
    {
        public PerfilEmpleado()
        {
            HoraTrabajada = new HashSet<HoraTrabajada>();
        }

        public int PerfilEmpleadoIdPerfil { get; set; }
        public int PerfilEmpleadoIdEmpleado { get; set; }
        public int ProyectoIdProyecto { get; set; }

        public virtual Empleado PerfilEmpleadoIdEmpleadoNavigation { get; set; }
        public virtual Perfil PerfilEmpleadoIdPerfilNavigation { get; set; }
        public virtual ICollection<HoraTrabajada> HoraTrabajada { get; set; }
    }
}
