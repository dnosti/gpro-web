using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace gpro_web.Models
{
    public partial class Empleado
    {
        public Empleado()
        {
            EmpleadoProyecto = new HashSet<EmpleadoProyecto>();
            Liquidacion = new HashSet<Liquidacion>();
            PerfilEmpleado = new HashSet<PerfilEmpleado>();
            Usuario = new HashSet<Usuario>();
        }

        public int IdEmpleado { get; set; }
        public string ApellidoEmpleado { get; set; }
        public string NombreEmpleado { get; set; }
        public DateTime FechaIngreso { get; set; }
        public string Telefono { get; set; }
        public string Domicilio { get; set; }
        public string Localidad { get; set; }
        public string Provincia { get; set; }
        public int Dni { get; set; }
        public string Nacionalidad { get; set; }

        [JsonIgnore]
        [IgnoreDataMember]
        public virtual ICollection<EmpleadoProyecto> EmpleadoProyecto { get; set; }

        [JsonIgnore]
        [IgnoreDataMember]
        public virtual ICollection<Liquidacion> Liquidacion { get; set; }

        [JsonIgnore]
        [IgnoreDataMember]
        public virtual ICollection<PerfilEmpleado> PerfilEmpleado { get; set; }

        [JsonIgnore]
        [IgnoreDataMember]
        public virtual ICollection<Usuario> Usuario { get; set; }
    }
}
