namespace MediTrack.API.Models;

public class Medication
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string DosageForm { get; set; } = string.Empty;
    public bool IsDeleted { get; set; } = false;
}