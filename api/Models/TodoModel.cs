using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class TodoModel
    {
        [Required]
        public int? user_id { get; set; }
        [Required]
        public string? title { get; set; }
        [Required]
        public string? description { get; set; }
        [Required]
        public int? status { get; set; }
        [Required]
        public DateOnly? due_date { get; set; }
    }
}