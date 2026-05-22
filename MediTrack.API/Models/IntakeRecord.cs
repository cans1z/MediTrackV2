namespace MediTrack.API.Models;

public class IntakeRecord
{
    public int Id { get; set; }
    public DateTime DateTaken { get; set; }
    public bool IsTaken { get; set; } //0 - missed, 1 - taken
    public string Comment { get; set; } = string.Empty;
    
    public int PrescriptionId { get; set; }
    public Prescription Prescription { get; set; } = null!;
}