namespace MediTrack.API.DTOs.Intake;

public class IntakeResponseDto
{
    public int Id { get; set; }
    public DateTime ScheduledAt { get; set; }
    public DateTime? TakenAt { get; set; }
    public bool IsTaken => TakenAt.HasValue;
    public string Comment { get; set; } = string.Empty;
    public string MedicationName { get; set; } = string.Empty;
    public string DoctorName { get; set; } = string.Empty;
}