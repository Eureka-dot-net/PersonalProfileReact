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
        public string Title { get; set; }             // e.g. "DevOps Consultant"
        public string Company { get; set; }           // e.g. "ALM Online"
        public string Location { get; set; }          // e.g. "UK / Remote"
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }        // null if current
        public List<string> Highlights { get; set; }  // Bullet points of achievements
    }

}
