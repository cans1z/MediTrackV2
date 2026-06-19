using System.Security.Claims;
using MediTrack.API.DTOs;
using MediTrack.API.Interfaces;
using MediTrack.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediTrack.API.Controllers;

[ApiController]
[Authorize]
[Route("api/user")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }
    
    [HttpGet("me")]
    public async Task<ActionResult<UserResponseDto>> GetMe()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = Enum.Parse<UserRole>(User.FindFirstValue(ClaimTypes.Role)!);
        var user = await _userService.GetUser(userId, userId, role);
        return Ok(user);
    }
    
    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<UserResponseDto>> GetUser(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = Enum.Parse<UserRole>(User.FindFirstValue(ClaimTypes.Role)!);
        var user = await _userService.GetUser(id, userId, role);
        return Ok(user);
    }

    [HttpGet]
    [Authorize(Roles = "Administrator")]
    public async Task<ActionResult<List<UserResponseDto>>> GetUsers()
    {
        var users = await _userService.GetUsers();
        return Ok(users);
    }


    [HttpPut("{id}/role")]
    [Authorize(Roles = "Administrator")]
    public async Task<ActionResult<UserResponseDto>> ChangeRole(int id, [FromBody] UserRole role)
    {
        var user = await _userService.ChangeRole(id, role);
        return Ok(user);
    }

    [HttpPut("{id}/ban")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> BanUser(int id)
    {
        await _userService.BanUser(id);
        return NoContent();
    }
    [HttpDelete("{id}")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        await _userService.DeleteUser(id);
        return NoContent();
    }
    
}