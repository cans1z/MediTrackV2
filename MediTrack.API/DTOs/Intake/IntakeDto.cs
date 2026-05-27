using System.ComponentModel.DataAnnotations;

namespace MediTrack.API.DTOs.Intake;

public class IntakeDto
{
    [Required]
    public DateTime ScheduledAt { get; set; }
    public DateTime? TakenAt { get; set; }
    public bool IsTaken => TakenAt.HasValue;
    public string Comment { get; set; } = string.Empty;
    [Range(1, int.MaxValue, ErrorMessage = "PrescriptionId must be valid")]
    public int PrescriptionId { get; set; }
}