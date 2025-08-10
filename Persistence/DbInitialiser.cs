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
                        StartDate = new DateTime(2018, 2, 1),
                        EndDate = null,
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
                        StartDate = new DateTime(2016, 9, 1),
                        EndDate = new DateTime(2018, 2, 1),
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
                        StartDate = new DateTime(2014, 11, 1),
                        EndDate = new DateTime(2016, 9, 1),
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
                        StartDate = new DateTime(2009, 7, 1),
                        EndDate = new DateTime(2014, 11, 1),
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
                        EndDate = new DateTime(2008, 7, 1),
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
                            new Skill { Name = "Typescript" },
                            new Skill { Name = "Node.js / Express.js" },
                            new Skill { Name = "HTML" },
                            new Skill { Name = "CSS" },
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
                            new Skill { Name = "Behavior-Driven Development (Pester)" },
                             new Skill { Name = "REST API" }
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
                        Description = $"A React, .NET & Node.js app built to showcase my skill using react, C#.net and clean architecture. " +
                            $"It includes JobMatch functionality that gives a match to a specified job spec using Gemini API. It also generates a CV specific for the job spec",
                        GitHubRepo = "https://github.com/Eureka-dot-net/PersonalProfileReact",
                        Url = "https://narike-personalprofile.azurewebsites.net/",
                        IsInProgress = true
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
                        Description = "Mod that displays helpful icons for NPCs—like birthdays, gifts, and more. Written in C#.net",
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
                        Name = "Game Automation Scripts written in C#.net using multithreading to run multiple instances at once",
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
                    Description = "Evaluates candidate match and generates a tailored CV for a software developer role.",
                    Template = """
                        You are an expert AI assistant specializing in software developer recruitment. Your task is to analyze a candidate's profile against a job description and generate two outputs:

                        1. A match evaluation, including a percentage and explanation.
                            - Keep your explanation under 250 words.
                            - Use \n for line breaks between paragraphs or key points.
                            - Avoid markdown formatting, bullet points, or code blocks.
                            - Structure your explanation with clear paragraphs separated by \n\n.
                            - Highlight key points concisely in separate sentences.
                            - Focus on direct skill and experience matches.
                        - Clearly differentiate between explicitly listed skills/experience and transferable or similar experience.
                        - When a skill or technology requested in the job description is *not* explicitly mentioned in the candidate’s profile, state that it is not explicitly listed, *then* mention any directly relevant *transferable* or *similar* experience the candidate *does* possess. Clearly label such experience as "transferable" or "similar." For example: "While `AngularJS` is not explicitly listed, the candidate's experience with `React` and `Node.js` demonstrates transferable front-end development skills."
                        - Do not infer or fabricate skills, tools, or technologies that are not explicitly mentioned in the candidate’s profile. Do not assume experience based on similar technologies.

                        2. A complete, tailored CV in structured JSON format. The CV must be written specifically for the job description provided, prioritizing the most relevant and aligned parts of the candidate’s background. Do not include unrelated or generic content. Tailor the structure, highlights, and wording to the job.

                        Candidate Profile:

                        Experience:
                        {{experienceSummary}}

                        Skills:
                        {{skillsSummary}}

                        Additionally, the candidate is actively working on several personal projects and taking courses to fill any skill gaps.

                        Projects:
                        {{projectSummary}}

                        Important Note for CV Generation:
                        The candidate's personal contact information should be represented by the following placeholders for privacy. Use these exact strings in the generated CV:
                        - Candidate Name: CANDIDATE_NAME
                        - Candidate Email: CANDIDATE_EMAIL
                        - Candidate Phone: CANDIDATE_PHONE
                        - Candidate LinkedIn URL: CANDIDATE_LINKEDIN_URL
                        - Candidate Portfolio URL: CANDIDATE_PORTFOLIO_URL

                        Job Description:
                        ---
                        {{jobDescription}}
                        ---

                        Structure to return (JSON):
                        {
                          "matchEvaluation": {
                            "matchPercentage": 0–100,
                            "explanation": "A brief summary of how well the candidate fits the role."
                          },
                          "tailoredCv": {
                            "name": "CANDIDATE_NAME",
                            "email": "CANDIDATE_EMAIL",
                            "phone": "CANDIDATE_PHONE",
                            "personalWebsite": "CANDIDATE_PORTFOLIO_URL",
                            "github": "CANDIDATE_GITHUB_URL",
                            "summary": "Tailored personal summary based on job description. Keep under 250 words. Keep professional, compelling, and written in natural, recruiter-friendly language. It should clearly highlight the candidate's most relevant technical strengths, career achievements, and unique value for the target role. Make the opening sentence attention-grabbing, showing the candidate’s seniority or domain expertise. Integrate transferable skills naturally if they strengthen the match (clearly labeled as transferable). Avoid generic clichés—focus on specific results, tech stacks, and measurable impact where possible. Ensure the tone feels confident, warm, and human-written, not AI-generated.",
                            "experience": [
                              {
                                "title": "Job Title",
                                "company": "Company Name",
                                "location": "City / Remote",
                                "startDate": "yyyy-mm-dd", (ALWAYS use two digits for month and day, e.g., 2023-01-05 and ALWAYS return a valid date)
                                "endDate": "yyyy-mm-dd or today's date if current", (ALWAYS use two digits for month and day, e.g., 2023-01-05 and ALWAYS return a valid date)
                                "highlights": [
                                  "Achievement 1",
                                  "Achievement 2"
                                ]
                              }
                            ],
                            "projects": [
                              {
                                "name": "Project Name",
                                "description": "Brief project description.",
                                "url": "https://project-url.com",
                                "gitHubRepo": "https://github.com/user/project",
                                "isInProgress": true,
                                "images": []
                              }
                            ],
                            "skills": [
                              {
                                "category": "Programming Languages",
                                "skills": ["C#", "Python", "JavaScript"]
                              },
                              {
                                "category": "Frameworks and Libraries",
                                "skills": [".NET", "React", "Entity Framework"]
                              },
                              {
                                "category": "Soft Skills",
                                "skills": ["Communication", "Problem Solving"]
                              },
                              {
                                "category": "(any other categories explicitly present in the candidate's profile but not yet listed here)",
                                "skills": "(Include only skills explicitly listed in the profile. When including transferable skills, clearly label them as '(transferable)'. Reorder skills so the most relevant to the job appear first in each category.)"
                              }
                            ]
                          }
                        }

                        Only include skills or experience the candidate has explicitly listed. If a skill or technology is not in the candidate profile, do not include it in the tailored CV. You may refer to transferable or related experience, but clearly indicate it is not a direct match. The tailored CV must feel human-written, grounded in the candidate’s background, and directly relevant to the job description.
                        """,
                    CreatedAt = DateTime.UtcNow
                };

                context.PromptTemplates.Add(promptTemplate);
            }
            context.SaveChanges();
        }
    }
}
