export const facultyStats = {
  totalCount: 12,
  byDepartment: {
    labels: ['Công nghệ thông tin', 'Kỹ thuật điện tử', 'Quản trị kinh doanh', 'Ngoại ngữ', 'Kinh tế', 'Cơ khí'],
    data: [24, 18, 15, 12, 9, 7],
  },
  studentDistribution: {
    labels: ['Công nghệ thông tin', 'Kỹ thuật điện tử', 'Quản trị kinh doanh', 'Ngoại ngữ', 'Kinh tế', 'Cơ khí'],
    data: [820, 650, 540, 430, 380, 290],
  },
  growthByYear: {
    labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
    data: [8, 9, 10, 10, 11, 12],
  }
};

export const majorStats = {
  totalCount: 45,
  byFaculty: {
    labels: ['Công nghệ thông tin', 'Kỹ thuật điện tử', 'Quản trị kinh doanh', 'Ngoại ngữ', 'Kinh tế', 'Cơ khí'],
    data: [8, 7, 9, 6, 8, 7],
  },
  popularMajors: {
    labels: ['Kỹ thuật phần mềm', 'Quản trị kinh doanh', 'Ngôn ngữ Anh', 'Điện tử viễn thông', 'Kế toán', 'Trí tuệ nhân tạo'],
    data: [185, 165, 145, 130, 125, 120],
  },
  studentEnrollment: {
    labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'CNTT',
        data: [145, 160, 175, 190, 205, 220],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
      {
        label: 'Kinh tế',
        data: [130, 145, 155, 165, 175, 180],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Kỹ thuật',
        data: [110, 125, 135, 140, 150, 155],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ]
  }
};

export const studentStats = {
  totalCount: 3105,
  byGender: {
    labels: ['Nam', 'Nữ'],
    data: [1845, 1260],
  },
  byFaculty: {
    labels: ['Công nghệ thông tin', 'Kỹ thuật điện tử', 'Quản trị kinh doanh', 'Ngoại ngữ', 'Kinh tế', 'Cơ khí'],
    data: [820, 650, 540, 430, 380, 290],
  },
  enrollmentTrend: {
    labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
    data: [2500, 2650, 2780, 2900, 3020, 3105],
  },
  performanceDistribution: {
    labels: ['Xuất sắc', 'Giỏi', 'Khá', 'Trung bình', 'Yếu'],
    data: [310, 840, 1240, 620, 95],
  },
  // Detail data by faculty
  facultyDetails: {
    'Công nghệ thông tin': {
      labels: ['Năm 1', 'Năm 2', 'Năm 3', 'Năm 4', 'Năm 5'],
      data: [180, 175, 170, 165, 130]
    },
    'Kỹ thuật điện tử': {
      labels: ['Năm 1', 'Năm 2', 'Năm 3', 'Năm 4', 'Năm 5'],
      data: [140, 135, 130, 125, 120]
    },
    'Quản trị kinh doanh': {
      labels: ['Năm 1', 'Năm 2', 'Năm 3', 'Năm 4'],
      data: [145, 140, 135, 120]
    },
    'Ngoại ngữ': {
      labels: ['Năm 1', 'Năm 2', 'Năm 3', 'Năm 4'],
      data: [120, 110, 105, 95]
    },
    'Kinh tế': {
      labels: ['Năm 1', 'Năm 2', 'Năm 3', 'Năm 4'],
      data: [100, 95, 95, 90]
    },
    'Cơ khí': {
      labels: ['Năm 1', 'Năm 2', 'Năm 3', 'Năm 4', 'Năm 5'],
      data: [70, 65, 65, 50, 40]
    }
  },
  // Detail data by major
  majorDetails: {
    'Kỹ thuật phần mềm': {
      labels: ['Năm 1', 'Năm 2', 'Năm 3', 'Năm 4'],
      data: [65, 60, 55, 50]
    },
    'Trí tuệ nhân tạo': {
      labels: ['Năm 1', 'Năm 2', 'Năm 3', 'Năm 4'],
      data: [55, 50, 45, 40]
    },
    'Điện tử viễn thông': {
      labels: ['Năm 1', 'Năm 2', 'Năm 3', 'Năm 4', 'Năm 5'],
      data: [60, 55, 50, 45, 40]
    },
    'Quản trị kinh doanh': {
      labels: ['Năm 1', 'Năm 2', 'Năm 3', 'Năm 4'],
      data: [75, 70, 65, 60]
    },
    'Ngôn ngữ Anh': {
      labels: ['Năm 1', 'Năm 2', 'Năm 3', 'Năm 4'],
      data: [50, 45, 45, 40]
    },
    'Kế toán': {
      labels: ['Năm 1', 'Năm 2', 'Năm 3', 'Năm 4'],
      data: [45, 40, 40, 35]
    }
  }
};

