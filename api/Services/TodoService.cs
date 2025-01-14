using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using api.Data;
using api.Entities;
using api.Models;
using Microsoft.AspNetCore.Mvc;

namespace api.Services
{
    public interface ITodoService
    {
        List<Todo> getAllTodos(int? user_id);
        Todo GetTodoById(int id);
        void DeleteTodo(int id);
        Task<string> register(TodoRegisterModel model);
        Task<string> update(TodoRegisterModel model);
        int getUserIdFromToken(string token);
    }
    public class TodoService : ITodoService
    {
        private ApplicationDBContext _context;

        public TodoService(ApplicationDBContext context)
        {
            _context = context;
        }     

        public List<Todo> getAllTodos(int? user_id)
        {
            if(user_id > 0) {
                return _context.Todos.Where(u => u.user_id.Equals(user_id)).ToList();
            }

            return _context.Todos.ToList();
        }   

        public async Task<string> register(TodoRegisterModel model)
        {           
            var todo = new Todo
            {
                user_id = model.user_id,
                title = model.title,
                description = model.description,
                status = model.status,
                due_date = model.due_date,
            };
            _context.Todos.Add(todo);
            await _context.SaveChangesAsync();             
            return "success";
        }          
        
        public async Task<string> update(TodoRegisterModel model)
        {           
            var todo = _context.Todos.Find(model.id);
            if(todo != null) {
                todo.title = model.title;
                todo.description = model.description;
                todo.status = model.status;
                todo.due_date = model.due_date;

                _context.Todos.Update(todo);
                await _context.SaveChangesAsync();
                return "success";
            }
                         
            return "failed";
        } 

        public Todo GetTodoById(int id)
        {
            return _context.Todos.Find(id);
        } 

        public int getUserIdFromToken(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            if (!handler.CanReadToken(token))
            {
                return 0;
            }
            var jwtToken = handler.ReadJwtToken(token);  
            var email = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if(!_context.Users.Any(x=>x.email == email)) {
                return 0;
            }
            var user = _context.Users.First(x=>x.email == email);
            if(user != null) {
                return user.id;
            } 
            return 0;
        }

        public void DeleteTodo(int id)
        {
            var todo = _context.Todos.Find(id);
            if (todo != null)
            {
                _context.Todos.Remove(todo);
                _context.SaveChanges();
            }
        }
    }
}