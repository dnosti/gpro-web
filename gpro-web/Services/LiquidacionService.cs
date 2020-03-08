using gpro_web.Helpers;
using gpro_web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace gpro_web.Services
{
    public interface ILiquidacionService
    {
        Liquidacion GetLiquidacion(int id);
        List<Liquidacion> GetLiquidacionesPorFecha(DateTime inicio, DateTime fin);
        void NuevaLiquidacion(Liquidacion liquidacion);
        Task UpdateLiq(Liquidacion liquidacion);
    }
    public class LiquidacionService : ILiquidacionService
    {
        private gpro_dbContext _context;

        public LiquidacionService(gpro_dbContext context)
        {
            _context = context;
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

            var horas = from b in _context.HoraTrabajada
                        where b.IdEmpleado == liquidacion.IdEmpleado && b.FechaHorasTrab >= liquidacion.FechaDesde && b.FechaHorasTrab <= liquidacion.FechaHasta
                        select b;

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

    }
}
