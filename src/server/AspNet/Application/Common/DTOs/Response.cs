using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Common.DTOs
{
    public class Response<T> where T : class
    {
        public bool Ok { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }

        public static Response<T> Success(T data, string message = "")
        {
            return new Response<T>
            {
                Ok = true,
                Message = message,
                Data = data
            };
        }

        public static Response<T> Fail(string message)
        {
            return new Response<T>
            {
                Ok = false,
                Message = message
            };
        }
    }
}