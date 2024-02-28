using CodePulse.API.Models.Domain;

namespace CodePulse.API.Repositories.Interface;

public interface ICategoryRepository
{
    Task<Category> Create(Category category);
    Task<IEnumerable<Category>> GetAll();
    Task<Category?> Get(Guid id);
    Task<Category?> Update(Category category);
    Task<Category?> Delete(Guid id);
}
