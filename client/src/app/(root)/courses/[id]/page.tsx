import { Button } from "@/components/ui/button"
import { courses } from "@/content/data"
import Link from "next/link"
import { notFound } from "next/navigation"

export default function CourseDetail({ params }: { params: { id: string } }) {
  const course = courses.find((course) => course.id === parseInt(params.id))

  if (!course) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline">← Quay lại trang chủ</Button>
        </Link>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="prose dark:prose-invert max-w-none">
              <div className="mb-6">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full rounded-lg mb-4"
                />
              </div>

              <h2 className="text-2xl font-semibold mb-4">Mô tả khóa học</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Khóa học {course.title} sẽ cung cấp cho bạn những kiến thức cơ bản và chuyên sâu.
              </p>

              <h2 className="text-2xl font-semibold mb-4">Nội dung khóa học</h2>
              <div className="space-y-4">
                <div className="border dark:border-gray-700 rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">Module 1: Giới thiệu</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Tổng quan về khóa học và các kiến thức nền tảng.
                  </p>
                </div>
                <div className="border dark:border-gray-700 rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">Module 2: Kiến thức cơ bản</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Các khái niệm và kỹ thuật cơ bản.
                  </p>
                </div>
                <div className="border dark:border-gray-700 rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">Module 3: Thực hành</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Áp dụng kiến thức vào các bài tập thực tế.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Thông tin khóa học</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Chuyên ngành</p>
                  <p className="font-medium">{course.major}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Khoa</p>
                  <p className="font-medium">{course.Faculty}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Giảng viên</p>
                  <p className="font-medium">{course.teacher}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Lượt xem</p>
                  <p className="font-medium">{course.views.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Đánh giá</p>
                  <p className="font-medium">{course.rating}/5</p>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <Button className="w-full" asChild>
                  <Link href={`/learning/${course.id}`}>
                    Vào học
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}