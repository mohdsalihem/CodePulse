using CodePulse.API.Models.Domain;
using CodePulse.API.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace CodePulse.API.Repositories.Implementation;

public class BlogImageRepository : IBlogImageRepository
{
    private readonly IWebHostEnvironment webHostEnvironment;
    private readonly IHttpContextAccessor httpContextAccessor;
    private readonly ApplicationDbContext dbContext;

    public BlogImageRepository(IWebHostEnvironment webHostEnvironment, IHttpContextAccessor httpContextAccessor, ApplicationDbContext dbContext)
    {
        this.webHostEnvironment = webHostEnvironment;
        this.httpContextAccessor = httpContextAccessor;
        this.dbContext = dbContext;
    }

    public async Task<IEnumerable<BlogImage>> GetAll()
    {
        return await dbContext.BlogImages.ToListAsync();
    }

    public async Task<BlogImage> Upload(IFormFile file, BlogImage blogImage)
    {
        // Upload image to Images folder
        var localPath = Path.Combine(webHostEnvironment.ContentRootPath, "Images", $"{blogImage.FileName}{blogImage.FileExtension}");
        using var stream = new FileStream(localPath, FileMode.Create);
        await file.CopyToAsync(stream);

        // Update database
        var request = httpContextAccessor?.HttpContext?.Request;
        var urlPath = $"{request!.Scheme}://{request!.Host}{request.PathBase}/Images/{blogImage.FileName}{blogImage.FileExtension}";
        blogImage.Url = urlPath;
        await dbContext.BlogImages.AddAsync(blogImage);
        await dbContext.SaveChangesAsync();

        return blogImage;
    }
}
