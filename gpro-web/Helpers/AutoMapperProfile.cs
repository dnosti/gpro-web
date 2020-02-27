using AutoMapper;
using gpro_web.Dtos;
using gpro_web.Models;
using System.Linq;

namespace WebApi.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Usuario, UserDto>()
                .ForMember(d => d.IdEmpleado, a => a.MapFrom(s => s.IdEmpleadoNavigation.IdEmpleado));
            CreateMap<UserDto, Usuario>();

            CreateMap<Cliente, ClienteDto>();
            CreateMap<ClienteDto, Cliente>();

            CreateMap<Empleado, UserEmplDto>()
                .ForMember(d => d.Id, a => a.MapFrom(s => s.Usuario.ElementAt(0).Id))
                .ForMember(d => d.IdRol, a => a.MapFrom(s => s.Usuario.ElementAt(0).IdRol))
                .ForMember(d => d.Username, a => a.MapFrom(s => s.Usuario.ElementAt(0).Username));
            CreateMap<UserEmplDto, Empleado>();

            CreateMap<Perfil, PerfilDto>();
            CreateMap<PerfilDto, Perfil>();

            CreateMap<HoraTrabajada, HoraTrabajadasDto>();
            CreateMap<HoraTrabajadasDto, HoraTrabajada>();

            CreateMap<Empleado, EmpleadoDto>()
                .ForMember(d => d.EmpleadoProyecto, a => a.MapFrom(s => s.EmpleadoProyecto));
            CreateMap<EmpleadoDto, Empleado>();

            CreateMap<EmpleadoProyecto, EmpleadoProyectoDto>()
                .ForMember(d => d.TituloProyecto, a => a.MapFrom(s => s.IdProyectoNavigation.TituloProyecto))
                .ForMember(d => d.DescripcionProyecto, a => a.MapFrom(s => s.IdProyectoNavigation.DescripcionProyecto))
                .ForMember(d => d.EstadoProyecto, a => a.MapFrom(s => s.IdProyectoNavigation.EstadoProyecto))
                .ForMember(d => d.DescripcionPerfil, a => a.MapFrom(s => s.IdEmpleadoNavigation.PerfilEmpleado.Where(x => x.ProyectoIdProyecto.Equals(s.IdProyecto)).ElementAt(0).PerfilEmpleadoIdPerfilNavigation.DescripcionPerfil));

            CreateMap<EmpleadoProyectoDto, EmpleadoProyecto>();

            CreateMap<ProyectoDto, Proyecto>();
            CreateMap<Proyecto, ProyectoDto>()
                .ForMember(d => d.NombreCliente, a => a.MapFrom(s => s.ClienteIdNavigation.NombreCliente))
                .ForMember(d => d.ApellidoCliente, a => a.MapFrom(s => s.ClienteIdNavigation.ApellidoCliente));

            CreateMap<Tarea, TareaDto>();
            CreateMap<TareaDto, Tarea>();

            CreateMap<Rol, RolDto>();
            CreateMap<RolDto, Rol>();
        }

    }
}