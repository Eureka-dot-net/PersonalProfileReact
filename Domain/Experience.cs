using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class Experience
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;             // e.g. "DevOps Consultant"
        public string Company { get; set; } = string.Empty;           // e.g. "ALM Online"
        public string Location { get; set; } = string.Empty;          // e.g. "UK / Remote"
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }        // null if current
        public List<string> Highlights { get; set; } = new();  // Bullet points of achievements
    }

}
