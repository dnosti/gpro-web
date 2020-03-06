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
}
    public class LiquidacionService : ILiquidacionService
    {
        private gpro_dbContext _context;

        public LiquidacionService(gpro_dbContext context)
        {
            _context = context;
        }

        public Liquidacion GetLiquidacion (int id)
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

        public List<Liquidacion> GetLiquidacionesPorFecha (DateTime inicio, DateTime fin)
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
            if (_context.Liquidacion.Any(x => (x.FechaDesde == liquidacion.FechaDesde && x.FechaHasta == liquidacion.FechaHasta && x.Estado == 1)))
            {
                throw new AppException("Ya existe una liquidación pagada para el mismo período");
            }
            _context.Add(liquidacion);
            _context.SaveChanges();
        }
        //public async Task UpdateLiq()

    }
}
