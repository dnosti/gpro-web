using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace gpro_web.Dtos
{
    public class ClienteDto
{
        public int Id { get; set; }
        public Int64 IdCliente { get; set; }
        public string RazonSocialCliente { get; set; }
        public string ApellidoCliente { get; set; }
        public string NombreCliente { get; set; }
        public string DireccionCliente { get; set; }
        public string TelefonoCliente { get; set; }
        public string EmailCliente { get; set; }

}
}
