import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { courses } from '@/content/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const courseId = parseInt(slug, 10);
    const course = courses.find((course) => course.id === courseId);

    if (!course) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
                <Link href={`/student/courses/${course.id}`}>
                    <Button variant="outline">← Quay lại khóa học</Button>
                </Link>
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Menu className="h-4 w-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-full sm:w-[340px] p-0">
                            <div className="p-6 border-b dark:border-gray-700">
                                <SheetTitle className="font-semibold mb-4">Danh sách bài học</SheetTitle>
                                <div className="space-y-2">
                                    {[1, 2, 3, 4, 5].map((lesson) => (
                                        <div
                                            key={lesson}
                                            className={`p-3 rounded ${
                                                lesson === 1
                                                    ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500'
                                                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">Bài {lesson}: Tiêu đề bài học</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">20 phút</p>
                                                </div>
                                                {lesson === 1 && (
                                                    <span className="text-blue-500 text-sm font-medium">Đang học</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="font-semibold mb-4">Tiến độ học tập</h3>
                                <div className="mb-4">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium">20% hoàn thành</span>
                                        <span className="text-sm font-medium">1/5 bài học</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                                    </div>
                                </div>

                                <Button className="w-full mt-4">Hoàn thành bài học</Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg">
                <div className="p-6 border-b dark:border-gray-700">
                    <h1 className="text-2xl font-bold">{course.title}</h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">Giảng viên: {course.teacher}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                    <div className="col-span-1 md:col-span-2 p-0">
                        <div className="aspect-video bg-black flex items-center justify-center">
                            <div className="text-center p-8">
                                <h3 className="text-xl text-white mb-4">Video bài giảng</h3>
                                <p className="text-gray-300">Nội dung bài giảng sẽ được hiển thị tại đây</p>
                            </div>
                        </div>

                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Nội dung bài học</h2>
                            <div className="prose dark:prose-invert max-w-none">
                                <p>
                                    Đây là nội dung chi tiết của bài học. Bao gồm các kiến thức lý thuyết, ví dụ minh
                                    họa và các bài tập thực hành.
                                </p>

                                <h3 className="mt-6">Tài liệu học tập</h3>
                                <ul className="space-y-2 mt-2">
                                    <li>
                                        <a
                                            href="#"
                                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                                        >
                                            <span>Slide bài giảng - PDF</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                                        >
                                            <span>Bài tập thực hành</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                                        >
                                            <span>Tài liệu tham khảo</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Desktop lesson list */}
                    <div className="border-l dark:border-gray-700 hidden md:block">
                        <div className="p-6 border-b dark:border-gray-700">
                            <h3 className="font-semibold mb-4">Danh sách bài học</h3>
                            <div className="space-y-2">
                                {[1, 2, 3, 4, 5].map((lesson) => (
                                    <div
                                        key={lesson}
                                        className={`p-3 rounded ${
                                            lesson === 1
                                                ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500'
                                                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Bài {lesson}: Tiêu đề bài học</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">20 phút</p>
                                            </div>
                                            {lesson === 1 && (
                                                <span className="text-blue-500 text-sm font-medium">Đang học</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className="font-semibold mb-4">Tiến độ học tập</h3>
                            <div className="mb-4">
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">20% hoàn thành</span>
                                    <span className="text-sm font-medium">1/5 bài học</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                                </div>
                            </div>

                            <Button className="w-full mt-4">Hoàn thành bài học</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
