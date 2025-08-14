using System;

namespace Application.JobMatch.DTOs
{
    public class JobMatchFilterDto
    {
        public string? SearchTerm { get; set; }
        public decimal? MinMatchPercentage { get; set; }
        public string? Status { get; set; }
        public string? Company { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}