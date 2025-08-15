using Domain;

namespace Application.Interfaces
{
    public interface IJobMatchRepository
    {
        Task<IEnumerable<Domain.JobMatch>> GetJobMatchesAsync(Guid? userId = null, CancellationToken cancellationToken = default);
        Task<Domain.JobMatch?> GetJobMatchByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Domain.JobMatch> AddJobMatchAsync(Domain.JobMatch jobMatch, CancellationToken cancellationToken = default);
        Task<Domain.JobMatch> UpdateJobMatchAsync(Domain.JobMatch jobMatch, CancellationToken cancellationToken = default);
        Task DeleteJobMatchAsync(Guid id, CancellationToken cancellationToken = default);
        Task<IEnumerable<Domain.JobMatch>> GetJobMatchesByFilterAsync(
            string? searchTerm = null, 
            decimal? minMatchPercentage = null, 
            string? status = null, 
            string? company = null,
            DateTime? fromDate = null,
            DateTime? toDate = null,
            Guid? userId = null,
            CancellationToken cancellationToken = default);
    }
}