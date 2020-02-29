using gpro_web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace gpro_web.Dtos
{
    public class UserEmplDto
{
    public int Id { get; set; }
    public string Username { get; set; }
    public int IdEmpleado { get; set; }
    public int IdRol { get; set; }
    public string Descripcion { get; set; }
    public string ApellidoEmpleado { get; set; }
    public string NombreEmpleado { get; set; }
    public int Dni { get; set; }
    //public List<Usuario> Usuario { get; set; }
    }
}
