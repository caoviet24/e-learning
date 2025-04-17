

export default function convertTimeVN(date: Date | string) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        // hour: '2-digit',
        // minute: '2-digit',
        // second: '2-digit',
        timeZone: 'Asia/Ho_Chi_Minh',
    };
    return new Intl.DateTimeFormat('vi-VN', options).format(dateObj);
}