export const classStats = {
  totalCount: 120,
  byFaculty: {
    labels: ['Công nghệ thông tin', 'Kỹ thuật điện tử', 'Quản trị kinh doanh', 'Ngoại ngữ', 'Kinh tế', 'Cơ khí'],
    data: [32, 24, 20, 18, 15, 11],
  },
  classSizes: {
    labels: ['<20', '20-30', '31-40', '41-50', '>50'],
    data: [15, 42, 35, 20, 8],
  },
  yearDistribution: {
    labels: ['Năm 1', 'Năm 2', 'Năm 3', 'Năm 4', 'Năm 5'],
    data: [32, 30, 28, 25, 5],
  },
  // Detail data by faculty
  facultyDetails: {
    'Công nghệ thông tin': {
      labels: ['<20', '20-30', '31-40', '41-50', '>50'],
      data: [4, 12, 10, 4, 2]
    },
    'Kỹ thuật điện tử': {
      labels: ['<20', '20-30', '31-40', '41-50', '>50'],
      data: [3, 10, 8, 2, 1]
    },
    'Quản trị kinh doanh': {
      labels: ['<20', '20-30', '31-40', '41-50', '>50'],
      data: [2, 8, 6, 3, 1]
    },
    'Ngoại ngữ': {
      labels: ['<20', '20-30', '31-40', '41-50', '>50'],
      data: [2, 6, 6, 3, 1]
    },
    'Kinh tế': {
      labels: ['<20', '20-30', '31-40', '41-50', '>50'],
      data: [2, 4, 5, 3, 1]
    },
    'Cơ khí': {
      labels: ['<20', '20-30', '31-40', '41-50', '>50'],
      data: [2, 2, 3, 3, 1]
    }
  },
  // Detail data by major
  majorDetails: {
    'Kỹ thuật phần mềm': {
      labels: ['<20', '20-30', '31-40', '41-50', '>50'],
      data: [2, 5, 4, 1, 1]
    },
    'Trí tuệ nhân tạo': {
      labels: ['<20', '20-30', '31-40', '41-50', '>50'],
      data: [1, 4, 3, 1, 0]
    },
    'Điện tử viễn thông': {
      labels: ['<20', '20-30', '31-40', '41-50', '>50'],
      data: [1, 5, 3, 1, 0]
    },
    'Quản trị kinh doanh': {
      labels: ['<20', '20-30', '31-40', '41-50', '>50'],
      data: [1, 4, 2, 1, 1]
    },
    'Ngôn ngữ Anh': {
      labels: ['<20', '20-30', '31-40', '41-50', '>50'],
      data: [1, 3, 3, 1, 0]
    },
    'Kế toán': {
      labels: ['<20', '20-30', '31-40', '41-50', '>50'],
      data: [1, 2, 2, 1, 0]
    }
  }
};

