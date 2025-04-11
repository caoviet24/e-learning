using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.Common
{
    public abstract class BaseEnity
    {
        public string Id { get; protected set; } = Guid.NewGuid().ToString();
    }
}