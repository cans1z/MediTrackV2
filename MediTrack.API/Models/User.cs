namespace MediTrack.API.Models;

public class User
{
    public int Id { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; }  = string.Empty;
    public string PasswordHash { get; set; }  = string.Empty;
    public UserRole Role { get; set; } = UserRole.Patient;
    public bool IsBanned { get; set; } = false;
    public bool IsDeleted { get; set; } = false;
    public DateTime CreatedAt { get; set; }  = DateTime.Now;
}

public enum UserRole
{
    Administrator,
    Doctor,
    Patient
}