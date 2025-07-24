using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Skills.DTOs
{
    public class SkillGroupDto
    {
        public string Category { get; set; } = string.Empty;
        public List<string> Skills { get; set; } = new();
    }
}
