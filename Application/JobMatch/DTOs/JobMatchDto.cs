using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.JobMatch.DTOs
{
    public class JobMatchDto
    {
        public bool IsSuccess { get; set; }        // true if processing succeeded
        public bool IsQuotaExceeded { get; set; }  // true if quota limit hit
        public string? RetryAfter { get; set; }    // e.g. "15 minutes" or null if unknown
        public int MatchPercentage { get; set; }   // e.g. 85 means 85%
        public string Explanation { get; set; } = string.Empty; // detailed match explanation
        public string? ErrorMessage { get; set; }  // error message if any
    }
}
