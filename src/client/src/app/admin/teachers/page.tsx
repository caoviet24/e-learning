"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Plus, Trash } from "lucide-react";
import { useState } from "react";

interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
}

export default function TeachersPage() {
  const [departments] = useState([
    { id: 1, name: "Khoa Công nghệ thông tin" },
    { id: 2, name: "Khoa Điện tử" },
  ]);

  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      department: "Khoa Công nghệ thông tin",
      phone: "0123456789",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@example.com",
      department: "Khoa Điện tử",
      phone: "0987654321",
    },
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [newTeacher, setNewTeacher] = useState<Omit<Teacher, "id">>({
    name: "",
    email: "",
    department: "",
    phone: "",
  });

  // Filter teachers based on selected department
  const filteredTeachers = teachers.filter(
    (teacher) => !selectedDepartment || teacher.department === selectedDepartment
  );

  const handleAdd = () => {
    setTeachers([
      ...teachers,
      { id: teachers.length + 1, ...newTeacher },
    ]);
    setNewTeacher({
      name: "",
      email: "",
      department: "",
      phone: "",
    });
    setIsAddOpen(false);
  };

  const handleDelete = (id: number) => {
    setTeachers(teachers.filter((teacher) => teacher.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Quản lý giảng viên</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm giảng viên mới
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm giảng viên mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label>Họ và tên</label>
                <Input
                  placeholder="Nhập họ và tên"
                  value={newTeacher.name}
                  onChange={(e) =>
                    setNewTeacher({ ...newTeacher, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label>Email</label>
                <Input
                  type="email"
                  placeholder="Nhập email"
                  value={newTeacher.email}
                  onChange={(e) =>
                    setNewTeacher({ ...newTeacher, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label>Khoa</label>
                <Select
                  value={newTeacher.department}
                  onValueChange={(value) =>
                    setNewTeacher({ ...newTeacher, department: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn khoa" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label>Số điện thoại</label>
                <Input
                  placeholder="Nhập số điện thoại"
                  value={newTeacher.phone}
                  onChange={(e) =>
                    setNewTeacher({ ...newTeacher, phone: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleAdd} className="w-full">
                Thêm mới
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="w-[200px]">
          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn khoa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tất cả khoa</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.name}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>STT</TableHead>
            <TableHead>Họ và tên</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Khoa</TableHead>
            <TableHead>Số điện thoại</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTeachers.map((teacher, index) => (
            <TableRow key={teacher.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{teacher.name}</TableCell>
              <TableCell>{teacher.email}</TableCell>
              <TableCell>{teacher.department}</TableCell>
              <TableCell>{teacher.phone}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="icon">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(teacher.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}