using System.Security.Claims;
using MediTrack.API.DTOs.Prescription;
using MediTrack.API.Exceptions;
using MediTrack.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediTrack.API.Controllers;

[ApiController]
[Authorize]
[Route("api/prescriptions")]
public class PrescriptionController : ControllerBase
{
    private readonly IPrescriptionService _prescriptionService;

    public PrescriptionController(IPrescriptionService prescriptionService)
    {
        _prescriptionService = prescriptionService;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PrescriptionResponseDto>> GetPrescription(int id)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        try
        {
            var prescription = await _prescriptionService.GetPrescription(id);
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
    public async Task<ActionResult<List<PrescriptionResponseDto>>> GetPrescriptions()
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        try
        {
            var prescriptions = await _prescriptionService.GetPrescriptions();
            return Ok(prescriptions);
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
    [Authorize(Roles = "Administrator,Doctor")]
    public async Task<ActionResult<PrescriptionResponseDto>> AddPrescription([FromBody] PrescriptionDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        try
        {
            var doctorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var prescription = await _prescriptionService.AddPrescription(dto, doctorId);
            return CreatedAtAction(nameof(GetPrescription), new { id = prescription.Id }, prescription);
        }
        catch (Exception e)
        {
            return BadRequest(e.InnerException?.Message ?? e.Message);
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Administrator,Doctor")]
    public async Task<ActionResult<PrescriptionResponseDto>> EditPrescription(int id, [FromBody] PrescriptionDto dto)
    {
        if(!ModelState.IsValid)
            return BadRequest(ModelState);
        try
        {
            var prescription = await _prescriptionService.EditPrescription(id, dto);
            return Ok(prescription);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Administrator, Doctor")]
    public async Task<IActionResult> DeactivatePrescription(int id)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        try
        {
            await _prescriptionService.DeactivatePrescription(id);
            return NoContent();
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