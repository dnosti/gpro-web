using System;
using System.Collections.Generic;

namespace gpro-web.Models.new
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

        public ICollection<PerfilEmpleado> PerfilEmpleado { get; set; }
    }
}
