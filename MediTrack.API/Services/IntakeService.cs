using MediTrack.API.Data;
using MediTrack.API.DTOs.Intake;
using MediTrack.API.Exceptions;
using MediTrack.API.Interfaces;
using MediTrack.API.Models;
using Microsoft.EntityFrameworkCore;
using SQLitePCL;

namespace MediTrack.API.Services;

public class IntakeService : IIntakeService
{
    private readonly AppDbContext _context;

    public IntakeService(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<IntakeResponseDto> GetIntake(int intakeId, int userId, UserRole role)
    {
        var query = _context.Intakes
            .Include(p => p.Prescription)
            .ThenInclude(m => m.Medication)
            .Include(p => p.Prescription)
            .ThenInclude(d => d.Doctor)
            .AsQueryable();

        if (role != UserRole.Administrator)
            query = query.Where(i => i.UserId == userId);

        var intake = await query.FirstOrDefaultAsync(i => i.Id == intakeId);
        
        if (intake == null)
            throw new NotFoundException("Intake not found");

        var response = new IntakeResponseDto
        {
            Id = intake.Id,
            ScheduledAt = intake.ScheduledAt,
            TakenAt = intake.TakenAt,
            Comment = intake.Comment,
            MedicationName = intake.Prescription.Medication.Name,
            DoctorName = intake.Prescription.Doctor.UserName
        };

        return response;
    }

    public async Task<List<IntakeResponseDto>> GetIntakes(int userId, UserRole role)
    {
        var query = _context.Intakes
            .Include(p => p.Prescription)
            .ThenInclude(m => m.Medication)
            .Include(p => p.Prescription)
            .ThenInclude(d => d.Doctor)
            .AsQueryable();

        if (role != UserRole.Administrator)
            query = query.Where(i => i.UserId == userId);

        return await query.Select(i => new IntakeResponseDto
        {
            Id = i.Id,
            ScheduledAt = i.ScheduledAt,
            TakenAt = i.TakenAt,
            Comment = i.Comment,
            MedicationName = i.Prescription.Medication.Name,
            DoctorName = i.Prescription.Doctor.UserName
        }).ToListAsync();
    }

    public async Task<IntakeResponseDto> AddIntake(IntakeDto dto, int userId)
    {
        var prescription = await _context.Prescriptions.AnyAsync(p => p.Id == dto.PrescriptionId);
        if(!prescription)
            throw new NotFoundException("Prescription not found");
        
        var intake = new IntakeRecord
        {
            ScheduledAt = dto.ScheduledAt,
            TakenAt = dto.TakenAt,
            Comment = dto.Comment,
            PrescriptionId = dto.PrescriptionId,
            UserId = userId
        };
        
        await _context.Intakes.AddAsync(intake);
        await _context.SaveChangesAsync();
        
        var created = await _context.Intakes
            .Include(p => p.Prescription)
            .ThenInclude(m => m.Medication)
            .Include(p => p.Prescription)
            .ThenInclude(d => d.Doctor)
            .FirstOrDefaultAsync(i => i.Id == intake.Id);
        
        if (created == null)
            throw new NotFoundException("Intake record not found after creation");

        var response = new IntakeResponseDto
        {
            Id = created.Id,
            ScheduledAt = created.ScheduledAt,
            TakenAt = created.TakenAt,
            Comment = created.Comment,
            MedicationName = created.Prescription.Medication.Name,
            DoctorName = created.Prescription.Doctor.UserName
        };
        
        return response;
    }

    public async Task<IntakeResponseDto> EditIntake(int intakeId, IntakeDto dto, int userId)
    {
        var prescription = await _context.Prescriptions.AnyAsync(p => p.Id == dto.PrescriptionId);
        if(!prescription)
            throw new NotFoundException("Prescription not found");
        
        var intake = await _context.Intakes
            .Include(p => p.Prescription)
            .ThenInclude(m => m.Medication)
            .Include(p => p.Prescription)
            .ThenInclude(d => d.Doctor)
            .FirstOrDefaultAsync(i => i.Id == intakeId);
        
        if (intake == null)
            throw new NotFoundException("Intake not found");
        
        if (intake.UserId != userId)
            throw new ForbiddenException("You can't edit this record");
        
        intake.ScheduledAt = dto.ScheduledAt;
        intake.TakenAt = dto.TakenAt;
        intake.Comment = dto.Comment;
        intake.PrescriptionId = dto.PrescriptionId;
        
        await _context.SaveChangesAsync();

        var response = new IntakeResponseDto
        {
            Id = intake.Id,
            ScheduledAt = intake.ScheduledAt,
            TakenAt = intake.TakenAt,
            Comment = intake.Comment,
            MedicationName = intake.Prescription.Medication.Name,
            DoctorName = intake.Prescription.Doctor.UserName
        };
        
        return response;
    }
}