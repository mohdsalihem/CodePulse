namespace CodePulse.API.Models.DTO;

public class BlogImageRequestDto
{
    public required IFormFile File { get; set; }
    public required string FileName { get; set; }
    public required string Title { get; set; }
}
