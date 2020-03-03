using System;
using System.Collections.Generic;

namespace gpro-web.Models.new
{
    public partial class Modulo
    {
        public Modulo()
        {
            Operacion = new HashSet<Operacion>();
        }

        public int Id { get; set; }
        public string Nombre { get; set; }

        public ICollection<Operacion> Operacion { get; set; }
    }
}
