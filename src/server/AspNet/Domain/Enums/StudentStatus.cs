using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.Enums
{
    public enum StudentStatus
    {
        // Trạng thái: Đang học, Bảo lưu, Tốt nghiệp, Bỏ học 
        STUDYING,
        DEFERRED,
        GRADUATED,
        DROPPEDOUT
    }
}