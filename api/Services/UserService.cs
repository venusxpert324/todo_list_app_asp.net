using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using api.Controllers;
using api.Data;
using api.Entities;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace api.Services
{
    public interface IUserService
    {
        Task<string> create(RegisterModel model);
        Task<Item> login(LoginModel model);
    }
    public class UserService : IUserService
    {
        private ApplicationDBContext _context;
        private readonly IConfiguration _configuration;
        public UserService(ApplicationDBContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<Item> login(LoginModel model)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.email == model.email);
            if (user == null || !VerifyPassword(model.password, user.password)) {
                return new Item{ token="",user=null};
            }                

            return new Item{ token = GenerateJwtToken(user.email), user=user};
            // return GenerateJwtToken(user.username);
        }
        public async Task<string> create(RegisterModel model)
        {
            if(string.IsNullOrWhiteSpace(model.password)) {
                throw new ApplicationException("Password is required.");
            }
            if(_context.Users.Any(x=>x.email == model.email)) {
                throw new ApplicationException("email exists");
            }
            var user = new User
            {
                username = model.username,
                email = model.email,
                password = HashPassword(model.password)
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();             
            return "success";
        }        

        public static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }

        public static bool VerifyPassword(string password, string hashedPassword)
        {
            return HashPassword(password) == hashedPassword;
        }

        private string GenerateJwtToken(string useremail)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Email, useremail),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}