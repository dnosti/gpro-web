using System;
using System.Collections.Generic;

namespace gpro-web.Models.new
{
    public partial class Usuario
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public int IdEmpleado { get; set; }
        public int IdRol { get; set; }

        public Empleado IdEmpleadoNavigation { get; set; }
        public Rol IdRolNavigation { get; set; }
    }
}
