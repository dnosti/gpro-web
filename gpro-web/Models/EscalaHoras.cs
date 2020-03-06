using System;
using System.Collections.Generic;

namespace gpro_web.Models
{
    public partial class EscalaHoras
    {
        public EscalaHoras()
        {
            Liquidacion = new HashSet<Liquidacion>();
        }

        public int Id { get; set; }
        public int CantHoras { get; set; }
        public float PorcentajeHoras { get; set; }

        public virtual ICollection<Liquidacion> Liquidacion { get; set; }
    }
}
