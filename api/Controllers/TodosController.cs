using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using api.Data;
using api.Models;
using api.Services;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace api.Controllers
{
    [Route("api/v1/todos")]
    [ApiController]
    public class TodosController : ControllerBase
    {
        private readonly ApplicationDBContext _context;  
        private IMapper _mapper;  
        private ITodoService _todoService;
        public TodosController(ApplicationDBContext context, ITodoService todoService, IMapper mapper)
        {
            _context = context;
            _todoService = todoService;
            _mapper = mapper;
        }

        [HttpGet("")]
        public IActionResult GetAllTodos()
        {
            var token = Request.Headers["Authorization"];
            var user_id = _todoService.getUserIdFromToken(token);
            var result = _todoService.getAllTodos(user_id);

            return Ok(new { todo_list = result });
        }

        [HttpGet("find/{id}")]
        public IActionResult GetTodoById(int id)
        {            
            var todo =  _todoService.GetTodoById(id);
            return Ok(new { todo = todo });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTodo(int id)
        {
            _todoService.DeleteTodo(id);
            return Ok();
        }
        public async Task<IActionResult> Register([FromForm] TodoRegisterModel model)
        {                    
            var user_id = _todoService.getUserIdFromToken(model.token);
            if(user_id > 0) {
                model.user_id = user_id;
            }      

            try
            {
                var result = model.id == 0 ? await _todoService.register(model) : await _todoService.update(model);
                return Ok();
            }   
            catch(ApplicationException ex)                             
            {
                return BadRequest(new{ message = ex.Message });
            }
        }

    }
}