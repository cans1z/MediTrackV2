using MediTrack.API.DTOs;
using MediTrack.API.Exceptions;
using MediTrack.API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MediTrack.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    
    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }
    
    [HttpPost("register")]
    public async Task<ActionResult<UserResponseDto>> Register([FromBody] RegisterDto dto)
    {
        var user = await _authService.Register(dto);
        return Created(string.Empty, user);
    }
    
    [HttpPost("login")]
    public async Task<ActionResult<string>> Login([FromBody] LoginDto dto)
    {
        var token = await _authService.Login(dto);
        return Ok(token);
    }
}