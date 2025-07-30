using Application.Interfaces;
using Application.JobMatch.DTOs;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;

namespace Infrastructure.CV
{
    public class CvFileBuilder : ICvFileBuilder
    {
        public async Task<byte[]> GenerateDoc(TailoredCvDto cv, CancellationToken cancellationToken)
        {
            using var mem = new MemoryStream();
            using (var wordDoc = WordprocessingDocument.Create(mem, WordprocessingDocumentType.Document, true))
            {
                MainDocumentPart mainPart = wordDoc.AddMainDocumentPart();
                mainPart.Document = new Document();
                Body body = mainPart.Document.AppendChild(new Body());

                // Add sections
                AddHeading(body, cv.Name);
                AddParagraph(body, cv.ContactInfo);
                AddHeading(body, "Summary");
                AddParagraph(body, cv.Summary);

                if (cv.Experience.Any())
                {
                    AddHeading(body, "Experience");
                    foreach (var exp in cv.Experience)
                    {
                        AddParagraph(body, $"{exp.Title} at {exp.Company} ({exp.StartDate.ToString("yyyy")} – {exp.EndDate?.ToString("yyyy") ?? "Present"})");
                        //AddParagraph(body, exp.Highlights);
                    }
                }

                if (cv.Projects.Any())
                {
                    AddHeading(body, "Projects");
                    foreach (var project in cv.Projects)
                    {
                        AddParagraph(body, $"{project.Name}: {project.Description}");
                    }
                }

                if (cv.Skills.Any())
                {
                    AddHeading(body, "Skills");
                    foreach (var group in cv.Skills)
                    {
                        AddParagraph(body, $"{group.Category}: {string.Join(", ", group.Skills)}");
                    }
                }

                mainPart.Document.Save();
            }

            return await Task.FromResult(mem.ToArray());
        }

        private static void AddHeading(Body body, string text)
        {
            var paragraph = new Paragraph(
                new Run(
                    new Text(text)
                )
            );

            // Apply heading style
            paragraph.ParagraphProperties = new ParagraphProperties(
                new ParagraphStyleId() { Val = "Heading1" });

            body.Append(paragraph);
        }

        private static void AddParagraph(Body body, string text)
        {
            body.Append(new Paragraph(new Run(new Text(text))));
        }
    }
}
