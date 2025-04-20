namespace Application.Common.DTOs
{
    public class ResponseList<T> where T : class
    {
        public IEnumerable<T> data { get; set; } = new List<T>();
        public int totalCount { get; set; }
        public int pageNumber { get; set; }
        public int pageSize { get; set; }
        
        public static ResponseList<T> Create(IEnumerable<T> data, int totalCount, int pageNumber, int pageSize)
        {
            return new ResponseList<T>
            {
                data = data,
                totalCount = totalCount,
                pageNumber = pageNumber,
                pageSize = pageSize
            };
        }
    }
}