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

namespace Infrastructure.CV
{
    public class ClaudeDocumentService : ICvFileBuilder
    {
        public async Task<byte[]> GenerateDoc(TailoredCvDto cv, CancellationToken cancellationToken)
        {
            using var mem = new MemoryStream();
            using (var wordDoc = WordprocessingDocument.Create(mem, WordprocessingDocumentType.Document, true))
            {
                MainDocumentPart mainPart = wordDoc.AddMainDocumentPart();
                mainPart.Document = new Document();
                Body body = mainPart.Document.AppendChild(new Body());

                // Set document margins and styling
                SetupDocumentStyles(mainPart);

                // Header section with name and contact info
                AddHeader(body, cv, mainPart);

                // Summary section
                if (!string.IsNullOrWhiteSpace(cv.Summary))
                {
                    AddSectionHeading(body, "PROFESSIONAL SUMMARY");
                    AddStyledParagraph(body, cv.Summary, justification: JustificationValues.Both);
                    AddSpacing(body);
                }

                // Experience section
                if (cv.Experience.Any())
                {
                    AddSectionHeading(body, "PROFESSIONAL EXPERIENCE");
                    foreach (var exp in cv.Experience)
                    {
                        AddExperienceEntry(body, exp);
                    }
                    AddSpacing(body);
                }

                // Projects section
                if (cv.Projects.Any())
                {
                    AddSectionHeading(body, "PROJECTS");
                    foreach (var project in cv.Projects)
                    {
                        AddProjectEntry(body, project);
                    }
                    AddSpacing(body);
                }

                // Skills section
                if (cv.Skills.Any())
                {
                    AddSectionHeading(body, "TECHNICAL SKILLS");
                    AddSkillsSection(body, cv.Skills);
                }

                mainPart.Document.Save();
            }
            return await Task.FromResult(mem.ToArray());
        }

        private void SetupDocumentStyles(MainDocumentPart mainPart)
        {
            // Set up document margins
            var sectionProps = new SectionProperties();
            var pageMargin = new PageMargin()
            {
                Top = 720,    // 0.5 inch
                Right = 720,  // 0.5 inch
                Bottom = 720, // 0.5 inch
                Left = 720,   // 0.5 inch
                Header = 720,
                Footer = 720,
                Gutter = 0
            };
            sectionProps.Append(pageMargin);
            mainPart.Document.Body?.Append(sectionProps);
        }

        private void AddHeader(Body body, TailoredCvDto cv, MainDocumentPart mainPart)
        {
            // Name - Large, bold, centered
            var namePara = new Paragraph();
            var nameRun = new Run();
            var nameRunProps = new RunProperties();
            nameRunProps.Append(new Bold());
            nameRunProps.Append(new FontSize() { Val = "32" }); // 16pt font
            nameRunProps.Append(new RunFonts() { Ascii = "Calibri" });
            nameRun.Append(nameRunProps);
            nameRun.Append(new Text(cv.Name.ToUpper()));

            var nameParaProps = new ParagraphProperties();
            nameParaProps.Append(new Justification() { Val = JustificationValues.Center });
            nameParaProps.Append(new SpacingBetweenLines() { After = "120" });

            namePara.Append(nameParaProps);
            namePara.Append(nameRun);
            body.Append(namePara);

            // Contact info and QR code in a table
            var table = new Table();
            var tableProps = new TableProperties();
            tableProps.Append(new TableWidth() { Width = "5000", Type = TableWidthUnitValues.Pct });
            tableProps.Append(new TableLayout() { Type = TableLayoutValues.Fixed });
            tableProps.Append(new TableBorders(
                new DocumentFormat.OpenXml.Wordprocessing.TopBorder() { Val = new EnumValue<BorderValues>(BorderValues.None) },
                new DocumentFormat.OpenXml.Wordprocessing.BottomBorder() { Val = new EnumValue<BorderValues>(BorderValues.None) },
                new DocumentFormat.OpenXml.Wordprocessing.LeftBorder() { Val = new EnumValue<BorderValues>(BorderValues.None) },
                new DocumentFormat.OpenXml.Wordprocessing.RightBorder() { Val = new EnumValue<BorderValues>(BorderValues.None) },
                new DocumentFormat.OpenXml.Wordprocessing.InsideHorizontalBorder() { Val = new EnumValue<BorderValues>(BorderValues.None) },
                new DocumentFormat.OpenXml.Wordprocessing.InsideVerticalBorder() { Val = new EnumValue<BorderValues>(BorderValues.None) }
            ));

            // Add table grid to define column widths
            var tableGrid = new TableGrid();
            tableGrid.Append(new GridColumn() { Width = "7200" }); // 5 inches for contact info
            tableGrid.Append(new GridColumn() { Width = "1440" }); // 1 inch for QR code
            table.Append(tableGrid);
            table.Append(tableProps);

            var row = new TableRow();

            // Left cell - Contact info
            var leftCell = new TableCell();
            var leftCellProps = new TableCellProperties();
            leftCellProps.Append(new TableCellWidth() { Width = "7200", Type = TableWidthUnitValues.Dxa });
            leftCellProps.Append(new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Top });
            leftCellProps.Append(new TableCellMargin()
            {
                TopMargin = new TopMargin() { Width = "0", Type = TableWidthUnitValues.Dxa },
                BottomMargin = new BottomMargin() { Width = "0", Type = TableWidthUnitValues.Dxa },
                LeftMargin = new LeftMargin() { Width = "0", Type = TableWidthUnitValues.Dxa },
                RightMargin = new RightMargin() { Width = "120", Type = TableWidthUnitValues.Dxa }
            });
            leftCell.Append(leftCellProps);

