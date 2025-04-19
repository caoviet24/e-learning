namespace Domain.Exceptions
{
    public class UnauthorizedAccessException : Exception
    {
        public UnauthorizedAccessException() : base("Not Unauthorized")
        {
            
        }
    }
}