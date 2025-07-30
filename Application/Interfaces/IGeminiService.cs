using Application.JobMatch.DTOs;
using Application.Skills.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IGeminiService
    {
        Task<JobMatchDto> GetJobMatchScoreAsync(string jobDescription, List<Domain.Experience> experiences, List<SkillGroupDto> skills, CancellationToken cancellationToken);
    }
}
