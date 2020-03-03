using System;
using System.Collections.Generic;

namespace gpro-web.Models.new
{
    public partial class EstadoHoras
    {
        public EstadoHoras()
        {
            HoraTrabajada = new HashSet<HoraTrabajada>();
        }

        public string EstadoHoras1 { get; set; }

        public ICollection<HoraTrabajada> HoraTrabajada { get; set; }
    }
}
