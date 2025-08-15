using System;
using System.ComponentModel.DataAnnotations;

namespace Domain
{
    public class JobMatch
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public string Company { get; set; } = string.Empty;
        public decimal MatchPercentage { get; set; }
        public string? JobDescription { get; set; }
        public string? Requirements { get; set; }
        public string? Salary { get; set; }
        public string? Location { get; set; }
        public DateTime MatchedDate { get; set; }
        public string Status { get; set; } = "New";
        public string? ExternalJobId { get; set; }
        public string? JobUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}