using System;
using System.Collections.Generic;

namespace gpro-web.Models.new
{
    public partial class Operacion
    {
        public Operacion()
        {
            RolOperacion = new HashSet<RolOperacion>();
        }

        public int Id { get; set; }
        public string Nombre { get; set; }
        public int IdModulo { get; set; }

        public Modulo IdModuloNavigation { get; set; }
        public ICollection<RolOperacion> RolOperacion { get; set; }
    }
}
