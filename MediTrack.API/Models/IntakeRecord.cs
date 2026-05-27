namespace MediTrack.API.Models;

public class IntakeRecord
{
    public int Id { get; set; }
    public DateTime ScheduledAt { get; set; } //когда должен принять по расписанию
    public DateTime? TakenAt { get; set; } //когда реально принял
    public bool IsTaken => TakenAt.HasValue; //0 - missed, 1 - taken
    public string Comment { get; set; } = string.Empty;
    
    
    public int PrescriptionId { get; set; }
    public Prescription Prescription { get; set; } = null!;
    
    public int UserId { get; set; }
    public User User { get; set; } = null!;
}