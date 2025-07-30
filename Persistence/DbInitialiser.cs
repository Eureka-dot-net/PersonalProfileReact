using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.WebRequestMethods;

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
            }

            if (!context.Experiences.Any())
            {
                var experiences = new List<Experience>
                {
                    new Experience
                    {
                        Title = "DevOps Consultant",
                        Company = "ALM Online",
                        Location = "UK / Remote",
                        StartDate = new DateTime(2018, 1, 1),
                        EndDate = new DateTime(2025, 1, 1),
                        Highlights = new List<string>
                        {
                            "Designed and refined CI/CD pipelines in Azure DevOps, improving deployment efficiency by 25%.",
                            "Built a Test Factory web/client tool for website testing using C#.NET, Selenium, Azure IaaS, PowerShell, and DSC.",
                            "Reduced monthly Azure spend by £20k through smarter resource usage and migrating from Azure Search to SOLR.",
                            "Improved developer productivity by streamlining build pipelines and addressing local environment issues.",
                            "Implemented blue/green deployments to reduce downtime and smooth out release cycles."
                        }
                    },
                    new Experience
                    {
                        Title = "ALM Solutions Manager",
                        Company = "AXA Personal Lines",
                        Location = "Surrey, UK",
                        StartDate = new DateTime(2016, 1, 1),
                        EndDate = new DateTime(2018, 1, 1),
                        Highlights = new List<string>
                        {
                            "Led the shift from TFS to Azure DevOps, managing Git strategies, permission models, and build pipelines.",
                            "Launched AXA’s first Azure-hosted Guidewire project, enabling direct code deployments via PowerShell and DSC.",
                            "Hired and mentored graduate DevOps engineers, building a capable and productive team from the ground up."
                        }
                    },
                    new Experience
                    {
                        Title = "ALM Engineer / Configuration Manager",
                        Company = "AXA Personal Lines",
                        Location = "Surrey, UK",
                        StartDate = new DateTime(2014, 1, 1),
                        EndDate = new DateTime(2016, 1, 1),
                        Highlights = new List<string>
                        {
                            "Oversaw build, source control, and automated deployments for the AXA website ecosystem.",
                            "Rolled out full CI including gated check-ins and automatic unit test validation.",
                            "Built SSRS dashboards to track build quality and support continuous improvement."
                        }
                    },
                    new Experience
                    {
                        Title = "Developer",
                        Company = "AXA Personal Lines",
                        Location = "Surrey, UK",
                        StartDate = new DateTime(2009, 1, 1),
                        EndDate = new DateTime(2014, 1, 1),
                        Highlights = new List<string>
                        {
                            "Developed features for the AXA and Swiftcover websites using C#.NET, JavaScript, HTML, and SQL.",
                            "Led initiatives like the .NET 3.5 upgrade and fraud detection improvements to enhance site security and speed."
                        }
                    },
                    new Experience
                    {
                        Title = "Developer",
                        Company = "IT Energy Systems & Consulting",
                        Location = "London, UK",
                        StartDate = new DateTime(2006, 2, 1),
                        EndDate = new DateTime(2008, 3, 1),
                        Highlights = new List<string>
                        {
                            "Collaborated on design, development and support of custom websites and client‑facing applications.",
                            "Built SOL, a web portal delivering real‑time port situation data to streamline operations for oil companies.",
                            "Created a ClickOnce utility to automate Outlook 2003/2005 profile setup, improving rollout speed.",
                            "Developed a partner portal that interfaces with an API service for self‑service mail account management.",
                            "Authored and maintained an API hosting service for Managed Exchange, handling mailboxes, users, groups and domains."
                        }
                    }

                };

                context.Experiences.AddRange(experiences);
            }

            if (!context.SkillCategories.Any())
            {
                var skillCategories = new List<SkillCategory>
                {
                    new SkillCategory
                    {
                        Title = "Programming Languages",
                        Skills = new List<Skill>
                        {
                            new Skill { Name = "C#.NET" },
                            new Skill { Name = "SQL" },
                            new Skill { Name = "JavaScript" },
                            new Skill { Name = "HTML" },
                            new Skill { Name = "CSS" },
                            new Skill { Name = "Typescript" },
                            new Skill { Name = "React" },
                        }
                    },
                    new SkillCategory
                    {
                        Title = "DevOps Tools",
                        Skills = new List<Skill>
                        {
                            new Skill { Name = "Azure DevOps" },
                            new Skill { Name = "GitHub" },
                            new Skill { Name = "Bitbucket" },
                            new Skill { Name = "Jenkins" },
                            new Skill { Name = "VSTS/TFS" }
                        }
                    },
                    new SkillCategory
                    {
                        Title = "Cloud & Automation",
                        Skills = new List<Skill>
                        {
                            new Skill { Name = "Azure (IaaS & PaaS)" },
                            new Skill { Name = "PowerShell" },
                            new Skill { Name = "ARM" },
                            new Skill { Name = "DSC" }
                        }
                    },
                    new SkillCategory
                    {
                        Title = "Software Development",
                        Skills = new List<Skill>
                        {
                            new Skill { Name = "MSBuild" },
                            new Skill { Name = "Behavior-Driven Development (Pester)" }
                        }
                    },
                    new SkillCategory
                    {
                        Title = "Others",
                        Skills = new List<Skill>
                        {
                            new Skill { Name = "Microsoft Server Management (2003, 2008, 2012)" },
                            new Skill { Name = "Chocolatey" },
                            new Skill { Name = "SSRS" }
                        }
                    },
                    new SkillCategory
                    {
                        Title = "Core Competencies",
                        Skills = new List<Skill>
                        {
                            new Skill { Name = "Agile Methodologies" },
                            new Skill { Name = "Team Collaboration & Communication" },
                            new Skill { Name = "Exceptional Problem-Solving Skills" },
                            new Skill { Name = "Time Management & Organization" }
                        }
                    }
                };

                            context.SkillCategories.AddRange(skillCategories);
                        }

            if (!context.Projects.Any())
            {
                var projects = new List<Project>
                {
                    new Project
                    {
                        Name = "Personal Profile Website",
                        Description = "A React + .NET app built to showcase my skill using react, C#.net and clean architecture.",
                        GitHubRepo = "https://github.com/Eureka-dot-net/Reactivities",
                        Url = "https://narike-personalprofile.azurewebsites.net/",
                        IsInProgress = false
                    },
                    new Project
                    {
                        Name = "React Project (Course)",
                        Description = "A React + .NET app built while following along with a full-stack Udemy course.",
                        GitHubRepo = "https://github.com/Eureka-dot-net/Reactivities",
                        Url = "https://reactivities-narike.azurewebsites.net/",
                        IsInProgress = false
                    },
                    new Project
                    {
                        Name = "NPC Info (Stardew Valley Mod)",
                        Description = "Mod that displays helpful icons for NPCs—like birthdays, gifts, and more.",
                        GitHubRepo = "https://github.com/Eureka-dot-net/NPCInfo",
                        Url = "https://www.nexusmods.com/stardewvalley/mods/28947",
                        IsInProgress = false,
                        Images = new List<ProjectImage>
                        {
                            new ProjectImage
                            {
                                Url = "https://res.cloudinary.com/dqzgitlgn/image/upload/v1753774886/StardewValley1_ebih1x.png"
                            },
                            new ProjectImage
                            {
                                Url = "https://res.cloudinary.com/dqzgitlgn/image/upload/v1753774903/StardewValley2_cpbxvl.png"
                            },
                            new ProjectImage
                            {
                                Url = "https://res.cloudinary.com/dqzgitlgn/image/upload/v1753774914/StardewValley3_wuytgp.png"
                            }
                        }
                    },
                    new Project
                    {
                        Name = "Game Automation Scripts",
                        Description = "Scripts and tools that automate repetitive gameplay tasks across different games.",
                        IsInProgress = false
                    },
                    new Project
                    {
                        Name = "Language Learning App",
                        Description = "Mobile app with gamified language learning, coin rewards, and house-building mechanics.",
                        GitHubRepo = "https://github.com/Eureka-dot-net/LanguageLearning",
                        IsInProgress = true
                    }
                };

                context.Projects.AddRange(projects);
            }

            if (!context.PromptTemplates.Any())
            {
                var promptTemplate = new PromptTemplate
                {
                    Name = "Job Match Evaluation",
                    Description = "Evaluates how well a candidate matches a software developer job description.",
                    Template = """
                    You are an AI assistant that evaluates how well a candidate matches a software developer job description.

                    Please analyze the candidate's experience and skills listed below, and determine how closely they align with the requirements of the job.

                    When exact matches are not found, favorably highlight similar or transferable skills and experience. Focus on how the candidate could still be a strong fit for the role, even if there are gaps.

                    The candidate has the following experience:
                    {{experienceSummary}}

                    Additionally, the candidate is actively working on several personal projects and taking courses to fill any skill gaps.

                    And the following skills:
                    {{skillsSummary}}

                    The job description is:
                    ---
                    {{jobDescription}}
                    ---

                    Please respond **briefly** and **clearly** in the following JSON format with no extra text:
                    {
                      "matchPercentage": number,
                      "explanation": "text"
                    }

                    - Keep your explanation under 250 words.
                    - Use \n for line breaks between paragraphs or key points.
                    - Avoid using markdown formatting, bullet points, or code blocks.
                    - Structure your explanation with clear paragraphs separated by \n\n.
                    - Highlight key points concisely in separate sentences.
                    """,
                    CreatedAt = DateTime.UtcNow
                };

                context.PromptTemplates.Add(promptTemplate);
            }


            context.SaveChanges();
        }
    }
}
