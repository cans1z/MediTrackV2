using MediTrack.API.Models;

namespace MediTrack.API.DTOs.Prescription;

public class PrescriptionResponseDto
{
    public int Id { get; set; }
    public string Dosage { get; set; } = string.Empty;
    public Frequency Frequency { get; set; }
    public DateTime StartDate { get; set; }
    public int Period { get; set; } = 0;
    public bool IsFlexible { get; set; } = false;
    public string Comment { get; set; } = string.Empty;
    public string PatientName { get; set; } = string.Empty;
    public string MedicationName { get; set; } = string.Empty;
    public string DoctorName { get; set; } = string.Empty;
}