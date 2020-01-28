using AutoMapper;
using gpro_web.Helpers;
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
    [AllowAnonymous]
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

        [Authorize(Roles = "Admin, PM, Miembro")]
        [HttpGet("dato/{dato}")]
        public IActionResult BuscarCliente(string dato)
        {
            var cliente = _clienteService.BuscarClientes(dato);

            if (cliente == null)
            {
                return NotFound();
            }

            return Ok(cliente);
        }

        [Authorize(Roles = "Admin, PM, Miembro")]
        [HttpGet("cuit/{id}")]
        public IActionResult BuscarPorCuit(Int64 id)
        {
            var cliente = _clienteService.BuscarPorCuit(id);

            if(cliente == null)
            {
                return NotFound();
            }

            return Ok(cliente);
        }
    }
}
