using System.Collections.Generic;

namespace Application.JobMatch.DTOs
{
    public class JobMatchListResponseDto
    {
        public List<JobMatchListDto> JobMatches { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }
}