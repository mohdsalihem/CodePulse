using CodePulse.API.Models.Domain;
using CodePulse.API.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace CodePulse.API.Repositories.Implementation;
public class BlogPostRepository : IBlogPostRepository
{
    private readonly ApplicationDbContext dbContext;

    public BlogPostRepository(ApplicationDbContext dbContext)
    {
        this.dbContext = dbContext;
    }
    public async Task<BlogPost> Create(BlogPost blogPost)
    {
        await dbContext.BlogPosts.AddAsync(blogPost);
        await dbContext.SaveChangesAsync();

        return blogPost;
    }

    public async Task<BlogPost?> Delete(Guid id)
    {
        var existingBlogPost = await dbContext.BlogPosts.FirstOrDefaultAsync(x => x.Id == id);
        if (existingBlogPost is null)
        {
            return existingBlogPost;
        }

        dbContext.BlogPosts.Remove(existingBlogPost);
        await dbContext.SaveChangesAsync();
        return existingBlogPost;
    }

    public async Task<BlogPost?> Get(Guid id)
    {
        return await dbContext.BlogPosts.Include(x => x.Categories).FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<BlogPost?> Get(string urlHandle)
    {
        return await dbContext.BlogPosts.Include(x => x.Categories).FirstOrDefaultAsync(x => x.UrlHandle == urlHandle);
    }

    public async Task<IEnumerable<BlogPost>> GetAll()
    {
        return await dbContext.BlogPosts.Include(x => x.Categories).ToListAsync();
    }

    public async Task<BlogPost?> Update(BlogPost blogPost)
    {
        var existingBlogPost = await dbContext.BlogPosts.Include(x => x.Categories).FirstOrDefaultAsync(x => x.Id == blogPost.Id);
        if (existingBlogPost is null)
        {
            return null;
        }

        // Update blog post
        dbContext.Entry(existingBlogPost).CurrentValues.SetValues(blogPost);

        // Update categories
        existingBlogPost.Categories = blogPost.Categories;

        await dbContext.SaveChangesAsync();

        return blogPost;
    }
}
