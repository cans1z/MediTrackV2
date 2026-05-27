using System.Security.Claims;
using MediTrack.API.DTOs;
using MediTrack.API.Interfaces;
using MediTrack.API.Data;
using MediTrack.API.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace MediTrack.API.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context)
    {
        _context = context;
    }
    public async Task<UserResponseDto> GetUser(int userId)
    {
        var user = await _context.Users
            .Where(u => u.IsDeleted == false)
            .FirstOrDefaultAsync(u => u.Id == userId);
        
        if (user == null) throw new NotFoundException("User not found");
        
        var response = new UserResponseDto
        {
            Id = user.Id,
            UserName = user.UserName,
            Email = user.Email,
            Role = user.Role
        };
        return response;
    }
    
}