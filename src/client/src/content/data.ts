export const Khoa = [
    { id: 1, name: 'Công Nghệ Thông Tin' },
    { id: 2, name: 'Ngôn ngữ Anh' },
    { id: 3, name: 'Vật lý' },
];

export const Nganh = [
    { id: 1, name: 'Kỹ thuật phần mềm', khoaId: 1 },
    { id: 2, name: 'Đồ họa', khoaId: 1 },
    { id: 3, name: 'Ngôn ngữ Anh', khoaId: 2 },
    { id: 4, name: 'Vật lý lượng tử', khoaId: 3 },
];

export const giangVien = [
    { id: 1, name: 'Bùi Đức Thọ', nganhId: 1, khoaId: 1 },
    { id: 2, name: 'Nguyễn Thị Phương', nganhId: 1, khoaId: 1 },
    { id: 3, name: 'Bùi Thị Linh', nganhId: 3, khoaId: 2 },
    { id: 4, name: 'Nguyễn Thị Hiển', nganhId: 4, khoaId: 3 },
];

export const boMon = [
    { id: 1, name: 'Thiết kế website', nganhId: 1, khoaId: 1, giangVienId: [1] },
    { id: 2, name: 'Cơ sở dữ liệu', nganhId: 1, khoaId: 1, giangVienId: [1, 2] },
    { id: 3, name: 'Figma cơ bản', nganhId: 2, khoaId: 1, giangVienId: [2] },
    { id: 4, name: 'Tiếng anh cơ bản', nganhId: 3, khoaId: 2, giangVienId: [3] },
    { id: 5, name: 'Vật lý kĩ thuật', nganhId: 4, khoaId: 3, giangVienId: [4] },
];

export const courses = [
    {
        id: 1,
        title: 'Nhập môn lập trình',
        major: 'Công nghệ thông tin',
        Faculty: 'Kỹ thuật phần mềm',
        teacher: 'Bùi Đức Thọ',
        thumbnail: 'https://files.fullstack.edu.vn/f8-prod/courses/7.png',
        views: 99999,
        rating: 4.5,
    },
    {
        id: 11,
        title: 'Nhập môn lập trình',
        major: 'Công nghệ thông tin',
        Faculty: 'Kỹ thuật phần mềm',
        teacher: 'Nguyễn Thị Phương',
        thumbnail: 'https://files.fullstack.edu.vn/f8-prod/courses/7.png',
        views: 99999,
        rating: 4.5,
    },
    {
        id: 33,
        title: 'Nhập môn lập trình',
        major: 'Công nghệ thông tin',
        Faculty: 'Kỹ thuật phần mềm',
        teacher: 'Bùi Đức Thọ',
        thumbnail: 'https://files.fullstack.edu.vn/f8-prod/courses/7.png',
        views: 99999,
        rating: 4.5,
        isJoin: true,
        progress: 40,
    },
    {
        id: 22,
        title: 'Nhập môn lập trình',
        major: 'Công nghệ thông tin',
        Faculty: 'Kỹ thuật phần mềm',
        teacher: 'Bùi Đức Thọ',
        thumbnail: 'https://files.fullstack.edu.vn/f8-prod/courses/7.png',
        views: 99999,
        rating: 4.5,
        isJoin: true,
        progress: 40,
    },
    {
        id: 44,
        title: 'Nhập môn lập trình',
        major: 'Công nghệ thông tin',
        Faculty: 'Kỹ thuật phần mềm',
        teacher: 'Bùi Đức Thọ',
        thumbnail: 'https://files.fullstack.edu.vn/f8-prod/courses/7.png',
        views: 99999,
        rating: 4.5
    },
    {
        id: 55,
        title: 'Nhập môn lập trình',
        major: 'Công nghệ thông tin',
        Faculty: 'Kỹ thuật phần mềm',
        teacher: 'Bùi Đức Thọ',
        thumbnail: 'https://files.fullstack.edu.vn/f8-prod/courses/7.png',
        views: 99999,
        rating: 4.5,
    },
];

export const myCourses = [
    {
        title: 'Next.js Development',
        description: 'Master the fundamentals of Next.js and build modern web applications',
        icon: '/window.svg',
        progress: 60,
    },
    {
        title: 'React Essentials',
        description: 'Learn React.js with practical examples and real-world projects',
        icon: '/file.svg',
        progress: 40,
    },
    {
        title: 'Full Stack Journey',
        description: 'Comprehensive guide to becoming a complete web developer',
        icon: '/globe.svg',
        progress: 25,
    },
];



export const myAccount = {
    name : 'Test User',
    role: 'student',
}


export const accTest = [
    {
        id: 1,
        username: "st1",
        password: "1",
        role: 0,
    },
    {
        id: 2,
        username: "tch1",
        password: "1",
        role: 1
    },
]