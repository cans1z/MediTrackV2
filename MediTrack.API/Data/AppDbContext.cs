using MediTrack.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MediTrack.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) :  base(options) { }
    
    public DbSet<User> Users { get; set; }
    public DbSet<Medication> Medications { get; set; }
    public DbSet<Prescription> Prescriptions { get; set; }
    public DbSet<IntakeRecord> Intakes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Prescription>()
            .HasOne(p => p.Doctor)
            .WithMany()
            .HasForeignKey(m => m.DoctorId)
            .OnDelete(DeleteBehavior.Restrict);
        
        modelBuilder.Entity<Prescription>()
            .HasOne(p => p.Patient)
            .WithMany()
            .HasForeignKey(m => m.PatientId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}