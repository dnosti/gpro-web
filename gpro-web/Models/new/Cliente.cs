using System;
using System.Collections.Generic;

namespace gpro-web.Models.new
{
    public partial class Cliente
    {
        public Cliente()
        {
            Proyecto = new HashSet<Proyecto>();
        }

        public int Id { get; set; }
        public long IdCliente { get; set; }
        public string RazonSocialCliente { get; set; }
        public string ApellidoCliente { get; set; }
        public string NombreCliente { get; set; }
        public string DireccionCliente { get; set; }
        public string TelefonoCliente { get; set; }
        public string EmailCliente { get; set; }

        public ICollection<Proyecto> Proyecto { get; set; }
    }
}
