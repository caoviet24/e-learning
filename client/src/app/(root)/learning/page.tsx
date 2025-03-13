import { courses } from '@/content/data';
import { CourseCard } from '@/components/course-card';

export default function LearningPage() {
    return (
        <div className="container py-8">
            <h1 className="text-2xl font-bold mb-6">Khóa học đã tham gia</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => 
                    course.progress !== undefined && (
                        <CourseCard
                            key={course.id}
                            id={course.id}
                            title={course.title}
                            major={course.major}
                            Faculty={course.Faculty}
                            teacher={course.teacher}
                            thumbnail={course.thumbnail}
                            views={course.views}
                            rating={course.rating}
                            progress={course.progress}
                        />
                    )
                )}
            </div>
        </div>
    );
}
