using System.ComponentModel.DataAnnotations;

namespace MediTrack.API.DTOs.Medication;

public class MedicationDto
{
    [Required]
    [MinLength(2)]
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    [Required]
    public string DosageForm { get; set; } = string.Empty;
}