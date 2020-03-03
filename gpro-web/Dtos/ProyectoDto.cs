using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace gpro_web.Dtos
{
    public class ProyectoDto
{
        public int IdProyecto { get; set; }
        public int ClienteId { get; set; }
        public string TituloProyecto { get; set; }
        public string DescripcionProyecto { get; set; }
        public string EstadoProyecto { get; set; }

        public string NombreCliente { get; set; }
        public string ApellidoCliente { get; set; }
        public string RazonSocialCliente { get; set; }

    }
}
