using System;
using System.Collections.Generic;

namespace gpro_web.Models
{
    public partial class Cliente
    {
        public Cliente()
        {
            Proyecto = new HashSet<Proyecto>();
        }

        public Int64 IdCliente { get; set; }
        public string RazonSocialCliente { get; set; }
        public string ApellidoCliente { get; set; }
        public string NombreCliente { get; set; }
        public string DireccionCliente { get; set; }
        public string TelefonoCliente { get; set; }
        public string EmailCliente { get; set; }

        public virtual ICollection<Proyecto> Proyecto { get; set; }
    }
}
