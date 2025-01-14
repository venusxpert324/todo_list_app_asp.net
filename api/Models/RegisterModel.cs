using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class RegisterModel
    {
        [Required]
        public string? username { get; set; }

        [Required]
        public string? email { get; set; }

        [Required]
        public string? password { get; set; }

    }
}