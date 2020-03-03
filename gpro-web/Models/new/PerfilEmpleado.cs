using System;
using System.Collections.Generic;

namespace gpro-web.Models.new
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

        public Empleado PerfilEmpleadoIdEmpleadoNavigation { get; set; }
        public Perfil PerfilEmpleadoIdPerfilNavigation { get; set; }
        public ICollection<HoraTrabajada> HoraTrabajada { get; set; }
    }
}
