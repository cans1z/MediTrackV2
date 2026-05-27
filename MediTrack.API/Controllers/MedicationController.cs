using MediTrack.API.DTOs.Medication;
using MediTrack.API.Exceptions;
using MediTrack.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediTrack.API.Controllers;

[ApiController]
[Authorize]
[Route("api/medications")]
public class MedicationController : ControllerBase
{
   private readonly IMedicationService _medicationService;

   public MedicationController(IMedicationService medicationService)
   {
      _medicationService = medicationService;
   }

   [HttpGet("{id}")]
   public async Task<ActionResult<MedicationDto>> GetMedication(int id)
   {
      var medication = await _medicationService.GetMedication(id);
      return Ok(medication);
   }

   [HttpGet]
   public async Task<ActionResult<List<MedicationDto>>> GetAllMedications()
   {
      var medications = await _medicationService.GetMedications();
      return Ok(medications);
   }

   
   [HttpPost]
   [Authorize(Roles = "Administrator")] 
   public async Task<ActionResult<MedicationDto>> AddMedication([FromBody] MedicationDto dto) 
   {
      var medication = await _medicationService.AddMedication(dto);
      return CreatedAtAction(nameof(GetMedication), new { id = medication.Id }, medication);
   }

   [Authorize(Roles = "Administrator")]
   [HttpPut("{id}")]
   public async Task<ActionResult<MedicationDto>> EditMedication(int id, [FromBody] MedicationDto dto)
   {
      var medication = await _medicationService.EditMedication(id, dto);
      return Ok(medication);
   }

   [Authorize(Roles = "Administrator")]
   [HttpDelete("{id}")]
   public async Task<IActionResult> DeleteMedication(int id) 
   {
      await _medicationService.DeleteMedication(id);
      return NoContent();
   }
}