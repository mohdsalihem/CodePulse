﻿namespace CodePulse.API.Models.DTO;

public class AuthRequestDto
{
    public required string Email { get; set; }
    public required string Password { get; set; }
}
