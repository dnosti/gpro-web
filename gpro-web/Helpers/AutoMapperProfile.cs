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
        }

    }
}