            // Add contact details
            AddContactInfo(leftCell, cv);

            // Right cell - QR code (if personal website exists)
            var rightCell = new TableCell();
            var rightCellProps = new TableCellProperties();
            rightCellProps.Append(new TableCellWidth() { Width = "1440", Type = TableWidthUnitValues.Dxa });
            rightCellProps.Append(new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Top });
            rightCellProps.Append(new TableCellMargin()
            {
                TopMargin = new TopMargin() { Width = "0", Type = TableWidthUnitValues.Dxa },
                BottomMargin = new BottomMargin() { Width = "0", Type = TableWidthUnitValues.Dxa },
                LeftMargin = new LeftMargin() { Width = "0", Type = TableWidthUnitValues.Dxa },
                RightMargin = new RightMargin() { Width = "0", Type = TableWidthUnitValues.Dxa }
            });
            rightCell.Append(rightCellProps);

            if (!string.IsNullOrWhiteSpace(cv.PersonalWebsite))
            {
                AddQRCode(rightCell, cv.PersonalWebsite, mainPart);
            }

            row.Append(leftCell);
            row.Append(rightCell);
            table.Append(row);
            body.Append(table);

            AddSpacing(body, "240"); // Extra space after header
        }

        private void AddContactInfo(TableCell cell, TailoredCvDto cv)
        {
            var contactItems = new List<(string label, string value, bool isLink)>();

            if (!string.IsNullOrWhiteSpace(cv.Email))
                contactItems.Add(("Email:", cv.Email, true));
            if (!string.IsNullOrWhiteSpace(cv.Phone))
                contactItems.Add(("Phone:", cv.Phone, false));
            if (!string.IsNullOrWhiteSpace(cv.LinkedIn))
                contactItems.Add(("LinkedIn:", cv.LinkedIn, true));
            if (!string.IsNullOrWhiteSpace(cv.GitHub))
                contactItems.Add(("GitHub:", cv.GitHub, true));
            if (!string.IsNullOrWhiteSpace(cv.PersonalWebsite))
                contactItems.Add(("Portfolio:", cv.PersonalWebsite, true));

            foreach (var (label, value, isLink) in contactItems)
            {
                var para = new Paragraph();
                var paraProps = new ParagraphProperties();
                paraProps.Append(new SpacingBetweenLines() { After = "60" });
                para.Append(paraProps);

                // Label
                var labelRun = new Run();
                var labelRunProps = new RunProperties();
                labelRunProps.Append(new Bold());
                labelRunProps.Append(new FontSize() { Val = "18" });
                labelRun.Append(labelRunProps);
                labelRun.Append(new Text(label + " "));
                para.Append(labelRun);

                // Value
                var valueRun = new Run();
                var valueRunProps = new RunProperties();
                valueRunProps.Append(new FontSize() { Val = "18" });
                if (isLink)
                {
                    valueRunProps.Append(new DocumentFormat.OpenXml.Wordprocessing.Color() { Val = "0563C1" });
                    valueRunProps.Append(new Underline() { Val = UnderlineValues.Single });
                }
                valueRun.Append(valueRunProps);
                valueRun.Append(new Text(value));
                para.Append(valueRun);

                cell.Append(para);
            }
        }

        private void AddQRCode(TableCell cell, string url, MainDocumentPart mainPart)
        {
            try
            {
                using var qrGenerator = new QRCodeGenerator();
                var qrCodeData = qrGenerator.CreateQrCode(url, QRCodeGenerator.ECCLevel.M);
                using var qrCode = new PngByteQRCode(qrCodeData);
                var imageBytes = qrCode.GetGraphic(20);

                // Add image to document
                var imagePart = mainPart.AddImagePart(ImagePartType.Png);
                using var imageStream = new MemoryStream(imageBytes);
                imagePart.FeedData(imageStream);

                AddImageToCell(cell, mainPart.GetIdOfPart(imagePart), 600000, 600000); // 1 inch x 1 inch
            }
            catch
            {
                // If QR code generation fails, just add the URL as text
                var para = new Paragraph();
                var run = new Run();
                var runProps = new RunProperties();
                runProps.Append(new FontSize() { Val = "16" });
                run.Append(runProps);
                run.Append(new Text("Portfolio: " + url));
                para.Append(run);
                cell.Append(para);
            }
        }

        private void AddImageToCell(TableCell cell, string relationshipId, long widthEmu, long heightEmu)
        {
            var para = new Paragraph();
            var paraProps = new ParagraphProperties();
            paraProps.Append(new Justification() { Val = JustificationValues.Center });
            para.Append(paraProps);

            var run = new Run();
            var drawing = new Drawing();

            var inline = new DW.Inline()
            {
                DistanceFromTop = 0U,
                DistanceFromBottom = 0U,
                DistanceFromLeft = 0U,
                DistanceFromRight = 0U
            };

            var extent = new DW.Extent() { Cx = widthEmu, Cy = heightEmu };
            var effectExtent = new DW.EffectExtent() { LeftEdge = 0L, TopEdge = 0L, RightEdge = 0L, BottomEdge = 0L };
            var docPr = new DW.DocProperties() { Id = 1U, Name = "QR Code" };

            var graphic = new A.Graphic();
            var graphicData = new A.GraphicData() { Uri = "http://schemas.openxmlformats.org/drawingml/2006/picture" };

            var pic = new PIC.Picture();
            var nvPicPr = new PIC.NonVisualPictureProperties();
            var cNvPr = new PIC.NonVisualDrawingProperties() { Id = 0U, Name = "QR Code" };
            var cNvPicPr = new PIC.NonVisualPictureDrawingProperties();
            nvPicPr.Append(cNvPr);
            nvPicPr.Append(cNvPicPr);

            var blipFill = new PIC.BlipFill();
            var blip = new A.Blip() { Embed = relationshipId };
            var stretch = new A.Stretch();
            var fillRect = new A.FillRectangle();
            stretch.Append(fillRect);
            blipFill.Append(blip);
            blipFill.Append(stretch);

            var spPr = new PIC.ShapeProperties();
            var xfrm = new A.Transform2D();
            var off = new A.Offset() { X = 0L, Y = 0L };
            var ext = new A.Extents() { Cx = widthEmu, Cy = heightEmu };
            xfrm.Append(off);
            xfrm.Append(ext);

            var prstGeom = new A.PresetGeometry() { Preset = A.ShapeTypeValues.Rectangle };
            var avLst = new A.AdjustValueList();
            prstGeom.Append(avLst);

            spPr.Append(xfrm);
            spPr.Append(prstGeom);

            pic.Append(nvPicPr);
            pic.Append(blipFill);
            pic.Append(spPr);

            graphicData.Append(pic);
            graphic.Append(graphicData);

            inline.Append(extent);
            inline.Append(effectExtent);
            inline.Append(docPr);
            inline.Append(graphic);

            drawing.Append(inline);
            run.Append(drawing);
            para.Append(run);
            cell.Append(para);
        }

        private void AddSectionHeading(Body body, string text)
        {
            var para = new Paragraph();
            var run = new Run();
            var runProps = new RunProperties();
            runProps.Append(new Bold());
            runProps.Append(new FontSize() { Val = "24" }); // 12pt font
            runProps.Append(new DocumentFormat.OpenXml.Wordprocessing.Color() { Val = "2F5496" }); // Professional blue
            runProps.Append(new RunFonts() { Ascii = "Calibri" });
            run.Append(runProps);
            run.Append(new Text(text));

            var paraProps = new ParagraphProperties();
            paraProps.Append(new SpacingBetweenLines() { Before = "240", After = "120" });

            // Add bottom border
            var pBdr = new ParagraphBorders();
            var bottomBorder = new DocumentFormat.OpenXml.Wordprocessing.BottomBorder()
            {
                Val = new EnumValue<BorderValues>(BorderValues.Single),
                Size = 6,
                Color = "2F5496"
            };
            pBdr.Append(bottomBorder);
            paraProps.Append(pBdr);

            para.Append(paraProps);
            para.Append(run);
            body.Append(para);
        }

        private void AddExperienceEntry(Body body, Domain.Experience exp)
        {
            // Job title and company
            var titlePara = new Paragraph();
            var titleParaProps = new ParagraphProperties();
            titleParaProps.Append(new SpacingBetweenLines() { After = "60" });
            titlePara.Append(titleParaProps);

            var titleRun = new Run();
            var titleRunProps = new RunProperties();
            titleRunProps.Append(new Bold());
            titleRunProps.Append(new FontSize() { Val = "22" });
            titleRun.Append(titleRunProps);
            titleRun.Append(new Text(exp.Title));
            titlePara.Append(titleRun);

            var companyRun = new Run();
            var companyRunProps = new RunProperties();
            companyRunProps.Append(new FontSize() { Val = "20" });
            companyRun.Append(companyRunProps);
            companyRun.Append(new Text(" | " + exp.Company));
            titlePara.Append(companyRun);

            body.Append(titlePara);

            // Date and location
            var detailsPara = new Paragraph();
            var detailsParaProps = new ParagraphProperties();
            detailsParaProps.Append(new SpacingBetweenLines() { After = "120" });
            detailsPara.Append(detailsParaProps);

            var detailsRun = new Run();
            var detailsRunProps = new RunProperties();
            detailsRunProps.Append(new Italic());
            detailsRunProps.Append(new FontSize() { Val = "18" });
            detailsRunProps.Append(new DocumentFormat.OpenXml.Wordprocessing.Color() { Val = "595959" });
            detailsRun.Append(detailsRunProps);

            var dateText = $"{exp.StartDate:MMM yyyy} – {(exp.EndDate?.ToString("MMM yyyy") ?? "Present")}";
            if (!string.IsNullOrWhiteSpace(exp.Location))
                dateText += " | " + exp.Location;

            detailsRun.Append(new Text(dateText));
            detailsPara.Append(detailsRun);
            body.Append(detailsPara);

            // Highlights
            if (exp.Highlights?.Any() == true)
            {
                foreach (var highlight in exp.Highlights)
                {
                    var bulletPara = new Paragraph();
                    var bulletParaProps = new ParagraphProperties();
                    bulletParaProps.Append(new SpacingBetweenLines() { After = "80" });
                    var indentation = new Indentation() { Left = "360", Hanging = "360" };
                    bulletParaProps.Append(indentation);
                    bulletPara.Append(bulletParaProps);

                    var bulletRun = new Run();
                    var bulletRunProps = new RunProperties();
                    bulletRunProps.Append(new FontSize() { Val = "18" });
                    bulletRun.Append(bulletRunProps);
                    bulletRun.Append(new Text("• " + highlight));
                    bulletPara.Append(bulletRun);

                    body.Append(bulletPara);
                }
            }

            AddSpacing(body, "180");
        }

        private void AddProjectEntry(Body body, ProjectDto project)
        {
            // Project name
            var namePara = new Paragraph();
            var nameParaProps = new ParagraphProperties();
            nameParaProps.Append(new SpacingBetweenLines() { After = "60" });
            namePara.Append(nameParaProps);

            var nameRun = new Run();
            var nameRunProps = new RunProperties();
            nameRunProps.Append(new Bold());
            nameRunProps.Append(new FontSize() { Val = "20" });
            nameRun.Append(nameRunProps);
            nameRun.Append(new Text(project.Name));
            namePara.Append(nameRun);

            // Add status if in progress
            if (project.IsInProgress)
            {
                var statusRun = new Run();
                var statusRunProps = new RunProperties();
                statusRunProps.Append(new Italic());
                statusRunProps.Append(new FontSize() { Val = "18" });
                statusRunProps.Append(new DocumentFormat.OpenXml.Wordprocessing.Color() { Val = "E74C3C" });
                statusRun.Append(statusRunProps);
                statusRun.Append(new Text(" (In Progress)"));
                namePara.Append(statusRun);
            }

            body.Append(namePara);

            // Description
            if (!string.IsNullOrWhiteSpace(project.Description))
            {
                AddStyledParagraph(body, project.Description, fontSize: "18", afterSpacing: "80");
            }

            // Links
            var links = new List<string>();
            if (!string.IsNullOrWhiteSpace(project.Url))
                links.Add($"Demo: {project.Url}");
            if (!string.IsNullOrWhiteSpace(project.GitHubRepo))
                links.Add($"GitHub: {project.GitHubRepo}");

            if (links.Any())
            {
                var linksPara = new Paragraph();
                var linksParaProps = new ParagraphProperties();
                linksParaProps.Append(new SpacingBetweenLines() { After = "120" });
                linksPara.Append(linksParaProps);

                var linksRun = new Run();
                var linksRunProps = new RunProperties();
                linksRunProps.Append(new FontSize() { Val = "18" });
                linksRunProps.Append(new DocumentFormat.OpenXml.Wordprocessing.Color() { Val = "0563C1" });
                linksRunProps.Append(new Underline() { Val = UnderlineValues.Single });
                linksRun.Append(linksRunProps);
                linksRun.Append(new Text(string.Join(" | ", links)));
                linksPara.Append(linksRun);

                body.Append(linksPara);
            }

            AddSpacing(body, "120");
        }

        private void AddSkillsSection(Body body, List<SkillGroupDto> skillGroups)
        {
            foreach (var group in skillGroups)
            {
                var para = new Paragraph();
                var paraProps = new ParagraphProperties();
                paraProps.Append(new SpacingBetweenLines() { After = "120" });
                para.Append(paraProps);

                // Category name
                var categoryRun = new Run();
                var categoryRunProps = new RunProperties();
                categoryRunProps.Append(new Bold());
                categoryRunProps.Append(new FontSize() { Val = "20" });
                categoryRun.Append(categoryRunProps);
                categoryRun.Append(new Text(group.Category + ": "));
                para.Append(categoryRun);

                // Skills
                var skillsRun = new Run();
                var skillsRunProps = new RunProperties();
                skillsRunProps.Append(new FontSize() { Val = "18" });
                skillsRun.Append(skillsRunProps);
                skillsRun.Append(new Text(string.Join(" • ", group.Skills)));
                para.Append(skillsRun);

                body.Append(para);
            }
        }

        private void AddStyledParagraph(Body body, string text, string fontSize = "18",
            string afterSpacing = "120", JustificationValues? justification = null)
        {
            var para = new Paragraph();
            var paraProps = new ParagraphProperties();
            paraProps.Append(new SpacingBetweenLines() { After = afterSpacing });
            if (justification.HasValue)
                paraProps.Append(new Justification() { Val = justification.Value });
            para.Append(paraProps);

            var run = new Run();
            var runProps = new RunProperties();
            runProps.Append(new FontSize() { Val = fontSize });
            run.Append(runProps);
            run.Append(new Text(text));
            para.Append(run);

            body.Append(para);
        }

        private void AddSpacing(Body body, string spacing = "120")
        {
            var spacePara = new Paragraph();
            var spaceParaProps = new ParagraphProperties();
            spaceParaProps.Append(new SpacingBetweenLines() { After = spacing });
            spacePara.Append(spaceParaProps);
            body.Append(spacePara);
        }
    }
}