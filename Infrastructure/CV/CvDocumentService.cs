using Application.Interfaces;
using Application.JobMatch.DTOs;
using Application.Projects.DTOs;
using Application.Skills.DTOs;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;

namespace Infrastructure.CV
{
    public class CvFileBuilder : ICvFileBuilder
    {
        private const string HeaderColor = "2F5597"; // Professional blue
        private const string AccentColor = "4472C4"; // Lighter blue for accents
        private const string TextColor = "333333";   // Dark gray for text

        public async Task<byte[]> GenerateDoc(TailoredCvDto cv, CancellationToken cancellationToken)
        {
            using var mem = new MemoryStream();
            using (var wordDoc = WordprocessingDocument.Create(mem, WordprocessingDocumentType.Document, true))
            {
                MainDocumentPart mainPart = wordDoc.AddMainDocumentPart();
                mainPart.Document = new Document();
                Body body = mainPart.Document.AppendChild(new Body());

                // Set document margins for better layout
                SetDocumentMargins(mainPart);

                // Create styles
                CreateStyles(mainPart);

                // Add header section with name and contact info
                AddHeaderSection(body, cv.Name, cv.ContactInfo);

                // Add summary section
                if (!string.IsNullOrWhiteSpace(cv.Summary))
                {
                    AddSectionWithContent(body, "Professional Summary", cv.Summary, isFirstSection: true);
                }

                // Add experience section
                if (cv.Experience.Any())
                {
                    AddExperienceSection(body, cv.Experience);
                }

                // Add projects section
                if (cv.Projects.Any())
                {
                    AddProjectsSection(body, cv.Projects);
                }

                // Add skills section
                if (cv.Skills.Any())
                {
                    AddSkillsSection(body, cv.Skills);
                }

                mainPart.Document.Save();
            }
            return await Task.FromResult(mem.ToArray());
        }

        private static void SetDocumentMargins(MainDocumentPart mainPart)
        {
            var sectionProps = new SectionProperties(
                new PageMargin()
                {
                    Top = 720,    // 0.5 inch
                    Right = 720,  // 0.5 inch
                    Bottom = 720, // 0.5 inch
                    Left = 720,   // 0.5 inch
                    Header = 720,
                    Footer = 720,
                    Gutter = 0
                }
            );
            mainPart.Document.Body.Append(sectionProps);
        }

        private static void CreateStyles(MainDocumentPart mainPart)
        {
            StyleDefinitionsPart styleDefinitionsPart = mainPart.AddNewPart<StyleDefinitionsPart>();
            Styles styles = new Styles();

            // Create heading style
            Style headingStyle = new Style()
            {
                Type = StyleValues.Paragraph,
                StyleId = "CVHeading"
            };

            StyleName headingStyleName = new StyleName() { Val = "CV Heading" };
            headingStyle.Append(headingStyleName);

            StyleParagraphProperties headingPProps = new StyleParagraphProperties();
            headingPProps.Append(new SpacingBetweenLines() { Before = "240", After = "120" });
            headingPProps.Append(new ParagraphBorders(
                new BottomBorder() { Val = BorderValues.Single, Size = 6, Color = AccentColor }
            ));
            headingStyle.Append(headingPProps);

            StyleRunProperties headingRProps = new StyleRunProperties();
            headingRProps.Append(new Bold());
            headingRProps.Append(new FontSize() { Val = "24" });
            headingRProps.Append(new Color() { Val = HeaderColor });
            headingStyle.Append(headingRProps);

            styles.Append(headingStyle);
            styleDefinitionsPart.Styles = styles;
        }

        private static void AddHeaderSection(Body body, string name, string contactInfo)
        {
            // Name - Large, bold, centered
            var nameParagraph = new Paragraph();
            nameParagraph.ParagraphProperties = new ParagraphProperties(
                new Justification() { Val = JustificationValues.Center },
                new SpacingBetweenLines() { After = "120" }
            );

            var nameRun = new Run();
            nameRun.RunProperties = new RunProperties(
                new Bold(),
                new FontSize() { Val = "32" },
                new Color() { Val = HeaderColor }
            );
            nameRun.Append(new Text(name));
            nameParagraph.Append(nameRun);
            body.Append(nameParagraph);

            // Contact info - Centered, smaller
            var contactParagraph = new Paragraph();
            contactParagraph.ParagraphProperties = new ParagraphProperties(
                new Justification() { Val = JustificationValues.Center },
                new SpacingBetweenLines() { After = "240" }
            );

            var contactRun = new Run();
            contactRun.RunProperties = new RunProperties(
                new FontSize() { Val = "20" },
                new Color() { Val = TextColor }
            );
            contactRun.Append(new Text(contactInfo));
            contactParagraph.Append(contactRun);
            body.Append(contactParagraph);

            // Add separator line
            AddSeparatorLine(body);
        }

