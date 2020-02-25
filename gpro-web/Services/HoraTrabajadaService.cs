using gpro_web.Dtos;
using gpro_web.Helpers;
using gpro_web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace gpro_web.Services
{
    public interface IHoraTrabajadaService
    {
        List<HtrabDto> HorasPorProyecto();
        HtrabPorRecDto HorasPorRecurso(int idEmpleado, DateTime inicio, DateTime fin);
        int HorasAdeudadasProy(int idProy);
        Task PagarHoras(int idEmpl, DateTime inicio, DateTime fin);
    }

    public class HoraTrabajadaService : IHoraTrabajadaService
    {
        private gpro_dbContext _context;

        public HoraTrabajadaService(gpro_dbContext context)
        {
            _context = context;
        }

        public List<HtrabDto> HorasPorProyecto()
        {
            List<HtrabDto> HorasPorProy = new List<HtrabDto>();

            var idsProyActivos = from p in _context.Proyecto
                                 where p.EstadoProyecto == "Vigente"
                                 select p.IdProyecto;

            var perfiles = from c in _context.Perfil select c.IdPerfil;

            foreach (int id in idsProyActivos)
            {
                List<SumaPerfiles> sumaPerfiles = new List<SumaPerfiles>();
                var consulta = (from b in _context.HoraTrabajada
                                where b.ProyectoIdProyecto == id
                                select b).ToList();

                //foreach(HoraTrabajada ht in consulta)

                foreach (int perfil in perfiles)
                {
                    SumaPerfiles sumaPerf = new SumaPerfiles();
                    sumaPerf.IdPerfil = perfil;
                    sumaPerf.HorasPerfil = consulta.Where(x => x.PerfilIdPerfil == perfil).Sum(x => x.CatidadHorasTrab);
                    sumaPerfiles.Add(sumaPerf);
                }
                HtrabDto result = new HtrabDto();
                result.IdProy = id;
                result.TotalHorasProy = consulta.Sum(x => x.CatidadHorasTrab);
                result.SumaPorPerfil = sumaPerfiles;
                HorasPorProy.Add(result);
            }
            return HorasPorProy;
        }

        public HtrabPorRecDto HorasPorRecurso(int idEmpleado, DateTime inicio, DateTime fin)
        {
            var consulta = (from b in _context.HoraTrabajada
                            where (b.IdEmpleado == idEmpleado) && (b.FechaHorasTrab >= inicio) && (b.FechaHorasTrab <= fin)
                            select b).ToList();

            var perfiles = (from c in _context.Perfil select c.IdPerfil).ToList();

            var idsProyActivos = (from p in _context.Proyecto
                                  where p.EstadoProyecto == "Vigente"
                                  select p.IdProyecto).ToList();

            List<SumaPerfiles> sumaPerfiles = new List<SumaPerfiles>();
            List<HtrabDto> htrabDtos = new List<HtrabDto>();

            perfiles.ForEach(delegate (int p)
            {
                int horas = consulta.Where(
                        x => x.PerfilIdPerfil == p).Sum(x => x.CatidadHorasTrab);

                if (horas > 0)
                {
                    sumaPerfiles.Add(new SumaPerfiles()
                    {
                        IdPerfil = p,
                        HorasPerfil = horas
                    });
                }
            });

            idsProyActivos.ForEach(delegate (int p)
            {
                int horas = consulta.Where(
                        x => x.ProyectoIdProyecto == p).Sum(x => x.CatidadHorasTrab);

                if (horas > 0)
                {
                    htrabDtos.Add(new HtrabDto()
                    {
                        IdProy = p,
                        TotalHorasProy = horas
                    });
                }
            });
            HtrabPorRecDto htrabPorRecDto = new HtrabPorRecDto()
            {
                TotalHorasRec = consulta.Sum(x => x.CatidadHorasTrab),
                PorPerfil = sumaPerfiles,
                PorProyecto = htrabDtos         
            };
            return htrabPorRecDto;
        }

        public int HorasAdeudadasProy(int idProy)
        {
            var consulta = (from b in _context.HoraTrabajada
                           where (b.ProyectoIdProyecto == idProy) && (b.EstadoHorasTrab == "Adeudadas")
                           select b).ToList();

            return consulta.Sum(x => x.CatidadHorasTrab);
        }

        public async Task PagarHoras(int idEmpl, DateTime inicio, DateTime fin)
        {
            var consulta = (from b in _context.HoraTrabajada
                            where (b.IdEmpleado == idEmpl) && (b.FechaHorasTrab >= inicio) && (b.FechaHorasTrab <= fin) && (b.EstadoHorasTrab == "Adeudadas")
                            select b).ToList();

            consulta.ForEach(x => x.EstadoHorasTrab = "Pagadas");
            await _context.SaveChangesAsync();
        }
    }
}