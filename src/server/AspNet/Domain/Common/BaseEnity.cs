namespace Domain.Common
{
    public abstract class BaseEnity
    {
        public string Id { get; protected set; } = Guid.NewGuid().ToString();
    }
}