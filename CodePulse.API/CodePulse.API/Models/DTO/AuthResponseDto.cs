namespace CodePulse.API.Models.DTO;

public class AuthResponseDto
{
    public required string Email { get; set; }
    public required string Token { get; set; }
    public required List<string> Roles { get; set; }
}
