using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence
{
    public class DbInitialiser
    {
        public static async Task SeedData(AppDbContext context)
        {
            if (!context.AboutMe.Any())
            {
                var about = new AboutMe
                {
                    FullName = new LocalizedString
                    {
                        En = "Narike Avenant",
                        He = ""
                    },
                    Bio = new LocalizedString
                    {
                        En = """
                        I am a skilled IT professional with over 17 years of experience in software development and DevOps engineering. My background is rooted in .NET application development, and I have a solid understanding of the full software development lifecycle — from design through to deployment. In recent years, my work has focused on building CI/CD pipelines in Azure DevOps and managing cloud infrastructure, helping teams streamline their workflows and improve reliability.

                        After taking some time away from hands-on development, I’ve spent the past few months getting back up to speed with the latest technologies, frameworks, and best practices. I’ve done this by working through a modern full-stack .NET and React course and applying what I’ve learned to build a personal profile website from scratch. I’m now looking for a developer position where I can bring together my past experience, updated skills, and love of building clean, effective software.
                        """,
                        He = ""
                    },
                    Location = new LocalizedString
                    {
                        En = "Netanya, Israel",
                        He = ""
                    },
                    Email = "your@email.com",
                    GitHub = "https://github.com/yourusername",
                    LinkedIn = "https://www.linkedin.com/in/yourprofile",
                    ProfilePictureUrl = "/images/profile.jpg"
                };

                context.AboutMe.Add(about);
                context.SaveChanges();
            }
        }
    }
}
