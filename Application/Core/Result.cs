using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Application.Core
{
    public class Result<T>
    {
        public bool IsSuccess { get; set; }
        public T? Value { get; set; }
        public string? Error { get; set; }

        public int Code { get; set; } = 200;

        public static Result<T> Success(T value)
        {
            return new Result<T> { IsSuccess = true, Value = value, Code = 200 };
        }
        public static Result<T> Failure(string error, int code)
        {
            return new Result<T> { IsSuccess = false, Error = error, Code = code };
        }


    }
}
