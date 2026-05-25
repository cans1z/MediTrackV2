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
      if (!ModelState.IsValid)
         return BadRequest(ModelState);
      try
      {
         var medication = await _medicationService.GetMedication(id);
         return Ok(medication);
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
   public async Task<ActionResult<List<MedicationDto>>> GetAllMedications()
   {
      if (!ModelState.IsValid)
         return BadRequest(ModelState);
      try
      {
         var medications = await _medicationService.GetMedications();
         return Ok(medications);
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

   [Authorize(Roles = "Administrator")] 
   [HttpPost]
   public async Task<ActionResult<MedicationDto>> AddMedication([FromBody] MedicationDto dto) 
   {
      if (!ModelState.IsValid)
         return BadRequest(ModelState);
      try
      {
         var medication = await _medicationService.AddMedication(dto);
         return CreatedAtAction(nameof(GetMedication), new { id = medication.Id }, medication);
      }
      catch (ConflictException e)
      {
         return Conflict(e.Message);
      }
      catch (Exception e)
      {
         return BadRequest(e.Message);
      }
   }

   [Authorize(Roles = "Administrator")]
   [HttpPut("{id}")]
   public async Task<ActionResult<MedicationDto>> EditMedication(int id, [FromBody] MedicationDto dto)
   {
      if (!ModelState.IsValid)
         return BadRequest(ModelState);
      try
      {
         var medication = await _medicationService.EditMedication(id, dto);
         return Ok(medication);
      }
      catch (ConflictException e)
      {
         return Conflict(e.Message);
      }
      catch (Exception e)
      {
         return BadRequest(e.Message);
      }
   }

   [Authorize(Roles = "Administrator")]
   [HttpDelete("{id}")]
   public async Task<IActionResult> DeleteMedication(int id) 
   {
      if (!ModelState.IsValid)
         return BadRequest(ModelState);
      try
      {
         await _medicationService.DeleteMedication(id);
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