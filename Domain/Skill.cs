using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Domain
{
    public class Skill
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public int SkillCategoryId { get; set; }
        
        public SkillCategory SkillCategory { get; set; } = null!;
    }
    public class SkillCategory
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;

        public ICollection<Skill> Skills { get; set; } = new List<Skill>();
    }
}
