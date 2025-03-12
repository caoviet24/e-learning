'use client';
import React, { SelectHTMLAttributes, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { boMon, giangVien, Khoa, myCourses, Nganh } from '@/content/data';

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

    useEffect(() => {
        console.log(searchOptions);
        console.log(options);
    }, [options, searchOptions]);

    return (
        <main className="px-5">
            <div className="mx-auto">
                <div>
                    <h2 className="text-2xl font-semibold mb-2">Xin chào bạn !</h2>
                    <p className="text-muted-foreground">Tiếp tục với quá trình học tập ngay cả khi bạn rời đi.</p>
                </div>

                <div className="flex flex-wrap gap-2 py-4">
                    <Select
                        value={searchOptions.khoa_id || undefined}
                        onValueChange={(value) => handleChangeSearchOption('khoa_id', value )}
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
                        onValueChange={(value) => handleChangeSearchOption('nganh_id', value)}
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
                        onValueChange={(value) => handleChangeSearchOption('giang_vien_id', value)}
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
                        onValueChange={(value) => handleChangeSearchOption('bo_mon_id', value)}
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
                    {myCourses.map((course, index) => (
                        <Link key={index} href={`/courses/${index + 1}`} className="block">
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
                                <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
                                <div className="flex items-center justify-between">
                                    <div className="w-full max-w-[120px] h-1.5 rounded-full bg-slate-800">
                                        <div
                                            className="h-full bg-purple-500 rounded-full"
                                            style={{ width: `${course.progress}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-muted-foreground">{course.progress}%</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