        private static void AddSeparatorLine(Body body)
        {
            var separatorParagraph = new Paragraph();
            separatorParagraph.ParagraphProperties = new ParagraphProperties(
                new ParagraphBorders(
                    new TopBorder() { Val = BorderValues.Single, Size = 4, Color = AccentColor }
                ),
                new SpacingBetweenLines() { After = "240" }
            );
            separatorParagraph.Append(new Run(new Text("")));
            body.Append(separatorParagraph);
        }

        private static void AddSectionHeading(Body body, string heading)
        {
            var paragraph = new Paragraph();
            paragraph.ParagraphProperties = new ParagraphProperties(
                new SpacingBetweenLines() { Before = "240", After = "120" },
                new ParagraphBorders(
                    new BottomBorder() { Val = BorderValues.Single, Size = 6, Color = AccentColor }
                )
            );

            var run = new Run();
            run.RunProperties = new RunProperties(
                new Bold(),
                new FontSize() { Val = "24" },
                new Color() { Val = HeaderColor }
            );
            run.Append(new Text(heading));
            paragraph.Append(run);
            body.Append(paragraph);
        }

        private static void AddSectionWithContent(Body body, string heading, string content, bool isFirstSection = false)
        {
            if (!isFirstSection)
            {
                AddSectionHeading(body, heading);
            }
            else
            {
                // First section gets less top spacing
                var paragraph = new Paragraph();
                paragraph.ParagraphProperties = new ParagraphProperties(
                    new SpacingBetweenLines() { Before = "120", After = "120" },
                    new ParagraphBorders(
                        new BottomBorder() { Val = BorderValues.Single, Size = 6, Color = AccentColor }
                    )
                );

                var run = new Run();
                run.RunProperties = new RunProperties(
                    new Bold(),
                    new FontSize() { Val = "24" },
                    new Color() { Val = HeaderColor }
                );
                run.Append(new Text(heading));
                paragraph.Append(run);
                body.Append(paragraph);
            }

            var contentParagraph = new Paragraph();
            contentParagraph.ParagraphProperties = new ParagraphProperties(
                new SpacingBetweenLines() { After = "120" },
                new Justification() { Val = JustificationValues.Both }
            );

            var contentRun = new Run();
            contentRun.RunProperties = new RunProperties(
                new FontSize() { Val = "22" },
                new Color() { Val = TextColor }
            );
            contentRun.Append(new Text(content));
            contentParagraph.Append(contentRun);
            body.Append(contentParagraph);
        }

        private static void AddExperienceSection(Body body, List<Domain.Experience> experiences)
        {
            AddSectionHeading(body, "Professional Experience");

            foreach (var exp in experiences)
            {
                // Job title and company - Bold
                var titleParagraph = new Paragraph();
                titleParagraph.ParagraphProperties = new ParagraphProperties(
                    new SpacingBetweenLines() { After = "60" }
                );

                var titleRun = new Run();
                titleRun.RunProperties = new RunProperties(
                    new Bold(),
                    new FontSize() { Val = "24" },
                    new Color() { Val = HeaderColor }
                );
                titleRun.Append(new Text($"{exp.Title} | {exp.Company}"));
                titleParagraph.Append(titleRun);
                body.Append(titleParagraph);

                // Date and location
                var dateParagraph = new Paragraph();
                dateParagraph.ParagraphProperties = new ParagraphProperties(
                    new SpacingBetweenLines() { After = "120" }
                );

                var dateRun = new Run();
                dateRun.RunProperties = new RunProperties(
                    new Italic(),
                    new FontSize() { Val = "20" },
                    new Color() { Val = "666666" }
                );

                string dateRange = $"{exp.StartDate:MMM yyyy} – {(exp.EndDate?.ToString("MMM yyyy") ?? "Present")}";
                if (!string.IsNullOrWhiteSpace(exp.Location))
                {
                    dateRange += $" | {exp.Location}";
                }

                dateRun.Append(new Text(dateRange));
                dateParagraph.Append(dateRun);
                body.Append(dateParagraph);

                // Highlights as bullet points
                if (exp.Highlights?.Any() == true)
                {
                    foreach (var highlight in exp.Highlights)
                    {
                        AddBulletPoint(body, highlight);
                    }
                }

                // Add spacing after each experience
                AddSpacing(body, "180");
            }
        }

