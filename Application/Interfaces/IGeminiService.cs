using Application.JobMatch.DTOs;
using Application.Projects.DTOs;
using Application.Skills.DTOs;
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IGeminiService
    {
        Task<JobMatchDto> GetJobMatchScoreAsync(string jobDescription, List<Domain.Experience> experiences, List<SkillGroupDto> skills, List<ProjectDto> projects, string prompt, CancellationToken cancellationToken);
    }
}
