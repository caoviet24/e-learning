import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="p-6">
      <div className="max-w-5xl mx-auto">
        {/* Title section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Welcome back!</h2>
          <p className="text-muted-foreground">
            Continue your learning journey from where you left off.
          </p>
        </div>

        {/* Course grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Course cards */}
          {[
            {
              title: "Next.js Development",
              description: "Master the fundamentals of Next.js and build modern web applications",
              icon: "/window.svg",
              progress: 60,
            },
            {
              title: "React Essentials",
              description: "Learn React.js with practical examples and real-world projects",
              icon: "/file.svg",
              progress: 40,
            },
            {
              title: "Full Stack Journey",
              description: "Comprehensive guide to becoming a complete web developer",
              icon: "/globe.svg",
              progress: 25,
            },
          ].map((course, index) => (
            <Link
              key={index}
              href={`/courses/${index + 1}`}
              className="block"
            >
              <div className="card-gradient border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-slate-800/50 p-2 mb-4">
                  <Image
                    src={course.icon}
                    alt={course.title}
                    width={24}
                    height={24}
                    className="dark:invert"
                  />
                </div>
                <h3 className="text-lg font-medium mb-2">{course.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {course.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="w-full max-w-[120px] h-1.5 rounded-full bg-slate-800">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {course.progress}%
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
