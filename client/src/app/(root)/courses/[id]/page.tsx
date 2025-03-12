import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CourseDetail({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline">← Quay lại trang chủ</Button>
        </Link>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4">Introduction to Web Development</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-2xl font-semibold mb-4">Course Description</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Learn the fundamentals of web development in this comprehensive course.
                You'll master HTML, CSS, and JavaScript while building real-world projects.
              </p>

              <h2 className="text-2xl font-semibold mb-4">What You'll Learn</h2>
              <ul className="list-disc pl-6 mb-6">
                <li>HTML5 structure and semantics</li>
                <li>CSS3 styling and responsive design</li>
                <li>JavaScript fundamentals and DOM manipulation</li>
                <li>Modern web development tools and practices</li>
                <li>Building responsive web applications</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4">Course Content</h2>
              <div className="space-y-4">
                <div className="border dark:border-gray-700 rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">Module 1: HTML Fundamentals</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Introduction to HTML, document structure, and semantic elements.
                  </p>
                </div>
                <div className="border dark:border-gray-700 rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">Module 2: CSS Basics</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Styling with CSS, selectors, and the box model.
                  </p>
                </div>
                <div className="border dark:border-gray-700 rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">Module 3: JavaScript Essentials</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Core JavaScript concepts and programming basics.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Course Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                  <p className="font-medium">12 Weeks</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Level</p>
                  <p className="font-medium">Beginner</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Prerequisites</p>
                  <p className="font-medium">None</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Instructor</p>
                  <p className="font-medium">John Doe</p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button className="w-full">Enroll Now</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}