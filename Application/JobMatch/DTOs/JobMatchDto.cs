using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.JobMatch.DTOs
{
    public class JobMatchDto
    {
        public bool IsSuccess { get; set; }
        public bool IsQuotaExceeded { get; set; }
        public string? RetryAfter { get; set; }
        public string? ErrorMessage { get; set; }

        public JobInformationDto JobInformation { get; set; } = new();
        public MatchEvaluationDto MatchEvaluation { get; set; } = new();
        public TailoredCvDto TailoredCv { get; set; } = new();
    }
}
