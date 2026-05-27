using System.Security.Claims;
using MediTrack.API.DTOs;
using MediTrack.API.Interfaces;
using MediTrack.API.Data;
using MediTrack.API.Exceptions;
using MediTrack.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MediTrack.API.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context)
    {
        _context = context;
    }
    public async Task<UserResponseDto> GetUser(int targetId, int requesterId, UserRole role)
    {
        if (role != UserRole.Administrator && targetId != requesterId)
            throw new ForbiddenException("You can't view other users");

        var user = await _context.Users
            .Where(u => !u.IsDeleted)
            .FirstOrDefaultAsync(u => u.Id == targetId);
        
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

    public async Task<List<UserResponseDto>> GetUsers()
    {
        var users = await _context.Users
            .Where(u => !u.IsDeleted)
            .Select(u => new UserResponseDto
            {
                Id = u.Id,
                UserName = u.UserName,
                Email = u.Email,
                Role = u.Role
            })
            .ToListAsync();
        
        return users;
    }

    public async Task BanUser(int userId)
    {
        var user = await _context.Users
            .Where(u => u.Id == userId)
            .Where(u => !u.IsDeleted)
            .FirstOrDefaultAsync();
        
        if (user == null) 
            throw new NotFoundException("User not found");
        
        user.IsBanned = !user.IsBanned;
        await _context.SaveChangesAsync();
    }

    public async Task<UserResponseDto> ChangeRole(int userId, UserRole role)
    {
        var user = await _context.Users
            .Where(u => u.Id == userId)
            .Where(u => !u.IsDeleted)
            .FirstOrDefaultAsync();
        
        if (user == null) 
            throw new NotFoundException("User not found");
        
        user.Role = role;
        
        await _context.SaveChangesAsync();
        
        var response = new UserResponseDto
        {
            Id = user.Id,
            UserName = user.UserName,
            Email = user.Email,
            Role = user.Role
        };
        return response;
    }
    
    public async Task DeleteUser(int userId)
    {
        var user = await _context.Users
            .Where(u => u.Id == userId)
            .Where(u => !u.IsDeleted)
            .FirstOrDefaultAsync();
        
        if (user == null) 
            throw new NotFoundException("User not found");
        
        user.IsDeleted = !user.IsDeleted;
        await _context.SaveChangesAsync();
    }
}