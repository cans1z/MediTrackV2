using MediTrack.API.DTOs.Prescription;

namespace MediTrack.API.Interfaces;

public interface IPrescriptionService
{
    Task<PrescriptionResponseDto> GetPrescription(int prescriptionId);
    Task<List<PrescriptionResponseDto>> GetPrescriptions();
    Task<PrescriptionResponseDto> AddPrescription(PrescriptionDto dto, int doctorId);
    Task<PrescriptionResponseDto> EditPrescription(int prescriptionId, PrescriptionDto dto);
    Task DeactivatePrescription(int prescriptionId);
}