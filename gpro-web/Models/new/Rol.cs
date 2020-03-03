using System;
using System.Collections.Generic;

namespace gpro-web.Models.new
{
    public partial class Rol
    {
        public Rol()
        {
            RolOperacion = new HashSet<RolOperacion>();
            Usuario = new HashSet<Usuario>();
        }

        public int Id { get; set; }
        public string Rol1 { get; set; }
        public string Descripcion { get; set; }

        public ICollection<RolOperacion> RolOperacion { get; set; }
        public ICollection<Usuario> Usuario { get; set; }
    }
}
