using MediTrack.API.Models;

namespace MediTrack.API.DTOs.Prescription;

public class PrescriptionDto
{
    public string Dosage { get; set; } = string.Empty;
    public Frequency Frequency { get; set; }
    public DateTime StartDate { get; set; }
    public int Period { get; set; }
    public bool IsFlexible { get; set; } = false;
    public string Comment { get; set; } = string.Empty;
    public int PatientId { get; set; }
    public int MedicationId { get; set; }
}