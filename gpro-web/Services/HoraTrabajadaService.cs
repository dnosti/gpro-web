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
        List<Object> HorasPorProyecto(int idProyecto);
        List<Object> HorasPorRecurso(int idEmpleado, DateTime inicio, DateTime fin);


    }
}