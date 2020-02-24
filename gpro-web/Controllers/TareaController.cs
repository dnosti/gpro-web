using AutoMapper;
using gpro_web.Helpers;
using gpro_web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace gpro_web.Controllers
{
    public class TareaController : Controller
    {
        private ITareaService _tareaService;
        private IMapper _mapper;
        private readonly AppSettings _appSettings;

        public TareaController(
            ITareaService tareaService,
            IMapper mapper,
            IOptions<AppSettings> appSettings)
        {
            _tareaService = tareaService;
            _mapper = mapper;
            _appSettings = appSettings.Value;
        }

        // GET: /<controller>/
        [HttpGet("{id}")]
        public IActionResult GetTareaPorId([FromRoute] int id)
        {
            return Ok(_tareaService.GetTareaPorId(id));
        }
    }
}
