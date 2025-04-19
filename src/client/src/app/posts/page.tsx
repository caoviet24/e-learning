'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThumbsUp, MessageSquare, BookmarkPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Interface for post data
interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  likeCount: number;
  tag: string;
  hashtag?: string;
  author: {
    id: string;
    fullName: string;
    avatar?: string;
    role: string;
  };
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  // Fetch posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        // This would be your actual API endpoint
        const response = await axios.get('/api/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        // Use sample data for demonstration
        setPosts([
          {
            id: '1',
            title: 'Thông báo lịch thi cuối kỳ',
            content: 'Lịch thi cuối kỳ đã được cập nhật. Sinh viên vui lòng kiểm tra lịch thi và chuẩn bị cho kỳ thi.',
            createdAt: '2025-04-10T08:00:00Z',
            likeCount: 24,
            tag: 'Thông báo',
            hashtag: '#lichthi #cuoiky',
            author: {
              id: '101',
              fullName: 'Nguyễn Văn A',
              avatar: '',
              role: 'LECTURER',
            },
          },
          {
            id: '2',
            title: 'Hướng dẫn đăng ký khoá học mới',
            content: 'Đây là hướng dẫn chi tiết cách đăng ký các khoá học mới trong học kỳ tới.',
            imageUrl: 'https://placehold.co/600x400',
            createdAt: '2025-04-15T10:30:00Z',
            likeCount: 15,
            tag: 'Hướng dẫn',
            author: {
              id: '102',
              fullName: 'Trần Thị B',
              avatar: '',
              role: 'LECTURER',
            },
          },
          {
            id: '3',
            title: 'Chia sẻ tài liệu học tập',
            content: 'Các bạn có thể tìm thấy tài liệu học tập mới tại thư viện trường.',
            createdAt: '2025-04-12T14:20:00Z',
            likeCount: 32,
            tag: 'Tài liệu',
            author: {
              id: '103',
              fullName: 'Lê Văn C',
              avatar: '',
              role: 'STUDENT',
            },
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Format date to display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8">Bảng tin chung</h1>
      
      {user && (user.account?.role === 'LECTURER' || user.account?.role === 'ADMIN') && (
        <div className="mb-6">
          <Button className="bg-primary hover:bg-primary/90">Tạo bài đăng mới</Button>
        </div>
      )}
      
      {isLoading ? (
        // Loading skeletons
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="shadow-md">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
                <div className="mt-4">
                  <Skeleton className="h-[200px] w-full rounded-lg" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={post.author.avatar} alt={post.author.fullName} />
                      <AvatarFallback>{post.author.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{post.author.fullName}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        {formatDate(post.createdAt)}
                        <span>•</span>
                        <Badge variant="outline">{post.author.role === 'LECTURER' ? 'Giảng viên' : 'Sinh viên'}</Badge>
                      </div>
                    </div>
                  </div>
                  <Badge>{post.tag}</Badge>
                </div>
                <CardTitle className="mt-2">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{post.content}</p>
                {post.imageUrl && (
                  <div className="mt-4">
                    <img src={post.imageUrl} alt={post.title} className="rounded-lg w-full object-cover max-h-[400px]" />
                  </div>
                )}
                {post.hashtag && (
                  <div className="mt-4">
                    <span className="text-primary text-sm">{post.hashtag}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="flex justify-between w-full">
                  <Button variant="ghost" className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{post.likeCount}</span>
                  </Button>
                  <Button variant="ghost" className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>Bình luận</span>
                  </Button>
                  <Button variant="ghost" className="flex items-center gap-1">
                    <BookmarkPlus className="h-4 w-4" />
                    <span>Lưu</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}