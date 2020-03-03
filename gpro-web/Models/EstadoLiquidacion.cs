using System;
using System.Collections.Generic;

namespace gpro_web.Models
{
    public partial class EstadoLiquidacion
    {
        public EstadoLiquidacion()
        {
            Liquidacion = new HashSet<Liquidacion>();
        }

        public int Id { get; set; }
        public string Estado { get; set; }

        public virtual ICollection<Liquidacion> Liquidacion { get; set; }
    }
}
