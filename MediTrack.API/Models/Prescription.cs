using System.ComponentModel.DataAnnotations.Schema;

namespace MediTrack.API.Models;

public class Prescription
{
    public int Id { get; set; }
    public string Dosage { get; set; } =  string.Empty;
    public Frequency Frequency { get; set; } = Frequency.OnceADay;
    public DateTime StartDate { get; set; }
    public int Period { get; set; }
    public bool IsFlexible { get; set; } =  false;
    public bool IsActive { get; set; } = true;
    public string Comment { get; set; } =  string.Empty;
    
    public int DoctorId { get; set; }
    [ForeignKey("DoctorId")] 
    public User Doctor { get; set; } = null!;
    
    public int  PatientId { get; set; }
    [ForeignKey("PatientId")] 
    public User Patient { get; set; } = null!;
    
    public int MedicationId { get; set; }
    public Medication Medication { get; set; } = null!;
    
}

public enum Frequency
{
    OnceADay,
    TwiceADay,
    ThriceADay,
    EveryOtherDay,
    Weekly
}