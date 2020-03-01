using System;
using System.Collections.Generic;

namespace gpro_web.Models
{
    public partial class EscalaPerfiles
    {
        public EscalaPerfiles()
        {
            Liquidacion = new HashSet<Liquidacion>();
        }

        public int Id { get; set; }
        public float Porcentaje { get; set; }
        public int CantPerfilesMensuales { get; set; }

        public virtual ICollection<Liquidacion> Liquidacion { get; set; }
    }
}
