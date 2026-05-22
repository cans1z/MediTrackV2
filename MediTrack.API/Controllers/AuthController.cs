using MediTrack.API.DTOs;
using MediTrack.API.Extensions;
using MediTrack.API.Interfaces;
using MediTrack.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace MediTrack.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ITokenService _tokenService;
    
    public AuthController(IAuthService authService, ITokenService tokenService)
    {
        _authService = authService;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        try
        {
            var user = await _authService.Register(dto);
            return CreatedAtAction(nameof(Register), user);
        }
        catch (ConflictException e)
        {
            return Conflict(e.Message);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        try
        {
            var token = await _authService.Login(dto);
            return Ok(token);
        }
        catch (UnauthorizedException e)
        {
            return Unauthorized(e.Message);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
        
        
    }
}