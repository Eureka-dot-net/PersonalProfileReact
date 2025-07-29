using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class Project
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public string? Url { get; set; } // Public site, if available
        public string? GitHubRepo { get; set; }

        public bool IsInProgress { get; set; }

        public ICollection<ProjectImage> Images { get; set; } = new List<ProjectImage>();
    }

    public class ProjectImage
    {
        public int Id { get; set; }
        public string Url { get; set; } = string.Empty;

        public int ProjectId { get; set; }
        public Project Project { get; set; } = null!;
    }
}
