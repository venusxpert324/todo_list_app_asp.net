using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Account;
using api.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/v1/auth1")]
    [ApiController]
    public class TestController : ControllerBase
    {        

        [HttpGet]
        public string getTest()
        {
            return "This is my default action...";
        }

        [HttpPost("register")]
        public IActionResult Register([FromForm]RegisterDto registerDto)
        {
            return Ok(new { message="success" });
        }
    }
}