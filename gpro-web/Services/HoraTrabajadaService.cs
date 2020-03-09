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
        HtrabDto HorasByProyecto(int idProyecto);
        HtrabDto HorasByEmpleado(int idPerfil, int idProyecto);
        HtrabPorRecDto HorasPorRecurso(int idEmpleado, DateTime inicio, DateTime fin);
        HtrabDto HorasOverBudget(int idProyecto, DateTime inicio, DateTime fin);
        int HorasAdeudadasProy(int idProy);
        void PagarHoras(List<HoraTrabajada> horaTrabajadas);
        Task CargaHorasEmpl(HoraTrabajada horaTrabajada);
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

            var perfiles = from c in _context.Perfil select c;

            foreach (int id in idsProyActivos)
            {
                List<SumaPerfiles> sumaPerfiles = new List<SumaPerfiles>();
                var consulta = (from b in _context.HoraTrabajada
                                where b.ProyectoIdProyecto == id
                                select b).ToList();

                foreach (Perfil perfil in perfiles)
                {
                    SumaPerfiles sumaPerf = new SumaPerfiles();
                    sumaPerf.IdPerfil = perfil.IdPerfil;
                    sumaPerf.DescripcionPerfil = perfil.DescripcionPerfil;
                    sumaPerf.ValorHora = perfil.ValorHora;
                    if (perfil.PerfilEmpleado.Count != 0)
                    {
                        sumaPerf.Nombre = perfil.PerfilEmpleado.ElementAt(0).PerfilEmpleadoIdEmpleadoNavigation.NombreEmpleado;
                        sumaPerf.Apellido = perfil.PerfilEmpleado.ElementAt(0).PerfilEmpleadoIdEmpleadoNavigation.ApellidoEmpleado;
                    }
                    sumaPerf.HorasPerfil = consulta.Where(x => x.PerfilIdPerfil == perfil.IdPerfil).Sum(x => x.CatidadHorasTrab);
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

        public HtrabDto HorasByProyecto(int idProyecto)
        {
            // FILTRO HORAS TRABAJAS POR PROYECTO
            List<SumaPerfiles> sumaPerfiles = new List<SumaPerfiles>();
            var consulta = (from b in _context.HoraTrabajada
                            where b.ProyectoIdProyecto == idProyecto
                            select b).ToList();

            // POR CADA HORA, GENERO EL PERFIL-EMPLEADO CON LA SUMA TOTAL
            foreach (HoraTrabajada hora in consulta)
            {
                SumaPerfiles sumaPerf = new SumaPerfiles
                {
                    IdPerfil = hora.PerfilIdPerfil,
                    DescripcionPerfil = hora.PerfilEmpleado.PerfilEmpleadoIdPerfilNavigation.DescripcionPerfil,
                    ValorHora = hora.PerfilEmpleado.PerfilEmpleadoIdPerfilNavigation.ValorHora,
                    FechaHorasTrab = hora.FechaHorasTrab,
                    Nombre = hora.PerfilEmpleado.PerfilEmpleadoIdEmpleadoNavigation.NombreEmpleado,
                    Apellido = hora.PerfilEmpleado.PerfilEmpleadoIdEmpleadoNavigation.ApellidoEmpleado,
                    HorasPerfil = hora.CatidadHorasTrab,
                    HorasEstimadas = hora.TareaIdTareaNavigation.HorasEstimadasTarea,
                    EstadoHorasTrab = hora.EstadoHorasTrab,
                    HorasTotales = consulta.Where(x => x.PerfilIdPerfil == hora.PerfilIdPerfil).Sum(x => x.CatidadHorasTrab)
                };
                sumaPerfiles.Add(sumaPerf);
            }

            // METO TODA LA DATA EN EL DTO Y RETORNO
            HtrabDto result = new HtrabDto
            {
                IdProy = idProyecto,
                TotalHorasProy = consulta.Sum(x => x.CatidadHorasTrab),
                SumaPorPerfil = sumaPerfiles
            };


            return result;
        }

        public HtrabDto HorasByEmpleado(int idPerfil, int idProyecto)
        {
            // FILTRO HORAS TRABAJAS POR PROYECTO
            List<SumaPerfiles> sumaPerfiles = new List<SumaPerfiles>();
            var consulta = (from b in _context.HoraTrabajada
                            where b.ProyectoIdProyecto.Equals(idProyecto) && b.PerfilIdPerfil.Equals(idPerfil)
                            select b).ToList();

            // POR CADA HORA, GENERO EL PERFIL-EMPLEADO CON LA SUMA TOTAL
            foreach (HoraTrabajada hora in consulta)
            {
                SumaPerfiles sumaPerf = new SumaPerfiles
                {
                    IdPerfil = hora.PerfilIdPerfil,
                    DescripcionPerfil = hora.PerfilEmpleado.PerfilEmpleadoIdPerfilNavigation.DescripcionPerfil,
                    ValorHora = hora.PerfilEmpleado.PerfilEmpleadoIdPerfilNavigation.ValorHora,
                    FechaHorasTrab = hora.FechaHorasTrab,
                    Nombre = hora.PerfilEmpleado.PerfilEmpleadoIdEmpleadoNavigation.NombreEmpleado,
                    Apellido = hora.PerfilEmpleado.PerfilEmpleadoIdEmpleadoNavigation.ApellidoEmpleado,
                    HorasPerfil = hora.CatidadHorasTrab,
                    HorasEstimadas = hora.TareaIdTareaNavigation.HorasEstimadasTarea,
                    EstadoHorasTrab = hora.EstadoHorasTrab,
                    HorasTotales = consulta.Where(x => x.PerfilIdPerfil == hora.PerfilIdPerfil).Sum(x => x.CatidadHorasTrab)
                };
                sumaPerfiles.Add(sumaPerf);
            }

            // METO TODA LA DATA EN EL DTO Y RETORNO
            HtrabDto result = new HtrabDto
            {
                IdProy = idProyecto,
                TotalHorasProy = consulta.Sum(x => x.CatidadHorasTrab),
                SumaPorPerfil = sumaPerfiles
            };


            return result;
        }

        public HtrabPorRecDto HorasPorRecurso(int idEmpleado, DateTime inicio, DateTime fin)
        {
            var consulta = (from b in _context.HoraTrabajada
                            where (b.PerfilIdPerfil == idEmpleado) && (b.FechaHorasTrab >= inicio) && (b.FechaHorasTrab <= fin)
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

        public HtrabDto HorasOverBudget(int idProyecto, DateTime inicio, DateTime fin)
        {
            List<SumaPerfiles> sumaPerfiles = new List<SumaPerfiles>();
            var consulta = (from b in _context.HoraTrabajada
                            where b.ProyectoIdProyecto == idProyecto && b.FechaHorasTrab >= inicio && b.FechaHorasTrab <= fin && b.CatidadHorasTrab > 8
                            select b).ToList();

            foreach (HoraTrabajada hora in consulta)
            {
                SumaPerfiles sumaPerf = new SumaPerfiles
                {
                    IdPerfil = hora.PerfilIdPerfil,
                    DescripcionPerfil = hora.PerfilEmpleado.PerfilEmpleadoIdPerfilNavigation.DescripcionPerfil,
                    ValorHora = hora.PerfilEmpleado.PerfilEmpleadoIdPerfilNavigation.ValorHora,
                    FechaHorasTrab = hora.FechaHorasTrab,
                    Nombre = hora.PerfilEmpleado.PerfilEmpleadoIdEmpleadoNavigation.NombreEmpleado,
                    Apellido = hora.PerfilEmpleado.PerfilEmpleadoIdEmpleadoNavigation.ApellidoEmpleado,
                    HorasPerfil = hora.CatidadHorasTrab,
                    HorasEstimadas = hora.TareaIdTareaNavigation.HorasEstimadasTarea,
                    EstadoHorasTrab = hora.EstadoHorasTrab,
                    HorasTotales = consulta.Where(x => x.PerfilIdPerfil == hora.PerfilIdPerfil).Sum(x => x.CatidadHorasTrab)
                };
                sumaPerfiles.Add(sumaPerf);
            }

            HtrabDto result = new HtrabDto
            {
                IdProy = idProyecto,
                TotalHorasProy = consulta.Sum(x => x.CatidadHorasTrab),
                SumaPorPerfil = sumaPerfiles
            };

            return result;
        }

        public int HorasAdeudadasProy(int idProy)
        {
            var consulta = (from b in _context.HoraTrabajada
                           where (b.ProyectoIdProyecto == idProy) && (b.EstadoHorasTrab == "Adeudadas")
                           select b).ToList();

            return consulta.Sum(x => x.CatidadHorasTrab);
        }

        public void PagarHoras(List<HoraTrabajada> horaTrabajada)
        {
            horaTrabajada.ForEach(x => x.EstadoHorasTrab = "Pagadas");
            _context.SaveChanges();
        }

        public async Task CargaHorasEmpl(HoraTrabajada horaTrabajada)
        {
            var consulta = (from b in _context.HoraTrabajada
                            where (b.IdEmpleado == horaTrabajada.IdEmpleado) && (b.FechaHorasTrab == horaTrabajada.FechaHorasTrab)
                            select b).ToList();
            if (consulta.Count() == 0)
            {
                _context.HoraTrabajada.Add(horaTrabajada);
                await _context.SaveChangesAsync();
            }
            else
            {
                throw new AppException("Ya fueron cargadas las horas para la fecha " + horaTrabajada.FechaHorasTrab + ".");
            }
        }
    }
}