using System.Collections.Generic;

namespace gpro_web.Models
{
    public partial class EstadoHoras
    {
        public EstadoHoras()
        {
            HoraTrabajada = new HashSet<HoraTrabajada>();
        }

        public string EstadoHoras1 { get; set; }

        public virtual ICollection<HoraTrabajada> HoraTrabajada { get; set; }
    }
}
