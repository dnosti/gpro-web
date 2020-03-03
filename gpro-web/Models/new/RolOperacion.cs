using System;
using System.Collections.Generic;

namespace gpro-web.Models.new
{
    public partial class RolOperacion
    {
        public int Id { get; set; }
        public int IdRol { get; set; }
        public int IdOperacion { get; set; }

        public Operacion IdOperacionNavigation { get; set; }
        public Rol IdRolNavigation { get; set; }
    }
}
