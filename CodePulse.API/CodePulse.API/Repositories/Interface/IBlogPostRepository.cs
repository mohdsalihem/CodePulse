using CodePulse.API.Models.Domain;

namespace CodePulse.API.Repositories.Interface;

public interface IBlogPostRepository
{
    Task<BlogPost> Create(BlogPost blogPost);
    Task<IEnumerable<BlogPost>> GetAll();
    Task<BlogPost?> Get(Guid id);
    Task<BlogPost?> Get(string urlHandle);
    Task<BlogPost?> Update(BlogPost blogPost);
    Task<BlogPost?> Delete(Guid id);
}
