using MediTrack.API.DTOs;
using MediTrack.API.Models;

namespace MediTrack.API.Interfaces;

public interface IAuthService
{
    Task<User> Register(RegisterDto dto);
    Task<string> Login(LoginDto dto);
}