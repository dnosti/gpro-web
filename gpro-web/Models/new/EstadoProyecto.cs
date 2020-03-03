using System;
using System.Collections.Generic;

namespace gpro-web.Models.new
{
    public partial class EstadoProyecto
    {
        public EstadoProyecto()
        {
            Proyecto = new HashSet<Proyecto>();
        }

        public string EstadoProyecto1 { get; set; }

        public ICollection<Proyecto> Proyecto { get; set; }
    }
}
