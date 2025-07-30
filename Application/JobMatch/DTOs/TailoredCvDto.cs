using Application.Projects.DTOs;
using Application.Skills.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.JobMatch.DTOs
{
    public class TailoredCvDto
    {
        public string Name { get; set; } = "CANDIDATE_NAME";
        public string Email { get; set; } = "CANDIDATE_EMAIL";

        public string Phone { get; set; } = "CANDIDATE_PHONE";

        public string LinkedIn { get; set; } = "CANDIDATE_LINKEDIN";

        public string GitHub { get; set; } = "CANDIDATE_GITHUB";

        public string PersonalWebsite { get; set; } = "CANDIDATE_PORTFOLIO_URL";
        public string Summary { get; set; } = string.Empty;

        public List<Domain.Experience> Experience { get; set; } = new();
        public List<ProjectDto> Projects { get; set; } = new();
        public List<SkillGroupDto> Skills { get; set; } = new();
    }
}
