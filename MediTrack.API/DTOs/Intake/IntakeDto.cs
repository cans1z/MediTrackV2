namespace MediTrack.API.DTOs.Intake;

public class IntakeDto
{
    public DateTime ScheduledAt { get; set; }
    public DateTime? TakenAt { get; set; }
    public bool IsTaken => TakenAt.HasValue;
    public string Comment { get; set; } = string.Empty;
    public int PrescriptionId { get; set; }
}