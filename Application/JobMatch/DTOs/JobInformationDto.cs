namespace Application.JobMatch.DTOs
{
    public class JobInformationDto
    {
        public string JobTitle { get; set; } = string.Empty;
        public string Company { get; set; } = string.Empty;
        public string? Salary { get; set; }
        public string? Location { get; set; }
        public string? Requirements { get; set; }
    }
}