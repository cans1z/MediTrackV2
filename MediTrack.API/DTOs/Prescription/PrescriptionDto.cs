using System.ComponentModel.DataAnnotations;
using MediTrack.API.Models;

namespace MediTrack.API.DTOs.Prescription;

public class PrescriptionDto
{
    [Required]
    public string Dosage { get; set; } = string.Empty;
    
    public Frequency Frequency { get; set; }
    [Required]
    public DateTime StartDate { get; set; }
    public int Period { get; set; }
    public bool IsFlexible { get; set; } = false;
    public string Comment { get; set; } = string.Empty;
    [Range(1, int.MaxValue, ErrorMessage = "PatientId must be valid")]
    public int PatientId { get; set; }
    [Range(1, int.MaxValue, ErrorMessage = "MedicationId must be valid")]
    public int MedicationId { get; set; }
}