export const lecturerStats = {
  totalCount: 180,
  byGender: {
    labels: ['Nam', 'Nữ'],
    data: [105, 75],
  },
  byFaculty: {
    labels: ['Công nghệ thông tin', 'Kỹ thuật điện tử', 'Quản trị kinh doanh', 'Ngoại ngữ', 'Kinh tế', 'Cơ khí'],
    data: [38, 32, 30, 28, 26, 24],
  },
  // Detail data by faculty
  facultyDetails: {
    'Công nghệ thông tin': {
      labels: ['Giáo sư', 'Phó giáo sư', 'Tiến sĩ', 'Thạc sĩ', 'Cử nhân'],
      data: [2, 4, 12, 18, 2]
    },
    'Kỹ thuật điện tử': {
      labels: ['Giáo sư', 'Phó giáo sư', 'Tiến sĩ', 'Thạc sĩ', 'Cử nhân'],
      data: [1, 2, 10, 16, 3]
    },
    'Quản trị kinh doanh': {
      labels: ['Giáo sư', 'Phó giáo sư', 'Tiến sĩ', 'Thạc sĩ', 'Cử nhân'],
      data: [0, 1, 11, 15, 3]
    },
    'Ngoại ngữ': {
      labels: ['Giáo sư', 'Phó giáo sư', 'Tiến sĩ', 'Thạc sĩ', 'Cử nhân'],
      data: [0, 1, 9, 16, 2]
    },
    'Kinh tế': {
      labels: ['Giáo sư', 'Phó giáo sư', 'Tiến sĩ', 'Thạc sĩ', 'Cử nhân'],
      data: [1, 1, 8, 14, 2]
    },
    'Cơ khí': {
      labels: ['Giáo sư', 'Phó giáo sư', 'Tiến sĩ', 'Thạc sĩ', 'Cử nhân'],
      data: [1, 1, 7, 13, 2]
    }
  },
  // Detail data by major
  majorDetails: {
    'Kỹ thuật phần mềm': {
      labels: ['Giáo sư', 'Phó giáo sư', 'Tiến sĩ', 'Thạc sĩ', 'Cử nhân'],
      data: [1, 2, 5, 8, 1]
    },
    'Trí tuệ nhân tạo': {
      labels: ['Giáo sư', 'Phó giáo sư', 'Tiến sĩ', 'Thạc sĩ', 'Cử nhân'],
      data: [1, 1, 4, 6, 0]
    },
    'Điện tử viễn thông': {
      labels: ['Giáo sư', 'Phó giáo sư', 'Tiến sĩ', 'Thạc sĩ', 'Cử nhân'],
      data: [0, 1, 5, 8, 1]
    },
    'Quản trị kinh doanh': {
      labels: ['Giáo sư', 'Phó giáo sư', 'Tiến sĩ', 'Thạc sĩ', 'Cử nhân'],
      data: [0, 1, 6, 8, 1]
    },
    'Ngôn ngữ Anh': {
      labels: ['Giáo sư', 'Phó giáo sư', 'Tiến sĩ', 'Thạc sĩ', 'Cử nhân'],
      data: [0, 0, 5, 7, 1]
    },
    'Kế toán': {
      labels: ['Giáo sư', 'Phó giáo sư', 'Tiến sĩ', 'Thạc sĩ', 'Cử nhân'],
      data: [0, 1, 4, 6, 1]
    }
  },
  byDegree: {
    labels: ['Tiến sĩ', 'Thạc sĩ', 'Cử nhân', 'Giáo sư', 'Phó giáo sư'],
    data: [65, 85, 15, 5, 10],
  },
  experienceDistribution: {
    labels: ['<5 năm', '5-10 năm', '11-15 năm', '16-20 năm', '>20 năm'],
    data: [35, 60, 45, 28, 12],
  }
};

export const courseStats = {
  totalCount: 450,
  byFaculty: {
    labels: ['Công nghệ thông tin', 'Kỹ thuật điện tử', 'Quản trị kinh doanh', 'Ngoại ngữ', 'Kinh tế', 'Cơ khí'],
    data: [110, 85, 75, 70, 65, 45],
  },
  byStatus: {
    labels: ['Đang hoạt động', 'Tạm ngưng', 'Mới', 'Đã kết thúc'],
    data: [285, 60, 45, 60],
  },
  enrollmentByMonth: {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    datasets: [
      {
        label: 'Số sinh viên đăng ký',
        data: [380, 420, 500, 550, 600, 550, 400, 450, 650, 700, 600, 550],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      }
    ]
  }
};