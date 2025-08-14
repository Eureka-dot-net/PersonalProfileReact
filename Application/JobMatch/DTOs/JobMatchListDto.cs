using System;

namespace Application.JobMatch.DTOs
{
    public class JobMatchListDto
    {
        public Guid Id { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public string Company { get; set; } = string.Empty;
        public decimal MatchPercentage { get; set; }
        public string? Salary { get; set; }
        public string? Location { get; set; }
        public DateTime MatchedDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? JobUrl { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}