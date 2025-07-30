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
        public string ContactInfo { get; set; } = "CANDIDATE_EMAIL | CANDIDATE_PHONE | CANDIDATE_LINKEDIN_URL | CANDIDATE_PORTFOLIO_URL";
        public string Summary { get; set; } = string.Empty;

        public List<Domain.Experience> Experience { get; set; } = new();
        public List<ProjectDto> Projects { get; set; } = new();
        public List<SkillGroupDto> Skills { get; set; } = new();
    }
}
