using gpro_web.Helpers;
using gpro_web.Models;
using gpro_web.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;

namespace gpro_web.Services
{
    public interface ILiquidacionService
    {
        Liquidacion GetLiquidacion(int id);
        List<Liquidacion> GetLiquidacionesPorFecha(DateTime inicio, DateTime fin);
        void NuevaLiquidacion(Liquidacion liquidacion);
        Task UpdateLiq(Liquidacion liquidacion);
        List<InformeDto> InformeDtos(DateTime inicio, DateTime fin);
    }
    public class LiquidacionService : ILiquidacionService
    {
        private IMapper _mapper;
        private gpro_dbContext _context;
        private IHoraTrabajadaService _horaTrabajadaService;

        public LiquidacionService(gpro_dbContext context,
            IMapper mapper, IHoraTrabajadaService horaTrabajadaService)
        {
            _mapper = mapper;
            _context = context;
            _horaTrabajadaService = horaTrabajadaService;
        }

        public Liquidacion GetLiquidacion(int id)
        {
            var liquidacion = (from b in _context.Liquidacion
                               where b.Id == id
                               select b).ToList();

            if (liquidacion.Count() == 0)
            {
                return null;
            }
            return liquidacion.ElementAt(0);
        }

        public List<Liquidacion> GetLiquidacionesPorFecha(DateTime inicio, DateTime fin)
        {
            var liquidaciones = (from b in _context.Liquidacion
                                 where b.FechaDesde >= inicio && b.FechaHasta <= fin
                                 select b).ToList();

            if (liquidaciones.Count() == 0)
            {
                return null;
            }

            return liquidaciones;
        }

        public void NuevaLiquidacion(Liquidacion liquidacion)
        {
            DateTime ingreso = new DateTime();
            DateTime anios = new DateTime();
            float aux = 0;
            if (_context.Liquidacion.Any(x => (x.FechaDesde == liquidacion.FechaDesde && x.FechaHasta == liquidacion.FechaHasta && x.Estado == 1)))
            {
                throw new AppException("Ya existe una liquidación pagada para el mismo período");
            }

            ingreso = _context.Empleado.Find(liquidacion.IdEmpleado).FechaIngreso;
            anios = anios + DateTime.Today.Subtract(ingreso);

            List<HoraTrabajada>horas = new List<HoraTrabajada>((from b in _context.HoraTrabajada
                        where b.IdEmpleado == liquidacion.IdEmpleado && b.FechaHorasTrab >= liquidacion.FechaDesde && b.FechaHorasTrab <= liquidacion.FechaHasta
                        select b).ToList());
            try
            {
                 _horaTrabajadaService.PagarHoras(horas);
            }
            catch (AppException ex)
            {
                Console.WriteLine(ex);
            }

            //Suma las horas trabajadas por valor de cada perfil
            liquidacion.Importe = horas.ToList()
                .Sum(x => x.CatidadHorasTrab <= 8 ? x.CatidadHorasTrab * _context.Perfil.Find(x.PerfilIdPerfil).ValorHora : ((x.CatidadHorasTrab - 8) * _context.Perfil.Find(x.PerfilIdPerfil).ValorHora * (float)1.5) + (8 * _context.Perfil.Find(x.PerfilIdPerfil).ValorHora));

            //Adiciona porcentaje por candidad de perfiles en el período
            if ((horas.Select(x => x.PerfilIdPerfil).Distinct().Count() + 1) >= 4)
            {
                aux = liquidacion.Importe * _context.EscalaPerfiles
                .Find(4).PorcentajePerfil / 100;
                liquidacion.IdEscalaHoras = 4;
            }
            else
            {
                aux = liquidacion.Importe * _context.EscalaPerfiles
                .Find(horas.Select(x => x.PerfilIdPerfil).Distinct().Count() + 1).PorcentajePerfil / 100;

                liquidacion.IdEscalaPerfiles= horas.Select(x => x.PerfilIdPerfil).Distinct().Count() + 1;
            }
           

            //Adiciona porcentaje por antiguedad
            if ((anios.Year / 5) + 1 >= 4) {
                aux = aux + (liquidacion.Importe * _context.EscalaAntiguedad.Find(4).Porcentaje / 100);
                liquidacion.IdEscalaAntiguedad = 4;
            }
            else
            {
                aux = aux + (liquidacion.Importe * _context.EscalaAntiguedad.Find((anios.Year / 5) + 1).Porcentaje / 100);
                liquidacion.IdEscalaAntiguedad = (anios.Year / 5) + 1;
            }

            if(horas.ToList()
                .Sum(x => x.CatidadHorasTrab) >= 200)
            {
                aux = aux + (liquidacion.Importe * _context.EscalaHoras.Find(4).PorcentajeHoras / 100);
                liquidacion.IdEscalaHoras = 4;
            } else if (horas.ToList()
                .Sum(x => x.CatidadHorasTrab) >= 150)
            {
                aux = aux + (liquidacion.Importe * _context.EscalaHoras.Find(3).PorcentajeHoras / 100);
                liquidacion.IdEscalaHoras = 3;
            }
            else
            {
                aux = aux + (liquidacion.Importe * _context.EscalaHoras.Find(2).PorcentajeHoras / 100);
                liquidacion.IdEscalaHoras = 2;
            }

            liquidacion.Estado = 1;
            liquidacion.Importe = liquidacion.Importe + aux;
            _context.Liquidacion.Add(liquidacion);
            _context.SaveChanges();
        }

