using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Entities
{
    public class Todo
    {
        public int id { get; set; }
        public int? user_id { get; set; }
        public string? title { get; set; }
        public string? description { get; set; }
        public int? status { get; set; } = 2;
        public DateOnly? due_date { get; set; }
    }
}