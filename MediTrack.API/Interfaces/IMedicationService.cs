using MediTrack.API.DTOs.Medication;

namespace MediTrack.API.Interfaces;

public interface IMedicationService
{
    Task<MedicationResponseDto> GetMedication(int medicationId);
    Task<List<MedicationResponseDto>> GetMedications();
    
    Task<MedicationResponseDto> AddMedication(MedicationDto dto);
    Task<MedicationResponseDto> EditMedication(int medicationId, MedicationDto dto);
    Task DeleteMedication(int medicationId);
}