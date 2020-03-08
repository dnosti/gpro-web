using AutoMapper;
using gpro_web.Helpers;
using gpro_web.Services;
using gpro_web.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using gpro_web.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;

namespace gpro_web.Controllers
{
  [ApiController]
  [Route("[controller]")]
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
    [Authorize(Roles = "Admin, PM, Member")]
    [HttpGet("{id}")]
    public IActionResult GetTareaPorId([FromRoute] int id)
    {
      return Ok(_mapper.Map<TareaDto>(_tareaService.GetTareaPorId(id)));
    }

    [Authorize(Roles = "Admin, PM")]
    [HttpGet("")]
    public IActionResult GetAll()
    {
      var tareas = _tareaService.GetAll();

      if (tareas == null)
      {
        return NotFound();
      }

      var tareasDtos = _mapper.Map<IList<TareaDto>>(tareas);

      return Ok(tareasDtos);
    }

    [Authorize(Roles = "PM")]
    [HttpPost]
    public async Task<IActionResult> NuevaTarea([FromBody] TareaDto tarea)
    {
      try
      {
        await _tareaService.NuevaTarea(_mapper.Map<Tarea>(tarea));
        return Ok(tarea);
      }
      catch (AppException ex)
      {
        return BadRequest(new { message = ex.Message });
      }
    }
    
    [Authorize(Roles = "PM")]
    [HttpPut]
    public async Task<IActionResult> UpdateTarea([FromBody] TareaDto tareaDto)
    {
      var tarea = _mapper.Map<Tarea>(tareaDto);
      try
      {
        await _tareaService.UpdateTarea(tarea);
        return Ok(tarea);
      }
      catch (AppException ex)
      {
        return BadRequest(new { message = ex.Message });
      }
    }
  }
}
