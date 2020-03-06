using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using gpro_web.Helpers;
using gpro_web.Models;

namespace gpro_web.Services
{
    public interface IEscalasService
    {
        List<EscalaPerfiles> GetEscalaPerfiles();
        List<EscalaHoras> GetEscalaHoras();
    }

    public class EscalasService : IEscalasService
    {
        private gpro_dbContext _context;

        public EscalasService(gpro_dbContext context)
        {
            _context = context;
        }

        public List<EscalaPerfiles> GetEscalaPerfiles()
        {
            var escalaPerfiles = from e in _context.EscalaPerfiles select e;

            if(escalaPerfiles.ToList().Count == 0)
            {
                return null;
            }

            return escalaPerfiles.ToList();
        }

        public List<EscalaHoras> GetEscalaHoras()
        {
            var escalaHoras = from e in _context.EscalaHoras select e;

            if (escalaHoras.ToList().Count == 0)
            {
                return null;
            }

            return escalaHoras.ToList();
        }
    }
}
