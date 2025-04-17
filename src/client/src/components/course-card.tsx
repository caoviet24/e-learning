import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { IFaculty, IMajor, IUser } from '@/types';

interface CourseCardProps {
    id: number;
    title: string;
    description?: string;
    author?: IUser;
    major: IMajor;
    faculty: IFaculty;
    thumbnail: string;
    views: number;
    rating: number;
    isJoin?: boolean;
    progress?: number;
}

export function CourseCard({ id, title, major, faculty, author, thumbnail, views, rating, isJoin, progress }: CourseCardProps) {
    return (
        <Card className="w-full h-[400px] overflow-hidden shadow-lg flex flex-col">
            <div className="relative h-48">
                <Image src={thumbnail} alt={title} fill className="object-cover" />
            </div>
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">Khoa: {major.name}</p>
                <p className="text-sm text-muted-foreground">Ngành: {faculty.name}</p>
                <p className="text-sm text-muted-foreground">Giảng viên: {author?.fullName}</p>
            </CardContent>
            {isJoin && progress && (
                <CardFooter className="justify-between text-sm text-muted-foreground">
                    <div className="w-full flex items-center gap-2">
                        <div className="text-sm text-muted-foreground">Tiến độ: {progress}%</div>
                        <div className=" flex-1 h-2 bg-white rounded-full border border-gray-200">
                            <div className="h-full bg-purple-600 rounded-full transition-all" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                </CardFooter>
            )}
            {!isJoin && !progress && (
                <CardFooter className="justify-between text-sm text-muted-foreground">
                    <div>Lượt xem: {views.toLocaleString()}</div>
                    <div>Đánh giá: {rating}/5</div>
                </CardFooter>
            )}
        </Card>
    );
}
