using Application.JobMatch.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface ICvFileBuilder
    {
        Task<byte[]> GenerateDoc(TailoredCvDto tailoredCv, CancellationToken cancellationToken);
    }
}
