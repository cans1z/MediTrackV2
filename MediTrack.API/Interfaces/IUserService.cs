using MediTrack.API.DTOs;

namespace MediTrack.API.Interfaces;

public interface IUserService
{
    Task<UserResponseDto> GetUser(int userId);
}