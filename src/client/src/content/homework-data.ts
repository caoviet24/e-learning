export type HomeworkType = 'file' | 'multiple_choice';

export interface BaseHomework {
    id: number;
    title: string;
    courseId: number;
    courseName: string;
    dueDate: string;
    status: 'pending' | 'submitted' | 'graded';
    grade?: number;
    type: HomeworkType;
    description: string;
}

export interface FileHomework extends BaseHomework {
    type: 'file';
    allowedFileTypes: string[];
    maxFileSize: number; // in MB
}

export interface MultipleChoiceQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer?: number; // Index of correct option (only available after submission)
}

export interface MultipleChoiceHomework extends BaseHomework {
    type: 'multiple_choice';
    questions: MultipleChoiceQuestion[];
    timeLimit: number; // in minutes
}

export type Homework = FileHomework | MultipleChoiceHomework;

export const homeworks: Homework[] = [
    {
        id: 1,
        title: 'Bài tập 1: Thiết kế giao diện website',
        courseId: 1,
        courseName: 'Nhập môn lập trình',
        dueDate: '2025-03-20',
        status: 'pending',
        type: 'file',
        description: 'Thiết kế giao diện website theo yêu cầu đã cho trong file đề bài. Nộp file source code và file báo cáo.',
        allowedFileTypes: ['.zip', '.rar', '.pdf'],
        maxFileSize: 10
    },
    {
        id: 2,
        title: 'Bài tập 2: Kiểm tra kiến thức CSS',
        courseId: 1,
        courseName: 'Nhập môn lập trình',
        dueDate: '2025-03-18',
        status: 'submitted',
        type: 'multiple_choice',
        description: 'Bài kiểm tra kiến thức về CSS, Flexbox và Grid.',
        questions: [
            {
                id: 1,
                question: 'Thuộc tính nào trong CSS được sử dụng để thay đổi màu chữ?',
                options: [
                    'text-color',
                    'color',
                    'font-color',
                    'text-style'
                ]
            },
            {
                id: 2,
                question: 'Đơn vị nào sau đây là đơn vị tương đối trong CSS?',
                options: [
                    'px',
                    'rem',
                    'cm',
                    'pt'
                ]
            },
            {
                id: 3,
                question: 'Thuộc tính display: flex; được đặt ở đâu?',
                options: [
                    'Phần tử con',
                    'Phần tử cha',
                    'Cả hai phần tử',
                    'Không phần tử nào'
                ]
            }
        ],
        timeLimit: 15
    },
    {
        id: 3,
        title: 'Bài tập 3: Báo cáo đồ án',
        courseId: 1,
        courseName: 'Nhập môn lập trình',
        dueDate: '2025-03-15',
        status: 'graded',
        grade: 9,
        type: 'file',
        description: 'Nộp báo cáo đồ án cuối kỳ theo mẫu.',
        allowedFileTypes: ['.pdf', '.doc', '.docx'],
        maxFileSize: 20
    }
];