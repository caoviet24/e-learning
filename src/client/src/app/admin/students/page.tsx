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

interface Student {
  id: number;
  name: string;
  email: string;
  studentId: string;
  department: string;
  className: string;
}

export default function StudentsPage() {
  const [departments] = useState([
    { id: 1, name: "Khoa Công nghệ thông tin" },
    { id: 2, name: "Khoa Điện tử" },
  ]);

  const [classes] = useState([
    { id: 1, name: "DHTI15A1", departmentId: 1 },
    { id: 2, name: "DHTI15A2", departmentId: 1 },
    { id: 3, name: "DHDT15A1", departmentId: 2 },
  ]);

  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      studentId: "2024001",
      department: "Khoa Công nghệ thông tin",
      className: "DHTI15A1",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@example.com",
      studentId: "2024002",
      department: "Khoa Điện tử",
      className: "DHDT15A1",
    },
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [newStudent, setNewStudent] = useState<Omit<Student, "id">>({
    name: "",
    email: "",
    studentId: "",
    department: "",
    className: "",
  });

  // Filter classes based on selected department
  const filteredClasses = classes.filter(
    (cls) => 
      !selectedDepartment || 
      departments.find(d => d.name === selectedDepartment)?.id === cls.departmentId
  );

  // Filter students based on selected department and class
  const filteredStudents = students.filter(
    (student) =>
      (!selectedDepartment || student.department === selectedDepartment) &&
      (!selectedClass || student.className === selectedClass)
  );

  const handleAdd = () => {
    setStudents([
      ...students,
      { id: students.length + 1, ...newStudent },
    ]);
    setNewStudent({
      name: "",
      email: "",
      studentId: "",
      department: "",
      className: "",
    });
    setIsAddOpen(false);
  };

  const handleDelete = (id: number) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Quản lý sinh viên</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm sinh viên mới
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm sinh viên mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label>Họ và tên</label>
                <Input
                  placeholder="Nhập họ và tên"
                  value={newStudent.name}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label>Email</label>
                <Input
                  type="email"
                  placeholder="Nhập email"
                  value={newStudent.email}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label>Mã sinh viên</label>
                <Input
                  placeholder="Nhập mã sinh viên"
                  value={newStudent.studentId}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, studentId: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label>Khoa</label>
                <Select
                  value={newStudent.department}
                  onValueChange={(value) =>
                    setNewStudent({ ...newStudent, department: value })
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
                <label>Lớp</label>
                <Select
                  value={newStudent.className}
                  onValueChange={(value) =>
                    setNewStudent({ ...newStudent, className: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn lớp" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredClasses.map((cls) => (
                      <SelectItem key={cls.id} value={cls.name}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
        <div className="w-[200px]">
          <Select
            value={selectedClass}
            onValueChange={setSelectedClass}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn lớp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tất cả lớp</SelectItem>
              {filteredClasses.map((cls) => (
                <SelectItem key={cls.id} value={cls.name}>
                  {cls.name}
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
            <TableHead>Mã sinh viên</TableHead>
            <TableHead>Họ và tên</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Khoa</TableHead>
            <TableHead>Lớp</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStudents.map((student, index) => (
            <TableRow key={student.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{student.studentId}</TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.department}</TableCell>
              <TableCell>{student.className}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="icon">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(student.id)}
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