        public async Task UpdateLiq(Liquidacion liquidacion)
        {
            if (_context.Liquidacion.Any(x => (x.Id != liquidacion.Id)))
            {
                throw new AppException("La liquidacion no existe.");
            }
            _context.Update(liquidacion);
            await _context.SaveChangesAsync();
        }

        public List<InformeDto> InformeDtos(DateTime inicio, DateTime fin)
        {
            List<Liquidacion> liquidaciones = new List<Liquidacion>(GetLiquidacionesPorFecha(inicio, fin));
            List<InformeDto> informe = _mapper.Map<List<InformeDto>>(liquidaciones);

            informe.ForEach(delegate (InformeDto i)
            {
                var empleado = (from b in _context.Empleado
                               where b.IdEmpleado == i.IdEmpleado
                               select b).ToList().ElementAt(0);
                i.ApellidoEmpleado = empleado.ApellidoEmpleado;
                i.NombreEmpleado = empleado.NombreEmpleado;

                DateTime aux = new DateTime();
                aux = aux + i.FechaHasta.Subtract(empleado.FechaIngreso);
                i.CantAnios = aux.Year;

                List<HoraTrabajada> horas = new List<HoraTrabajada>((from b in _context.HoraTrabajada
                                                                     where b.IdEmpleado == i.IdEmpleado && b.FechaHorasTrab >= i.FechaDesde && b.FechaHorasTrab <= i.FechaHasta
                                                                     select b).ToList());

                //Suma total de las horas
                i.CantHorasTrab = horas.ToList().Sum(x => x.CatidadHorasTrab);
                i.PorcentajeHoras = _context.EscalaHoras.Find(i.IdEscalaHoras).PorcentajeHoras;
                i.HorasOverBudget = horas.ToList().Sum(x => x.CatidadHorasTrab >= 8 ? x.CatidadHorasTrab - 8 : 0);
                i.CantPerfiles = horas.Select(x => x.PerfilIdPerfil).Distinct().Count();
                i.PorcentajePerfil = _context.EscalaPerfiles.Find(i.IdEscalaPerfiles).PorcentajePerfil;
                i.Porcentaje = _context.EscalaAntiguedad.Find(i.IdEscalaAntiguedad).Porcentaje;
            });
            return informe;
        }

    }
}
