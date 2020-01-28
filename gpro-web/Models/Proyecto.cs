using System;
using System.Collections.Generic;

namespace gpro_web.Models
{
    public partial class Proyecto
    {
        public Proyecto()
        {
            EmpleadoProyecto = new HashSet<EmpleadoProyecto>();
            Tarea = new HashSet<Tarea>();
        }

        public int IdProyecto { get; set; }
        public Int64 ClienteIdCliente { get; set; }
        public string TituloProyecto { get; set; }
        public string DescripcionProyecto { get; set; }
        public string EstadoProyecto { get; set; }

        public virtual Cliente ClienteIdClienteNavigation { get; set; }
        public virtual EstadoProyecto EstadoProyectoNavigation { get; set; }
        public virtual ICollection<EmpleadoProyecto> EmpleadoProyecto { get; set; }
        public virtual ICollection<Tarea> Tarea { get; set; }
    }
}
