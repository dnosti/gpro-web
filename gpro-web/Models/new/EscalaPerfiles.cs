using System;
using System.Collections.Generic;

namespace gpro-web.Models.new
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

        public ICollection<Liquidacion> Liquidacion { get; set; }
    }
}
