using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.Account;
using api.Entities;
using api.Models;
using api.Services;
using AutoMapper;
using Azure.Core;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{

    public class Item
    {
        public string? token { get; set; }
        public User? user { get; set; }
    }

    [Route("api/v1/auth")]
    [ApiController]
    public class AccountController : ControllerBase
    {        
        private readonly ApplicationDBContext _context;    
        private IMapper _mapper;            
        private IUserService _userService;
        public AccountController(ApplicationDBContext context, IMapper mapper, IUserService userService)
        {
            _context = context;
            _mapper = mapper;
            _userService = userService;
        }
        

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] RegisterModel usermodel)
        {      
            try
            {
                var result = await _userService.create(usermodel);
                return Ok();
            }   
            catch(ApplicationException ex)                             
            {
                return BadRequest(new{ message = ex.Message });
            }
            // return Ok();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var result = await _userService.login(model);
            if(result.token != "") {
                return Ok(new {
                    token = result.token,
                    user = result.user,
                });
            }            
            
            return BadRequest(new{ message = "Invalid email or password." });
        }    

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            return Ok(new { Status = "success" });
        }  
    }
}