using MediTrack.API.Data;
using MediTrack.API.DTOs;
using MediTrack.API.Exceptions;
using MediTrack.API.Interfaces;
using MediTrack.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MediTrack.API.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly ITokenService _tokenService;

    public AuthService(AppDbContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }
    
    
    public async Task<UserResponseDto> Register(RegisterDto dto)
    {
        var userExists = await _context.Users
            .AnyAsync(u => u.UserName.ToLower() == dto.UserName.ToLower() || u.Email.ToLower() == dto.Email.ToLower());

        if (userExists)
        {
            throw new ConflictException($"User with name {dto.UserName} or email {dto.Email} already exists");
        }

        string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        var newUser = new User
        {
            UserName = dto.UserName,
            Email = dto.Email,
            PasswordHash = passwordHash,
            Role = dto.Role
        };
        
        await _context.Users.AddAsync(newUser);
        await _context.SaveChangesAsync();

        var response = new UserResponseDto
        {
            Id = newUser.Id,
            UserName = newUser.UserName,
            Email = newUser.Email,
            Role = newUser.Role
        };
        return response;
    }

    public async Task<string> Login(LoginDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.UserName == dto.UserName);
        
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new UnauthorizedException("Invalid credentials");
        if (user.IsBanned)
            throw new UnauthorizedException("User is banned");
        
        return _tokenService.GenerateToken(user);
    }
}