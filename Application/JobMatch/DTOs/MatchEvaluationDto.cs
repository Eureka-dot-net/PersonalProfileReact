using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.JobMatch.DTOs
{
    public class MatchEvaluationDto
    {
        public int MatchPercentage { get; set; }
        public string Explanation { get; set; } = string.Empty; // plain text with \n for breaks
    }
}
