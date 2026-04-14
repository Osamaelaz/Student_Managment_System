using System.Linq.Expressions;

namespace API02.Repositories
{
    public interface IGenericRepository<T> where T : class
    {
        IEnumerable<T> GetAll();
        T? GetById(int id);
        void Add(T entity);
        void Update(T entity);
        void Delete(T entity);
        bool Any();
        int Max(Expression<Func<T, int>> selector);
    }
}