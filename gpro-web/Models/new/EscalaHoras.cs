using System;
using System.Collections.Generic;

namespace gpro-web.Models.new
{
    public partial class EscalaHoras
    {
        public EscalaHoras()
        {
            Liquidacion = new HashSet<Liquidacion>();
        }

        public int Id { get; set; }
        public int CantHoras { get; set; }
        public float Porcentaje { get; set; }

        public ICollection<Liquidacion> Liquidacion { get; set; }
    }
}
