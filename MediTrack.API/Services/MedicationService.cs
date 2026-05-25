using MediTrack.API.Data;
using MediTrack.API.DTOs.Medication;
using MediTrack.API.Exceptions;
using MediTrack.API.Interfaces;
using MediTrack.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MediTrack.API.Services;

public class MedicationService : IMedicationService
{
    private readonly AppDbContext _context;

    public MedicationService(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<MedicationResponseDto> GetMedication(int medicationId)
    {
        var medication = await _context.Medications
            .FirstOrDefaultAsync(m => m.Id == medicationId);

        if (medication == null)
            throw new NotFoundException("Medication not found");
        
        var response = new MedicationResponseDto()
        {
            Id = medication.Id,
            Name = medication.Name,
            Description = medication.Description,
            DosageForm = medication.DosageForm
        };
        
        return response;
    }

    public async Task<List<MedicationResponseDto>> GetMedications()
    {
        var response = await _context.Medications
            .Where(m => !m.IsDeleted)
            .Select(m => new MedicationResponseDto
            {
                Id = m.Id,
                Name = m.Name,
                Description = m.Description,
                DosageForm = m.DosageForm
            })
            .ToListAsync();
        
        return response;
    }
    
    public async Task<MedicationResponseDto> AddMedication(MedicationDto dto)
    {
        var medicationExists = await _context.Medications
            .AnyAsync(m => m.Name.ToLower() == dto.Name.ToLower());
        
        if (medicationExists)
            throw new ConflictException($"Medication with name {dto.Name} already exists");

        var newMedication = new Medication
        {
            Name = dto.Name,
            Description = dto.Description,
            DosageForm = dto.DosageForm
        };
        
        await _context.Medications.AddAsync(newMedication);
        await _context.SaveChangesAsync();
        
        var response = new MedicationResponseDto
        {
            Id = newMedication.Id,
            Name = dto.Name,
            Description = dto.Description,
            DosageForm = dto.DosageForm
        };
        
        return response;
    }
    
    public async Task<MedicationResponseDto> EditMedication(int medicationId, MedicationDto dto)
    {
        var medication = await _context.Medications
            .FirstOrDefaultAsync(m => m.Id == medicationId);
        
        if (medication == null)
            throw new NotFoundException($"Medication with id {medicationId} does not exist");
        
        medication.Name = dto.Name;
        medication.Description = dto.Description;
        medication.DosageForm = dto.DosageForm;
        
        await _context.SaveChangesAsync();
        
        var response = new MedicationResponseDto
        {
            Id = medication.Id,
            Name = dto.Name,
            Description = dto.Description,
            DosageForm = dto.DosageForm
        };
        
        return response;
    }

    public async Task DeleteMedication(int medicationId)
    {
        var medication = await _context.Medications
            .FirstOrDefaultAsync(m => m.Id == medicationId);
        
        if (medication == null)
            throw new NotFoundException($"Medication with id {medicationId} does not exist");
        
        medication.IsDeleted = true;
        await _context.SaveChangesAsync();
    }
    
}