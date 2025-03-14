import { Button } from '@/components/ui/button';
import { courses } from '@/content/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const lessons = [
    {
        id: 1,
        title: 'Giới thiệu khóa học',
        duration: '10:00',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    {
        id: 2,
        title: 'Bài 1: Các khái niệm cơ bản',
        duration: '15:30',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    {
        id: 3,
        title: 'Bài 2: Thực hành',
        duration: '20:15',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
];

export default async function Page({
    params,
  }: {
    params: Promise<{ slug: string }>
  }) {
    const { slug } = await params;
    const course = courses.find((course) => course.id === parseInt(slug, 10));
    const currentLesson = lessons[0]; // This should be dynamic based on current lesson
    const currentIndex = lessons.findIndex((lesson) => lesson.id === currentLesson.id);
    const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

    if (!course) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4">
            <div className="mb-6">
                <Link href={`/courses/${course.id}`}>
                    <Button variant="outline">← Quay lại thông tin khóa học</Button>
                </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Video Player Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
                        <div className="aspect-video mb-4">
                            <iframe
                                src={currentLesson.videoUrl}
                                className="w-full h-full rounded-lg"
                                allowFullScreen
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">Giảng viên: {course.teacher}</p>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between">
                            {prevLesson ? (
                                <Button variant="outline" className="flex items-center gap-2">
                                    ← Bài trước
                                </Button>
                            ) : (
                                <div></div>
                            )}
                            {nextLesson ? (
                                <Button variant="outline" className="flex items-center gap-2">
                                    Bài tiếp theo →
                                </Button>
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:hidden mb-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="fixed top-20 right-4 z-50">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Nội dung bài học</SheetTitle>
                            </SheetHeader>
                            <div className="mt-4 space-y-3">
                                {lessons.map((lesson) => (
                                    <div
                                        key={lesson.id}
                                        className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium">{lesson.title}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Thời lượng: {lesson.duration}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="hidden lg:block lg:col-span-1">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Nội dung bài học</h2>
                        <div className="space-y-3">
                            {lessons.map((lesson) => (
                                <div
                                    key={lesson.id}
                                    className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium">{lesson.title}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Thời lượng: {lesson.duration}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
