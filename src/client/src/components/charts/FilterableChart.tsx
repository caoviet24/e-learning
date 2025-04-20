'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BarChart from './BarChart';
import PieChart from './PieChart';
import { facultyStats, majorStats } from '@/content/stats-data';

export type ChartType = 'bar' | 'pie';

interface FilterableChartProps {
  title: string;
  chartType: ChartType;
  entityType: 'lecturers' | 'students' | 'classes';
  defaultData: {
    labels: string[];
    data: number[];
    backgroundColor?: string[];
  };
  facultyData: Record<string, { labels: string[]; data: number[] }>;
  majorData?: Record<string, { labels: string[]; data: number[] }>;
}

const FilterableChart: React.FC<FilterableChartProps> = ({
  title,
  chartType,
  entityType,
  defaultData,
  facultyData,
  majorData
}) => {
  type FilterType = 'all' | 'faculty' | 'major';
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [selectedMajor, setSelectedMajor] = useState<string | null>(null);
  const [currentData, setCurrentData] = useState({
    labels: defaultData.labels,
    data: defaultData.data,
    backgroundColor: defaultData.backgroundColor,
  });

  // Reset selections when filter type changes
  useEffect(() => {
    if (filterType === 'all') {
      setSelectedFaculty(null);
      setSelectedMajor(null);
      setCurrentData({
        labels: defaultData.labels,
        data: defaultData.data,
        backgroundColor: defaultData.backgroundColor,
      });
    } else if (filterType === 'faculty') {
      setSelectedMajor(null);
    } else if (filterType === 'major') {
      // Keep faculty selection as it's needed for filtering majors
    }
  }, [filterType, defaultData]);

  // Update data when faculty selection changes
  useEffect(() => {
    if (filterType === 'faculty' && selectedFaculty) {
      if (facultyData[selectedFaculty]) {
        setCurrentData({
          labels: facultyData[selectedFaculty].labels,
          data: facultyData[selectedFaculty].data,
          backgroundColor: defaultData.backgroundColor,
        });
      }
    }
  }, [selectedFaculty, facultyData, filterType, defaultData.backgroundColor]);

  // Update data when major selection changes
  useEffect(() => {
    if (filterType === 'major' && selectedMajor && majorData) {
      if (majorData[selectedMajor]) {
        setCurrentData({
          labels: majorData[selectedMajor].labels,
          data: majorData[selectedMajor].data,
          backgroundColor: defaultData.backgroundColor,
        });
      }
    }
  }, [selectedMajor, majorData, filterType, defaultData.backgroundColor]);

  // Get available faculties
  const faculties = facultyStats.byDepartment.labels;

  // Get available majors based on selected faculty
  const availableMajors = selectedFaculty ? 
    majorStats.byFaculty.labels.filter((_, index) => 
      // Simulate getting majors for a specific faculty
      index % 2 === 0 || index % 3 === 0
    ) : 
    majorStats.byFaculty.labels;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <div className="flex flex-col md:flex-row gap-2">
            <Select
              value={filterType}
              onValueChange={(value) => setFilterType(value as FilterType)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="faculty">Theo khoa</SelectItem>
                <SelectItem value="major">Theo ngành</SelectItem>
              </SelectContent>
            </Select>

            {filterType === 'faculty' && (
              <Select
                value={selectedFaculty || ""}
                onValueChange={setSelectedFaculty}
                disabled={filterType !== 'faculty'}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Chọn khoa" />
                </SelectTrigger>
                <SelectContent>
                  {faculties.map(faculty => (
                    <SelectItem key={faculty} value={faculty}>
                      {faculty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {filterType === 'major' && (
              <>
                <Select
                  value={selectedFaculty || ""}
                  onValueChange={setSelectedFaculty}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Chọn khoa" />
                  </SelectTrigger>
                  <SelectContent>
                    {faculties.map(faculty => (
                      <SelectItem key={faculty} value={faculty}>
                        {faculty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedMajor || ""}
                  onValueChange={setSelectedMajor}
                  disabled={!selectedFaculty}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Chọn ngành" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMajors.map(major => (
                      <SelectItem key={major} value={major}>
                        {major}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
        </div>

        <div className="h-80">
          {chartType === 'bar' ? (
            <BarChart
              title=""
              labels={currentData.labels}
              datasets={[
                {
                  label: entityType === 'lecturers' ? 'Giảng viên' : 
                         entityType === 'students' ? 'Sinh viên' : 'Lớp học',
                  data: currentData.data,
                  backgroundColor: entityType === 'lecturers' ? 'rgba(153, 102, 255, 0.6)' : 
                                 entityType === 'students' ? 'rgba(54, 162, 235, 0.6)' : 
                                 'rgba(75, 192, 192, 0.6)',
                }
              ]}
            />
          ) : (
            <PieChart
              title=""
              labels={currentData.labels}
              data={currentData.data}
              backgroundColor={currentData.backgroundColor}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterableChart;