using System.Security.Claims;
using MediTrack.API.DTOs.Intake;
using MediTrack.API.Exceptions;
using MediTrack.API.Interfaces;
using MediTrack.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediTrack.API.Controllers;

[ApiController]
[Authorize]
[Route("api/intakes")]
public class IntakeController : ControllerBase
{
    private readonly IIntakeService _intakeService;

    public IntakeController(IIntakeService intakeService)
    {
        _intakeService = intakeService;
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<IntakeResponseDto>> GetIntake(int id)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        try
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = Enum.Parse<UserRole>(User.FindFirstValue(ClaimTypes.Role)!);
            var prescription = await _intakeService.GetIntake(id, userId, role);
            return Ok(prescription);
        }
        catch (NotFoundException e)
        {
            return NotFound(e.Message);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    
    [HttpGet]
    public async Task<ActionResult<List<IntakeResponseDto>>> GetIntakes()
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        try
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = Enum.Parse<UserRole>(User.FindFirstValue(ClaimTypes.Role)!);
            var prescription = await _intakeService.GetIntakes(userId, role);
            return Ok(prescription);
        }
        catch (NotFoundException e)
        {
            return NotFound(e.Message);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost]
    public async Task<ActionResult<IntakeResponseDto>> AddIntake([FromBody] IntakeDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        try
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var intake = await _intakeService.AddIntake(dto, userId);
            return CreatedAtAction(nameof(GetIntake), new { id = intake.Id }, intake);
        }
        catch (ForbiddenException e)
        {
            return StatusCode(403, e.Message);
        }
        catch (Exception e)
        {
            return BadRequest(e.InnerException?.Message ?? e.Message);
        }
    }
    
    [HttpPut("{id}")]
    public async Task<ActionResult<IntakeResponseDto>> EditIntake(int id, [FromBody] IntakeDto dto)
    {
        if(!ModelState.IsValid)
            return BadRequest(ModelState);
        try
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var prescription = await _intakeService.EditIntake(id, dto, userId);
            return Ok(prescription);
        }
        catch (ForbiddenException e)
        {
            return StatusCode(403, e.Message);
        }
        catch (NotFoundException e)
        {
            return NotFound(e.Message);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    
}