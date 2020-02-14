using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using gpro_web.Helpers;
using gpro_web.Models;


namespace gpro_web.Services
{
    public interface IUsuarioService
{
        Usuario Authenticate(string username, string password);
        IEnumerable<Usuario> GetAll();
        Usuario GetById(int id);
        List<Object> GetByApyNom(string apellido, string nombre);
        Object GetByDni(int dni);
        Usuario Create(Usuario usuario, string password);
        void Update(Usuario usuario, string password = null);
        void Delete(int id);
}
    public class UsuarioService : IUsuarioService
{
        private gpro_dbContext _context;

        public UsuarioService(gpro_dbContext context)
        {
            _context = context;
        }

        public Usuario Authenticate(string username, string password)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
                return null;

            //var user = _context.Usuario.SingleOrDefault(x => x.Username == username && x.Password == password);
            var user = _context.Usuario.SingleOrDefault(x => x.Username == username);

            // return null if user not found
            if (user == null)
                return null;

            // remove password before returning
            //user.Password = null;

            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                return null;

            return user;
        }

        public IEnumerable<Usuario> GetAll()
        {
            return _context.Usuario;
        }

        public Usuario GetById(int id)
        {
            return _context.Usuario.Find(id);
        }

        public List<Object> GetByApyNom(string apellido, string nombre)
        {
            List<Object> usuarios = new List <Object>();
            var empleados = from b in _context.Empleado
                           where b.ApellidoEmpleado.Contains(apellido) && b.NombreEmpleado.Contains(nombre)
                           select b;
            if (empleados.ToList().Count == 0)
            {
                return null;
            }
            else
            {
                int i;
                
                for (i = 0; i < empleados.ToList().Count; i++)
                {
                    var aux = from usr in _context.Usuario
                              where usr.IdEmpleadoNavigation.IdEmpleado.Equals(empleados.ToList().ElementAt(i).IdEmpleado)
                              select usr;


                   
                    usuarios.Add(aux.ToList().ElementAt(0).IdEmpleadoNavigation);
                }
            }
            return usuarios;
        }

        public Object GetByDni(int dni)
        {
            var empl = from b in _context.Empleado
                          where b.Dni.Equals(dni)
                          select b;

            return empl;
        }

        public Usuario Create(Usuario usuario, string password)
        {
            //validation
            if (string.IsNullOrWhiteSpace(password))
                throw new AppException("Password is required");


            if (_context.Usuario.Any(x => x.Username == usuario.Username))
                throw new AppException("Username \"" + usuario.Username + "\" is already taken");

            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            usuario.PasswordHash = passwordHash;
            usuario.PasswordSalt = passwordSalt;

            _context.Usuario.Add(usuario);
            _context.SaveChanges();

            return usuario;
        }

        public void Update(Usuario userParam, string password = null)
        {
            var user = _context.Usuario.Find(userParam.Id);

            if (user == null)
                throw new AppException("User not found");

            if (userParam.Username != user.Username)
            {
                // username has changed so check if the new username is already taken
                if (_context.Usuario.Any(x => x.Username == userParam.Username))
                    throw new AppException("Username " + userParam.Username + " is already taken");
            }

            // update user properties
            user.Username = userParam.Username;

            // update password if it was entered
            if (!string.IsNullOrWhiteSpace(password))
            {
                byte[] passwordHash, passwordSalt;
                CreatePasswordHash(password, out passwordHash, out passwordSalt);

                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
            }

            _context.Usuario.Update(user);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var user = _context.Usuario.Find(id);
            if (user != null)
            {
                _context.Usuario.Remove(user);
                _context.SaveChanges();
            }
        }


        //private helper methods

        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");

            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");
            if (storedHash.Length != 64) throw new ArgumentException("Invalid length of password hash (64 bytes expected).", "passwordHash");
            if (storedSalt.Length != 128) throw new ArgumentException("Invalid length of password salt (128 bytes expected).", "passwordHash");

            using (var hmac = new System.Security.Cryptography.HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != storedHash[i]) return false;
                }
            }

            return true;
        }
    }
}
    