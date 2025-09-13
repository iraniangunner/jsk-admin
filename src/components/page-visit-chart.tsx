"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type LineRow = {
  date: string;
  [page: string]: number | string;
};

type PieRow = {
  page: string;
  total: number;
};

export  function VisitsCharts() {
  const [lineData, setLineData] = useState<LineRow[]>([]);
  const [pieData, setPieData] = useState<PieRow[]>([]);
  const [pages, setPages] = useState<string[]>([]);

  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#00c49f",
    "#ff6666",
    "#a83279",
  ];

  const fetchData = async () => {
    try {
      const res = await axios.get<{ line: LineRow[]; pie: PieRow[] }>(
        "https://jsk-co.com/api/visits/chart"
      );

      let line = res.data.line || [];
      let pie = res.data.pie || [];

      const allPages = Array.from(
        new Set(
          line.flatMap((row) => Object.keys(row).filter((k) => k !== "date"))
        )
      );

      line = line.map((row) => {
        const newRow: LineRow = { date: row.date };
        allPages.forEach((p) => {
          newRow[p] = row[p] ? Number(row[p]) : 0; // 👈 همیشه عدد
        });
        return newRow;
      });

      pie = pie
        .filter((p) => allPages.includes(p.page))
        .map((p) => ({ page: p.page, total: Number(p.total) }));

      setLineData(line);
      setPieData(pie);
      setPages(allPages);
    } catch (err) {
      console.error("Error fetching visits data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md space-y-8">
      <h2 className="text-xl font-bold">📊 آمار بازدید صفحات</h2>

      {/* نمودار خطی */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {pages.map((page, idx) => (
            <Line
              key={page}
              type="monotone"
              dataKey={page}
              stroke={colors[idx % colors.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* نمودار دایره‌ای */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="total"
            nameKey="page"
            outerRadius={100}
            label
          >
            {pieData.map((entry, idx) => (
              <Cell key={entry.page} fill={colors[idx % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
