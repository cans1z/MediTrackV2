using MediTrack.API.DTOs;
using MediTrack.API.Models;

namespace MediTrack.API.Interfaces;

public interface IUserService
{
    Task<UserResponseDto> GetUser(int targetId, int requesterId, UserRole role);
    Task<List<UserResponseDto>> GetUsers();
    Task BanUser(int userId);
    Task<UserResponseDto> ChangeRole(int userId, UserRole role);
    Task DeleteUser(int userId);
}