using System.Collections.Generic;

namespace gpro_web.Models
{
    public partial class Perfil
    {
        public Perfil()
        {
            PerfilEmpleado = new HashSet<PerfilEmpleado>();
        }

        public int IdPerfil { get; set; }
        public string DescripcionPerfil { get; set; }
        public float ValorHora { get; set; }

        public virtual ICollection<PerfilEmpleado> PerfilEmpleado { get; set; }
    }
}
