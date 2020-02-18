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
            CreateMap<Usuario, UserDto>();
            CreateMap<UserDto, Usuario>();

            CreateMap<Cliente, ClienteDto>();
            CreateMap<ClienteDto, Cliente>();

            CreateMap<Empleado, UserEmplDto>()
                .ForMember(d => d.Id, a => a.MapFrom(s => s.Usuario.ElementAt(0).Id))
                .ForMember(d => d.IdRol, a => a.MapFrom(s => s.Usuario.ElementAt(0).IdRol))
                .ForMember(d => d.Username, a => a.MapFrom(s => s.Usuario.ElementAt(0).Username));
            CreateMap<UserEmplDto, Empleado>();

            CreateMap<HoraTrabajada, HoraTrabajadasDto>();
            CreateMap<HoraTrabajadasDto, HoraTrabajada>();

            CreateMap<Empleado, EmpleadoDto>();
            CreateMap<EmpleadoDto, Empleado>();

            CreateMap<ProyectoDto, Proyecto>();
            CreateMap<Proyecto, ProyectoDto>()
                .ForMember(d => d.NombreCliente, a => a.MapFrom(s => s.ClienteIdNavigation.NombreCliente))
                .ForMember(d => d.ApellidoCliente, a => a.MapFrom(s => s.ClienteIdNavigation.ApellidoCliente));

            CreateMap<TareasDto, Tarea>();
            CreateMap<Tarea, TareasDto>()
                .ForMember(d => d.NombreEmpleado, a => a.MapFrom(s => s.PerfilEmpleado.PerfilEmpleadoIdEmpleadoNavigation.NombreEmpleado))
                .ForMember(d => d.ApellidoEmpleado, a => a.MapFrom(s => s.PerfilEmpleado.PerfilEmpleadoIdEmpleadoNavigation.ApellidoEmpleado))
                .ForMember(d => d.Dni, a => a.MapFrom(s => s.PerfilEmpleado.PerfilEmpleadoIdEmpleadoNavigation.Dni))
                .ForMember(d => d.DescripcionPerfil, a => a.MapFrom(s => s.PerfilEmpleado.PerfilEmpleadoIdPerfilNavigation.DescripcionPerfil))
                .ForMember(d => d.ValorHora, a => a.MapFrom(s => s.PerfilEmpleado.PerfilEmpleadoIdPerfilNavigation.ValorHora));

            CreateMap<PerfilEmpleadoDto, PerfilEmpleado>();
            CreateMap<PerfilEmpleado, PerfilEmpleadoDto>()
                .ForMember(d => d.NombreEmpleado, a => a.MapFrom(s => s.PerfilEmpleadoIdEmpleadoNavigation.NombreEmpleado))
                .ForMember(d => d.ApellidoEmpleado, a => a.MapFrom(s => s.PerfilEmpleadoIdEmpleadoNavigation.ApellidoEmpleado))
                .ForMember(d => d.Dni, a => a.MapFrom(s => s.PerfilEmpleadoIdEmpleadoNavigation.Dni))
                .ForMember(d => d.FechaIngreso, a => a.MapFrom(s => s.PerfilEmpleadoIdEmpleadoNavigation.FechaIngreso))
                .ForMember(d => d.DescripcionPerfil, a => a.MapFrom(s => s.PerfilEmpleadoIdPerfilNavigation.DescripcionPerfil))
                .ForMember(d => d.ValorHora, a => a.MapFrom(s => s.PerfilEmpleadoIdPerfilNavigation.ValorHora));

            CreateMap<PerfilDto, Perfil>();
            CreateMap<Perfil, PerfilDto>();
        }

    }
}