        private static void AddProjectsSection(Body body, List<ProjectDto> projects)
        {
            AddSectionHeading(body, "Key Projects");

            foreach (var project in projects)
            {
                // Project name - Bold
                var projectParagraph = new Paragraph();
                projectParagraph.ParagraphProperties = new ParagraphProperties(
                    new SpacingBetweenLines() { After = "60" }
                );

                var projectRun = new Run();
                projectRun.RunProperties = new RunProperties(
                    new Bold(),
                    new FontSize() { Val = "22" },
                    new Color() { Val = HeaderColor }
                );

                string projectTitle = project.Name;
                if (project.IsInProgress)
                {
                    projectTitle += " (In Progress)";
                }

                projectRun.Append(new Text(projectTitle));
                projectParagraph.Append(projectRun);
                body.Append(projectParagraph);

                // Project description
                var descParagraph = new Paragraph();
                descParagraph.ParagraphProperties = new ParagraphProperties(
                    new SpacingBetweenLines() { After = "120" },
                    new Justification() { Val = JustificationValues.Both }
                );

                var descRun = new Run();
                descRun.RunProperties = new RunProperties(
                    new FontSize() { Val = "20" },
                    new Color() { Val = TextColor }
                );
                descRun.Append(new Text(project.Description));
                descParagraph.Append(descRun);
                body.Append(descParagraph);

                // Add links if available
                if (!string.IsNullOrWhiteSpace(project.Url) || !string.IsNullOrWhiteSpace(project.GitHubRepo))
                {
                    var linksParagraph = new Paragraph();
                    linksParagraph.ParagraphProperties = new ParagraphProperties(
                        new SpacingBetweenLines() { After = "120" }
                    );

                    var linksRun = new Run();
                    linksRun.RunProperties = new RunProperties(
                        new FontSize() { Val = "18" },
                        new Color() { Val = AccentColor },
                        new Italic()
                    );

                    var links = new List<string>();
                    if (!string.IsNullOrWhiteSpace(project.Url))
                        links.Add($"Live: {project.Url}");
                    if (!string.IsNullOrWhiteSpace(project.GitHubRepo))
                        links.Add($"GitHub: {project.GitHubRepo}");

                    linksRun.Append(new Text(string.Join(" | ", links)));
                    linksParagraph.Append(linksRun);
                    body.Append(linksParagraph);
                }

                AddSpacing(body, "180");
            }
        }

        private static void AddSkillsSection(Body body, List<SkillGroupDto> skillGroups)
        {
            AddSectionHeading(body, "Technical Skills");

            foreach (var group in skillGroups)
            {
                var skillParagraph = new Paragraph();
                skillParagraph.ParagraphProperties = new ParagraphProperties(
                    new SpacingBetweenLines() { After = "120" }
                );

                // Category name - Bold
                var categoryRun = new Run();
                categoryRun.RunProperties = new RunProperties(
                    new Bold(),
                    new FontSize() { Val = "22" },
                    new Color() { Val = HeaderColor }
                );
                categoryRun.Append(new Text($"{group.Category}: "));
                skillParagraph.Append(categoryRun);

                // Skills list
                var skillsRun = new Run();
                skillsRun.RunProperties = new RunProperties(
                    new FontSize() { Val = "20" },
                    new Color() { Val = TextColor }
                );
                skillsRun.Append(new Text(string.Join(" • ", group.Skills)));
                skillParagraph.Append(skillsRun);

                body.Append(skillParagraph);
            }
        }

        private static void AddBulletPoint(Body body, string text)
        {
            var bulletParagraph = new Paragraph();
            bulletParagraph.ParagraphProperties = new ParagraphProperties(
                new SpacingBetweenLines() { After = "80" },
                new Indentation() { Left = "360" },
                new Justification() { Val = JustificationValues.Both }
            );

            var bulletRun = new Run();
            bulletRun.RunProperties = new RunProperties(
                new FontSize() { Val = "20" },
                new Color() { Val = TextColor }
            );
            bulletRun.Append(new Text($"• {text}"));
            bulletParagraph.Append(bulletRun);
            body.Append(bulletParagraph);
        }

        private static void AddSpacing(Body body, string spacing)
        {
            var spacingParagraph = new Paragraph();
            spacingParagraph.ParagraphProperties = new ParagraphProperties(
                new SpacingBetweenLines() { After = spacing }
            );
            spacingParagraph.Append(new Run(new Text("")));
            body.Append(spacingParagraph);
        }
    }
}