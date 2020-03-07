using System;
using System.Collections.Generic;

namespace gpro_web.Models
{
    public partial class EscalaAntiguedad
    {
        public EscalaAntiguedad()
        {
            Liquidacion = new HashSet<Liquidacion>();
        }

        public int Id { get; set; }
        public int CantAnios { get; set; }
        public float Porcentaje { get; set; }

        public virtual ICollection<Liquidacion> Liquidacion { get; set; }
    }
}
