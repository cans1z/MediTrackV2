using MediTrack.API.DTOs.Prescription;
using MediTrack.API.Models;

namespace MediTrack.API.Interfaces;

public interface IPrescriptionService
{
    Task<PrescriptionResponseDto> GetPrescription(int prescriptionId, int userId, UserRole role);
    Task<List<PrescriptionResponseDto>> GetPrescriptions(int userId, UserRole role);
    Task<PrescriptionResponseDto> AddPrescription(PrescriptionDto dto, int doctorId);
    Task<PrescriptionResponseDto> EditPrescription(int prescriptionId, PrescriptionDto dto, int doctorId);
    Task DeactivatePrescription(int prescriptionId);
}