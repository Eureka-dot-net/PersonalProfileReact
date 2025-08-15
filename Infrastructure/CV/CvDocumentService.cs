using Application.Interfaces;
using Application.JobMatch.DTOs;
using Application.Projects.DTOs;
using Application.Skills.DTOs;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using QRCoder;
using A = DocumentFormat.OpenXml.Drawing;
using DW = DocumentFormat.OpenXml.Drawing.Wordprocessing;
using PIC = DocumentFormat.OpenXml.Drawing.Pictures;
using W = DocumentFormat.OpenXml.Wordprocessing;

namespace Infrastructure.CV
{
    public class CvFileBuilder : ICvFileBuilder
    {
        private const string HeaderColor = "2F5597"; // Professional blue
        private const string AccentColor = "4472C4"; // Lighter blue for accents
        private const string TextColor = "333333";   // Dark gray for text
        private const string LinkColor = "0563C1";   // Blue for links

        public async Task<byte[]> GenerateDoc(TailoredCvDto cv, CancellationToken cancellationToken)
        {
            using var mem = new MemoryStream();
            using (var wordDoc = WordprocessingDocument.Create(mem, WordprocessingDocumentType.Document, true))
            {
                MainDocumentPart mainPart = wordDoc.AddMainDocumentPart();
                mainPart.Document = new W.Document();
                W.Body body = mainPart.Document.AppendChild(new W.Body());

                // Set document margins for better layout
                SetDocumentMargins(mainPart);

                // Create styles
                CreateStyles(mainPart);

                // Add header section with name and contact info (including QR codes)
                AddHeaderSectionWithQR(body, mainPart, cv);

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

                // Add projects section with QR codes for URLs
                if (cv.Projects.Any())
                {
                    AddProjectsSectionWithQR(body, mainPart, cv.Projects);
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
            var sectionProps = new W.SectionProperties(
                new W.PageMargin()
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
            mainPart.Document.Body?.Append(sectionProps);
        }

        private static void CreateStyles(MainDocumentPart mainPart)
        {
            StyleDefinitionsPart styleDefinitionsPart = mainPart.AddNewPart<StyleDefinitionsPart>();
            W.Styles styles = new W.Styles();

            // Create heading style
            W.Style headingStyle = new W.Style()
            {
                Type = StyleValues.Paragraph,
                StyleId = "CVHeading"
            };

            W.StyleName headingStyleName = new W.StyleName() { Val = "CV Heading" };
            headingStyle.Append(headingStyleName);

            W.StyleParagraphProperties headingPProps = new W.StyleParagraphProperties();
            headingPProps.Append(new W.SpacingBetweenLines() { Before = "240", After = "120" });
            headingPProps.Append(new W.ParagraphBorders(
                new W.BottomBorder() { Val = BorderValues.Single, Size = 6, Color = AccentColor }
            ));
            headingStyle.Append(headingPProps);

            W.StyleRunProperties headingRProps = new W.StyleRunProperties();
            headingRProps.Append(new W.Bold());
            headingRProps.Append(new W.FontSize() { Val = "24" });
            headingRProps.Append(new W.Color() { Val = HeaderColor });
            headingStyle.Append(headingRProps);

            styles.Append(headingStyle);
            styleDefinitionsPart.Styles = styles;
        }

        private static List<ContactItem> GetContactItems(TailoredCvDto cv)
        {
            var items = new List<ContactItem>();

            // Add basic contact info (non-URL items)
            if (!string.IsNullOrWhiteSpace(cv.Email))
                items.Add(new ContactItem { Text = cv.Email, Url = $"mailto:{cv.Email}", Type = ContactType.Email });

            if (!string.IsNullOrWhiteSpace(cv.Phone))
                items.Add(new ContactItem { Text = cv.Phone, Type = ContactType.Phone });

            // Add URL items
            if (!string.IsNullOrWhiteSpace(cv.LinkedIn))
                items.Add(new ContactItem { Text = "LinkedIn", Url = cv.LinkedIn, Type = ContactType.Url });

            if (!string.IsNullOrWhiteSpace(cv.GitHub))
                items.Add(new ContactItem { Text = "GitHub", Url = cv.GitHub, Type = ContactType.Url });

            if (!string.IsNullOrWhiteSpace(cv.PersonalWebsite))
                items.Add(new ContactItem { Text = "Portfolio", Url = cv.PersonalWebsite, Type = ContactType.Url });

            return items;
        }

        private static void AddHeaderSectionWithQR(W.Body body, MainDocumentPart mainPart, TailoredCvDto cv)
        {
            // Name - Large, bold, centered
            var nameParagraph = new W.Paragraph();
            nameParagraph.ParagraphProperties = new W.ParagraphProperties(
                new W.Justification() { Val = JustificationValues.Center },
                new W.SpacingBetweenLines() { After = "180" }
            );

            var nameRun = new W.Run();
            nameRun.RunProperties = new W.RunProperties(
                new W.Bold(),
                new W.FontSize() { Val = "32" },
                new W.Color() { Val = HeaderColor }
            );
            nameRun.Append(new W.Text(cv.Name));
            nameParagraph.Append(nameRun);
            body.Append(nameParagraph);

            // Get contact items
            var contactItems = GetContactItems(cv);
            var urlItems = contactItems.Where(c => c.Type == ContactType.Url || c.Type == ContactType.Email).ToList();
            var textItems = contactItems.Where(c => c.Type == ContactType.Phone).ToList();

            // Add basic contact info (phone) - centered
            if (textItems.Any())
            {
                var textContactParagraph = new W.Paragraph();
                textContactParagraph.ParagraphProperties = new W.ParagraphProperties(
                    new W.Justification() { Val = JustificationValues.Center },
                    new W.SpacingBetweenLines() { After = "180" }
                );

                var textContactRun = new W.Run();
                textContactRun.RunProperties = new W.RunProperties(
                    new W.FontSize() { Val = "20" },
                    new W.Color() { Val = TextColor }
                );
                textContactRun.Append(new W.Text(string.Join(" | ", textItems.Select(i => i.Text))));
                textContactParagraph.Append(textContactRun);
                body.Append(textContactParagraph);
            }

            // Add URL contact info with QR codes and clickable links
            if (urlItems.Any())
            {
                AddContactWithQRCodesAndLinks(body, mainPart, urlItems);
            }

            // Add separator line
            AddSeparatorLine(body);
        }

        private static void AddContactWithQRCodesAndLinks(W.Body body, MainDocumentPart mainPart, List<ContactItem> urlItems)
        {
            // Create a table for better layout of QR codes and text
            var table = new W.Table();

            // Table properties for clean layout with more spacing
            var tableProps = new W.TableProperties(
                new W.TableWidth() { Width = "0", Type = TableWidthUnitValues.Auto },
                new W.TableJustification() { Val = TableRowAlignmentValues.Center },
                new W.TableCellMarginDefault(
                    new W.TableCellLeftMargin() { Width = 200, Type = TableWidthValues.Dxa }, // Increased spacing
                    new W.TableCellRightMargin() { Width = 200, Type = TableWidthValues.Dxa }
                )
            );
            table.AppendChild(tableProps);

            var tableRow = new W.TableRow();

            foreach (var item in urlItems)
            {
                var cell = new W.TableCell();

                // Cell properties with more padding
                var cellProps = new W.TableCellProperties(
                    new W.TableCellWidth() { Type = TableWidthUnitValues.Auto },
                    new W.TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Center },
                    new W.TableCellMargin(
                        new W.LeftMargin() { Width = "100", Type = TableWidthUnitValues.Dxa },
                        new W.RightMargin() { Width = "100", Type = TableWidthUnitValues.Dxa }
                    )
                );
                cell.Append(cellProps);

                // Add QR code
                var qrImagePart = !string.IsNullOrEmpty(item.Url) ? AddQRCodeImage(mainPart, item.Url) : null;
                if (qrImagePart != null)
                {
                    var qrParagraph = new W.Paragraph();
                    qrParagraph.ParagraphProperties = new W.ParagraphProperties(
                        new W.Justification() { Val = JustificationValues.Center },
                        new W.SpacingBetweenLines() { After = "120" } // More space between QR and text
                    );

                    var qrRun = new W.Run();
                    var drawing = CreateImageDrawing(mainPart.GetIdOfPart(qrImagePart), "QR Code", 720000, 720000); // Slightly larger QR code
                    qrRun.Append(drawing);
                    qrParagraph.Append(qrRun);
                    cell.Append(qrParagraph);
                }

                // Add clickable link below QR code
                var linkParagraph = new W.Paragraph();
                linkParagraph.ParagraphProperties = new W.ParagraphProperties(
                    new W.Justification() { Val = JustificationValues.Center },
                    new W.SpacingBetweenLines() { After = "60" }
                );

                if ((item.Type == ContactType.Email || item.Type == ContactType.Url) && !string.IsNullOrEmpty(item.Url))
                {
                    // Create hyperlink
                    var hyperlinkRel = mainPart.AddHyperlinkRelationship(new Uri(item.Url), true);
                    var hyperlink = new W.Hyperlink(new W.Run(
                        new W.RunProperties(
                            new W.RunStyle() { Val = "Hyperlink" },
                            new W.FontSize() { Val = "18" },
                            new W.Color() { Val = LinkColor },
                            new W.Underline() { Val = UnderlineValues.Single }
                        ),
                        new W.Text(item.Text)
                    ))
                    { Id = hyperlinkRel.Id };

                    linkParagraph.Append(hyperlink);
                }
                else
                {
                    // Regular text for non-URL items
                    var textRun = new W.Run();
                    textRun.RunProperties = new W.RunProperties(
                        new W.FontSize() { Val = "18" },
                        new W.Color() { Val = TextColor }
                    );
                    textRun.Append(new W.Text(item.Text));
                    linkParagraph.Append(textRun);
                }

                cell.Append(linkParagraph);

                // Add URL text below the link for reference
                if (item.Type == ContactType.Url && !string.IsNullOrEmpty(item.Url))
                {
                    var urlParagraph = new W.Paragraph();
                    urlParagraph.ParagraphProperties = new W.ParagraphProperties(
                        new W.Justification() { Val = JustificationValues.Center }
                    );

                    var urlRun = new W.Run();
                    urlRun.RunProperties = new W.RunProperties(
                        new W.FontSize() { Val = "14" },
                        new W.Color() { Val = "666666" },
                        new W.Italic()
                    );

                    // Show shortened URL
                    var displayUrl = item.Url.Replace("https://", "").Replace("http://", "").Replace("www.", "");
                    if (displayUrl.Length > 25)
                        displayUrl = displayUrl.Substring(0, 22) + "...";

                    urlRun.Append(new W.Text(displayUrl));
                    urlParagraph.Append(urlRun);
                    cell.Append(urlParagraph);
                }

                tableRow.Append(cell);
            }

            table.Append(tableRow);
            body.Append(table);

            // Add more spacing after QR section
            AddSpacing(body, "360");
        }

        private static ImagePart? AddQRCodeImage(MainDocumentPart mainPart, string url)
        {
            try
            {
                using var qrGenerator = new QRCodeGenerator();
                var qrCodeData = qrGenerator.CreateQrCode(url, QRCodeGenerator.ECCLevel.M);
                using var qrCode = new PngByteQRCode(qrCodeData);
                var qrCodeBytes = qrCode.GetGraphic(4); // 4 pixels per module for good quality

                var imagePart = mainPart.AddImagePart(ImagePartType.Png);
                using var stream = new MemoryStream(qrCodeBytes);
                imagePart.FeedData(stream);

                return imagePart;
            }
            catch
            {
                return null; // If QR generation fails, continue without QR code
            }
        }

        private static W.Drawing CreateImageDrawing(string imageId, string imageName, long width, long height)
        {
            var drawing = new W.Drawing(
                new DW.Inline(
                    new DW.Extent() { Cx = width, Cy = height },
                    new DW.EffectExtent() { LeftEdge = 0L, TopEdge = 0L, RightEdge = 0L, BottomEdge = 0L },
                    new DW.DocProperties() { Id = 1U, Name = imageName },
                    new DW.NonVisualGraphicFrameDrawingProperties(
                        new A.GraphicFrameLocks() { NoChangeAspect = true }),
                    new A.Graphic(
                        new A.GraphicData(
                            new PIC.Picture(
                                new PIC.NonVisualPictureProperties(
                                    new PIC.NonVisualDrawingProperties() { Id = 0U, Name = imageName },
                                    new PIC.NonVisualPictureDrawingProperties()),
                                new PIC.BlipFill(
                                    new A.Blip() { Embed = imageId },
                                    new A.Stretch(new A.FillRectangle())),
                                new PIC.ShapeProperties(
                                    new A.Transform2D(
                                        new A.Offset() { X = 0L, Y = 0L },
                                        new A.Extents() { Cx = width, Cy = height }),
                                    new A.PresetGeometry(
                                        new A.AdjustValueList())
                                    { Preset = A.ShapeTypeValues.Rectangle })))
                        { Uri = "http://schemas.openxmlformats.org/drawingml/2006/picture" }))
                { DistanceFromTop = 0U, DistanceFromBottom = 0U, DistanceFromLeft = 0U, DistanceFromRight = 0U }
            );

            return drawing;
        }

        private static void AddProjectsSectionWithQR(W.Body body, MainDocumentPart mainPart, List<ProjectDto> projects)
        {
            AddSectionHeading(body, "Key Projects");

            foreach (var project in projects)
            {
                // Project name - Bold
                var projectParagraph = new W.Paragraph();
                projectParagraph.ParagraphProperties = new W.ParagraphProperties(
                    new W.SpacingBetweenLines() { After = "60" }
                );

                var projectRun = new W.Run();
                projectRun.RunProperties = new W.RunProperties(
                    new W.Bold(),
                    new W.FontSize() { Val = "22" },
                    new W.Color() { Val = HeaderColor }
                );

                string projectTitle = project.Name;
                if (project.IsInProgress)
                {
                    projectTitle += " (In Progress)";
                }

                projectRun.Append(new W.Text(projectTitle));
                projectParagraph.Append(projectRun);
                body.Append(projectParagraph);

                // Project description
                var descParagraph = new W.Paragraph();
                descParagraph.ParagraphProperties = new W.ParagraphProperties(
                    new W.SpacingBetweenLines() { After = "120" },
                    new W.Justification() { Val = JustificationValues.Both }
                );

                var descRun = new W.Run();
                descRun.RunProperties = new W.RunProperties(
                    new W.FontSize() { Val = "20" },
                    new W.Color() { Val = TextColor }
                );
                descRun.Append(new W.Text(project.Description));
                descParagraph.Append(descRun);
                body.Append(descParagraph);

                // Add QR codes for project URLs
                var projectUrls = new List<ContactItem>();
                if (!string.IsNullOrWhiteSpace(project.Url))
                    projectUrls.Add(new ContactItem { Text = "Live Demo", Url = project.Url, Type = ContactType.Url });
                if (!string.IsNullOrWhiteSpace(project.GitHubRepo))
                    projectUrls.Add(new ContactItem { Text = "GitHub", Url = project.GitHubRepo, Type = ContactType.Url });

                if (projectUrls.Any())
                {
                    AddContactWithQRCodesAndLinks(body, mainPart, projectUrls);
                }

                AddSpacing(body, "180");
            }
        }

        // ... (Rest of the helper methods remain the same)
        private static void AddSeparatorLine(W.Body body)
        {
            var separatorParagraph = new W.Paragraph();
            separatorParagraph.ParagraphProperties = new W.ParagraphProperties(
                new W.ParagraphBorders(
                    new W.TopBorder() { Val = BorderValues.Single, Size = 4, Color = AccentColor }
                ),
                new W.SpacingBetweenLines() { After = "240" }
            );
            separatorParagraph.Append(new W.Run(new W.Text("")));
            body.Append(separatorParagraph);
        }

        private static void AddSectionHeading(W.Body body, string heading)
        {
            var paragraph = new W.Paragraph();
            paragraph.ParagraphProperties = new W.ParagraphProperties(
                new W.SpacingBetweenLines() { Before = "240", After = "120" },
                new W.ParagraphBorders(
                    new W.BottomBorder() { Val = BorderValues.Single, Size = 6, Color = AccentColor }
                )
            );

            var run = new W.Run();
            run.RunProperties = new W.RunProperties(
                new W.Bold(),
                new W.FontSize() { Val = "24" },
                new W.Color() { Val = HeaderColor }
            );
            run.Append(new W.Text(heading));
            paragraph.Append(run);
            body.Append(paragraph);
        }

        private static void AddSectionWithContent(W.Body body, string heading, string content, bool isFirstSection = false)
        {
            if (!isFirstSection)
            {
                AddSectionHeading(body, heading);
            }
            else
            {
                var paragraph = new W.Paragraph();
                paragraph.ParagraphProperties = new W.ParagraphProperties(
                    new W.SpacingBetweenLines() { Before = "120", After = "120" },
                    new W.ParagraphBorders(
                        new W.BottomBorder() { Val = BorderValues.Single, Size = 6, Color = AccentColor }
                    )
                );

                var run = new W.Run();
                run.RunProperties = new W.RunProperties(
                    new W.Bold(),
                    new W.FontSize() { Val = "24" },
                    new W.Color() { Val = HeaderColor }
                );
                run.Append(new W.Text(heading));
                paragraph.Append(run);
                body.Append(paragraph);
            }

            var contentParagraph = new W.Paragraph();
            contentParagraph.ParagraphProperties = new W.ParagraphProperties(
                new W.SpacingBetweenLines() { After = "120" },
                new W.Justification() { Val = JustificationValues.Both }
            );

            var contentRun = new W.Run();
            contentRun.RunProperties = new W.RunProperties(
                new W.FontSize() { Val = "22" },
                new W.Color() { Val = TextColor }
            );
            contentRun.Append(new W.Text(content));
            contentParagraph.Append(contentRun);
            body.Append(contentParagraph);
        }

        private static void AddExperienceSection(W.Body body, List<Domain.Experience> experiences)
        {
            AddSectionHeading(body, "Professional Experience");

            foreach (var exp in experiences)
            {
                var titleParagraph = new W.Paragraph();
                titleParagraph.ParagraphProperties = new W.ParagraphProperties(
                    new W.SpacingBetweenLines() { After = "60" }
                );

                var titleRun = new W.Run();
                titleRun.RunProperties = new W.RunProperties(
                    new W.Bold(),
                    new W.FontSize() { Val = "24" },
                    new W.Color() { Val = HeaderColor }
                );
                titleRun.Append(new W.Text($"{exp.Title} | {exp.Company}"));
                titleParagraph.Append(titleRun);
                body.Append(titleParagraph);

                var dateParagraph = new W.Paragraph();
                dateParagraph.ParagraphProperties = new W.ParagraphProperties(
                    new W.SpacingBetweenLines() { After = "120" }
                );

                var dateRun = new W.Run();
                dateRun.RunProperties = new W.RunProperties(
                    new W.Italic(),
                    new W.FontSize() { Val = "20" },
                    new W.Color() { Val = "666666" }
                );

                string dateRange = $"{exp.StartDate:MMM yyyy} – {(exp.EndDate?.ToString("MMM yyyy") ?? "Present")}";
                if (!string.IsNullOrWhiteSpace(exp.Location))
                {
                    dateRange += $" | {exp.Location}";
                }

                dateRun.Append(new W.Text(dateRange));
                dateParagraph.Append(dateRun);
                body.Append(dateParagraph);

                if (exp.Highlights?.Any() == true)
                {
                    foreach (var highlight in exp.Highlights)
                    {
                        AddBulletPoint(body, highlight);
                    }
                }

                AddSpacing(body, "180");
            }
        }

        private static void AddSkillsSection(W.Body body, List<SkillGroupDto> skillGroups)
        {
            AddSectionHeading(body, "Technical Skills");

            foreach (var group in skillGroups)
            {
                var skillParagraph = new W.Paragraph();
                skillParagraph.ParagraphProperties = new W.ParagraphProperties(
                    new W.SpacingBetweenLines() { After = "120" }
                );

                var categoryRun = new W.Run();
                categoryRun.RunProperties = new W.RunProperties(
                    new W.Bold(),
                    new W.FontSize() { Val = "22" },
                    new W.Color() { Val = HeaderColor }
                );
                categoryRun.Append(new W.Text($"{group.Category}: "));
                skillParagraph.Append(categoryRun);

                var skillsRun = new W.Run();
                skillsRun.RunProperties = new W.RunProperties(
                    new W.FontSize() { Val = "20" },
                    new W.Color() { Val = TextColor }
                );
                skillsRun.Append(new W.Text(string.Join(" • ", group.Skills)));
                skillParagraph.Append(skillsRun);

                body.Append(skillParagraph);
            }
        }

        private static void AddBulletPoint(W.Body body, string text)
        {
            var bulletParagraph = new W.Paragraph();
            bulletParagraph.ParagraphProperties = new W.ParagraphProperties(
                new W.SpacingBetweenLines() { After = "80" },
                new W.Indentation() { Left = "360" },
                new W.Justification() { Val = JustificationValues.Both }
            );

            var bulletRun = new W.Run();
            bulletRun.RunProperties = new W.RunProperties(
                new W.FontSize() { Val = "20" },
                new W.Color() { Val = TextColor }
            );
            bulletRun.Append(new W.Text($"• {text}"));
            bulletParagraph.Append(bulletRun);
            body.Append(bulletParagraph);
        }

        private static void AddSpacing(W.Body body, string spacing)
        {
            var spacingParagraph = new W.Paragraph();
            spacingParagraph.ParagraphProperties = new W.ParagraphProperties(
                new W.SpacingBetweenLines() { After = spacing }
            );
            spacingParagraph.Append(new W.Run(new W.Text("")));
            body.Append(spacingParagraph);
        }
    }

    // Helper classes for contact parsing
    public class ContactItem
    {
        public string Text { get; set; } = string.Empty;
        public string? Url { get; set; }
        public ContactType Type { get; set; }
    }

    public enum ContactType
    {
        Text,
        Email,
        Phone,
        Url
    }
}