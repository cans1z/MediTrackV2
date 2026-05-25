using MediTrack.API.Data;
using MediTrack.API.DTOs.Prescription;
using MediTrack.API.Exceptions;
using MediTrack.API.Interfaces;
using MediTrack.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MediTrack.API.Services;

public class PrescritptionService : IPrescriptionService
{
    private readonly AppDbContext _context;

    public PrescritptionService(AppDbContext context)
    {
        _context = context;
    }


    public async Task<PrescriptionResponseDto> GetPrescription(int prescriptionId)
    {
        var prescription = await _context.Prescriptions
            .Include(p => p.Patient)
            .Include(p => p.Doctor)
            .Include(p => p.Medication)
            .FirstOrDefaultAsync(p => p.Id == prescriptionId);

        if (prescription == null)
            throw new NotFoundException("Prescription not found");

        var response = new PrescriptionResponseDto
        {
            Id = prescription.Id,
            Dosage = prescription.Dosage,
            PatientName = prescription.Patient.UserName,
            MedicationName = prescription.Medication.Name,
            DoctorName = prescription.Doctor.UserName,
            StartDate = prescription.StartDate,
            Period = prescription.Period,
            Frequency = prescription.Frequency,
            IsFlexible = prescription.IsFlexible,
            Comment = prescription.Comment
        };
        
        return response;
    }

    public async Task<List<PrescriptionResponseDto>> GetPrescriptions()
    {
        var response = await _context.Prescriptions
            .Include(p => p.Patient)
            .Include(p => p.Doctor)
            .Include(p => p.Medication)
            .Where(p => p.IsActive)
            .Select(p => new PrescriptionResponseDto
            {
                Id = p.Id,
                Dosage = p.Dosage,
                PatientName = p.Patient.UserName,
                MedicationName = p.Medication.Name,
                DoctorName = p.Doctor.UserName,
                StartDate = p.StartDate,
                Period = p.Period,
                Frequency = p.Frequency,
                IsFlexible = p.IsFlexible,
                Comment = p.Comment
            })
            .ToListAsync();
        
        return response;
    }

    public async Task<PrescriptionResponseDto> AddPrescription(PrescriptionDto dto, int doctorId)
    {
        var prescription = new Prescription
        {
            Dosage = dto.Dosage,
            PatientId = dto.PatientId,
            MedicationId = dto.MedicationId,
            DoctorId = doctorId,
            StartDate = dto.StartDate,
            Period = dto.Period,
            Frequency = dto.Frequency,
            IsFlexible = dto.IsFlexible,
            Comment = dto.Comment
        };
        
        await _context.Prescriptions.AddAsync(prescription);
        await _context.SaveChangesAsync();

        var created = await _context.Prescriptions
            .Include(p => p.Patient)
            .Include(p => p.Doctor)
            .Include(p => p.Medication)
            .FirstOrDefaultAsync(p => p.Id == prescription.Id);
        
        if (created == null)
            throw new NotFoundException("Prescription not found after creation");
        
        var response = new PrescriptionResponseDto
        {
            Id = created.Id,
            Dosage = created.Dosage,
            PatientName = created.Patient.UserName,
            MedicationName = created.Medication.Name,
            DoctorName = created.Doctor.UserName,
            StartDate = created.StartDate,
            Period = created.Period,
            Frequency = created.Frequency,
            IsFlexible = created.IsFlexible,
            Comment = created.Comment
        };
        
        return response;
    }

    public async Task<PrescriptionResponseDto> EditPrescription(int prescriptionId, PrescriptionDto dto)
    {
        var prescription = await _context.Prescriptions
            .Include(p => p.Patient)
            .Include(p => p.Doctor)
            .Include(p => p.Medication)
            .FirstOrDefaultAsync(p => p.Id == prescriptionId);
        
        if (prescription == null)
            throw new NotFoundException("Prescription not found");
        
        prescription.Dosage = dto.Dosage;
        prescription.PatientId = dto.PatientId;
        prescription.MedicationId = dto.MedicationId;
        prescription.StartDate = dto.StartDate;
        prescription.Period = dto.Period;
        prescription.Frequency = dto.Frequency;
        prescription.IsFlexible = dto.IsFlexible;
        prescription.Comment = dto.Comment;
        
        await _context.SaveChangesAsync();
        
        var response = new PrescriptionResponseDto
        {
            Id = prescription.Id,
            Dosage = prescription.Dosage,
            PatientName = prescription.Patient.UserName,
            MedicationName = prescription.Medication.Name,
            DoctorName = prescription.Doctor.UserName,
            StartDate = prescription.StartDate,
            Period = prescription.Period,
            Frequency = prescription.Frequency,
            IsFlexible = prescription.IsFlexible,
            Comment = prescription.Comment
        };
        
        return response;
    }

    public async Task DeactivatePrescription(int prescriptionId)
    {
        var prescription = await _context.Prescriptions
            .FirstOrDefaultAsync(p => p.Id == prescriptionId);
        
        if (prescription == null)
            throw new NotFoundException("Prescription not found");
        
        prescription.IsActive = false;
        await _context.SaveChangesAsync();
    }
}