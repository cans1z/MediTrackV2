using System.ComponentModel.DataAnnotations;

namespace MediTrack.API.DTOs;

public class RegisterDto
{
    public string Name { get; set; } = string.Empty;
    [EmailAddress]
    public string Email { get; set; }  = string.Empty;
    public string Password { get; set; } = string.Empty;
}