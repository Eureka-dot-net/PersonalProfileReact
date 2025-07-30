using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class PromptTemplate
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = null!; // e.g. "Job Match Evaluation"

        [Required]
        public string Description { get; set; } = null!; // e.g. "Evaluates how well a candidate matches a job"

        [Required]
        public string Template { get; set; } = null!; // Your prompt with placeholders

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

}
