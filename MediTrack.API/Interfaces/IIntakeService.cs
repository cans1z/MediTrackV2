using MediTrack.API.DTOs.Intake;
using MediTrack.API.DTOs.Prescription;
using MediTrack.API.Models;

namespace MediTrack.API.Interfaces;

public interface IIntakeService
{
    Task<IntakeResponseDto> GetIntake(int intakeId, int userId, UserRole role);
    Task<List<IntakeResponseDto>> GetIntakes(int userId, UserRole role);
    Task<IntakeResponseDto> AddIntake(IntakeDto dto, int userId);
    Task<IntakeResponseDto> EditIntake(int intakeId, IntakeDto dto, int userId);
}