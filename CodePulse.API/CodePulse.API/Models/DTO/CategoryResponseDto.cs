namespace CodePulse.API.Models.DTO;

public class CategoryResponseDto
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required string UrlHandle { get; set; }
}
