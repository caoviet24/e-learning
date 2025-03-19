'use client';
import React, { SelectHTMLAttributes, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CourseCard } from '@/components/course-card';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { boMon, courses, giangVien, Khoa, myCourses, Nganh } from '@/content/data';

type OptionsType = {
    khoa: typeof Khoa;
    nganh: typeof Nganh;
    giangVien: typeof giangVien;
    boMon: typeof boMon;
};

export default function Home() {
    const [options, setOptions] = useState<OptionsType | undefined>(undefined);
    useEffect(() => {
        setOptions({
            khoa: Khoa,
            nganh: Nganh,
            giangVien: giangVien,
            boMon: boMon,
        });
    }, []);

    const [searchOptions, setSearchOptions] = useState({
        khoa_id: '',
        nganh_id: '',
        giang_vien_id: '',
        bo_mon_id: '',
    });

    const handleChangeSearchOption = (name: string, value: string) => {
        setSearchOptions((prev) => {
            let updatedOptions = { ...prev, [name]: value };

            if (name === 'khoa_id') {
                updatedOptions = {
                    ...updatedOptions,
                    nganh_id: '',
                    giang_vien_id: '',
                    bo_mon_id: '',
                };

                setOptions({
                    khoa: Khoa,
                    nganh: Nganh.filter((item) => item.khoaId === Number(value)),
                    giangVien: giangVien.filter((item) => item.khoaId === Number(value)),
                    boMon: boMon.filter((item) => item.khoaId === Number(value)),
                });
            }

            return updatedOptions;
        });
    };

    return (
        <main className="container relative py-6">
            <div className="mx-auto">
                <div>
                    <h2 className="text-2xl font-semibold mb-2">Xin chào bạn !</h2>
                    <p className="text-muted-foreground">Tiếp tục với quá trình học tập ngay cả khi bạn rời đi.</p>
                </div>

                <div className="flex flex-wrap gap-2 py-4">
                    <Select
                        value={searchOptions.khoa_id || undefined}
                        onValueChange={(value: any) => handleChangeSearchOption('khoa_id', value )}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Khoa" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {options?.khoa.map((item, index) => (
                                    <SelectItem key={index} value={String(item.id)}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Select
                        value={searchOptions.nganh_id || undefined}
                        onValueChange={(value : any) => handleChangeSearchOption('nganh_id', value)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Chuyên ngành" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {options?.nganh.map((item, index) => (
                                    <SelectItem key={index} value={String(item.id)}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Select
                        value={searchOptions.giang_vien_id || undefined}
                        onValueChange={(value : any) => handleChangeSearchOption('giang_vien_id', value)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Giảng viên" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {options?.giangVien.map((item, index) => (
                                    <SelectItem key={index} value={String(item.id)}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Select
                        value={searchOptions.bo_mon_id || undefined}
                        onValueChange={(value : any) => handleChangeSearchOption('bo_mon_id', value)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Bộ môn" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {options?.boMon.map((item, index) => (
                                    <SelectItem key={index} value={String(item.id)}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {courses.map((course, index) => (
                        <Link key={index} href={`/student/courses/${course.id}`}>
                            <CourseCard {...course} />
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
