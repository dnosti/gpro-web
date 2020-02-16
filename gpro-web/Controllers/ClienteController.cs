using AutoMapper;
using gpro_web.Dtos;
using gpro_web.Helpers;
using gpro_web.Models;
using gpro_web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace gpro_web.Controllers
{
    [Authorize(Roles = "Admin, PM, Member")]
    [ApiController]
    [Route("[controller]")]
    public class ClienteController : ControllerBase
{
        private IClienteService _clienteService;
        private IMapper _mapper;
        private readonly AppSettings _appSettings;
        
        public ClienteController(
            IClienteService clienteService,
            IMapper mapper,
            IOptions <AppSettings> appSettings)
        {
            _clienteService = clienteService;
            _mapper = mapper;
            _appSettings = appSettings.Value;
        }

        [HttpGet("dato/{dato}")]
        public IActionResult BuscarCliente(string dato)
        {           
            var cliente = _clienteService.BuscarClientes(dato);
            var clienteDtos = _mapper.Map<IList<ClienteDto>>(cliente);

            if (cliente == null)
            {
                return NotFound();
            }

            return Ok(clienteDtos);
        }

        [HttpGet("cuit/{id}")]
        public IActionResult BuscarPorCuit(Int64 id)
        {
            var cliente = _clienteService.BuscarPorCuit(id);
            var clienteDtos = _mapper.Map<ClienteDto>(cliente);

            if (cliente == null)
            {
                return NotFound();
            }

            return Ok(clienteDtos);
        }

        [Authorize(Roles = "Admin,PM")]
        [HttpPut("update")]
        public async Task<IActionResult> UpdateCliente([FromBody]ClienteDto clienteDtos)
        {

            var cliente = _mapper.Map<Cliente>(clienteDtos);
            
            try
            {
                await _clienteService.UpdateClienteAsync(cliente);
                return Ok(cliente);
            }
            catch (AppException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            
        }

        [Authorize(Roles = "Admin,PM")]
        [HttpPost("new")]
        public IActionResult NuevoCliente([FromBody]ClienteDto clienteDtos)
        {
            var cliente = _mapper.Map<Cliente>(clienteDtos);

            try
            {
                _clienteService.NuevoCliente(cliente);
                return Ok(cliente);
            }
            catch (AppException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
