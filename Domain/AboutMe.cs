using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class AboutMe
    {
        public int Id { get; set; } // Always 1
        public LocalizedString FullName { get; set; } = new();
        public LocalizedString Bio { get; set; } = new();
        public LocalizedString Location { get; set; } = new();

        public string Email { get; set; } = string.Empty;
        public string GitHub { get; set; } = string.Empty;
        public string LinkedIn { get; set; } = string.Empty;
        public string ProfilePictureUrl { get; set; } = string.Empty;
    }
}
