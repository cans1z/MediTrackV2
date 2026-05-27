using System.Security.Claims;
using MediTrack.API.DTOs.Prescription;
using MediTrack.API.Exceptions;
using MediTrack.API.Interfaces;
using MediTrack.API.Models;
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
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = Enum.Parse<UserRole>(User.FindFirstValue(ClaimTypes.Role)!);
        var prescription = await _prescriptionService.GetPrescription(id, userId, role);
        return Ok(prescription);
    }

    [HttpGet]
    public async Task<ActionResult<List<PrescriptionResponseDto>>> GetPrescriptions()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = Enum.Parse<UserRole>(User.FindFirstValue(ClaimTypes.Role)!);
        var prescriptions = await _prescriptionService.GetPrescriptions(userId, role);
        return Ok(prescriptions);
    }

    [HttpPost]
    [Authorize(Roles = "Administrator,Doctor")]
    public async Task<ActionResult<PrescriptionResponseDto>> AddPrescription([FromBody] PrescriptionDto dto)
    {
        var doctorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var prescription = await _prescriptionService.AddPrescription(dto, doctorId);
        return CreatedAtAction(nameof(GetPrescription), new { id = prescription.Id }, prescription);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Administrator,Doctor")]
    public async Task<ActionResult<PrescriptionResponseDto>> EditPrescription(int id, [FromBody] PrescriptionDto dto)
    {
        var doctorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var prescription = await _prescriptionService.EditPrescription(id, dto, doctorId);
        return Ok(prescription);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Administrator,Doctor")]
    public async Task<IActionResult> DeactivatePrescription(int id)
    {
        await _prescriptionService.DeactivatePrescription(id);
        return NoContent();
    }
}