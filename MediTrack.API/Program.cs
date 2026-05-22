using System.Text;
using System.Text.Json.Serialization;
using MediTrack.API.Data;
using MediTrack.API.Interfaces;
using MediTrack.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace MediTrack.API;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        //подключание DbContext через DI
        builder.Services.AddDbContext<AppDbContext>(options =>
        {
            var provider = builder.Configuration["DatabaseProvider"];

            if (provider == "postgres")
            {
                options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
            }
            else
            {
                options.UseSqlite(builder.Configuration.GetConnectionString("SqliteConnection"));
            }
        });

        //контроллеры
        builder.Services.AddControllers()
            .AddJsonOptions(options =>
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
        
        //services
        builder.Services.AddScoped<IAuthService, AuthService>();
        builder.Services.AddScoped<ITokenService, TokenService>();
        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]!)),
                    ValidateIssuer = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    ValidateLifetime = false // пока токен вечный
                };
            });
        

        //swagger
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();
        app.Run();
    }
}