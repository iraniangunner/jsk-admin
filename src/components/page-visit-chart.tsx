"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type LineRow = { date: string; [page: string]: number | string };
type PieRow = { page: string; total: number };

export function VisitsCharts() {
  const [lineData, setLineData] = useState<LineRow[]>([]);
  const [pieData, setPieData] = useState<PieRow[]>([]);
  const [pages, setPages] = useState<string[]>([]);

  const colors = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00c49f",
    "#ff6666", "#a83279", "#8a2be2", "#ff1493", "#00bfff",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get<{ line: LineRow[]; pie: Record<string, PieRow> }>(
          "https://jsk-co.com/api/visits/chart"
        );

        // --- LineChart Top 10 Pages ---
        const lineRaw = res.data.line.map((row) => {
          const newRow: LineRow = { date: row.date };
          Object.keys(row).forEach((k) => {
            if (k !== "date") newRow[k] = Number(row[k]) || 0;
          });
          return newRow;
        });

        // مجموع بازدید هر صفحه
        const pageTotals: Record<string, number> = {};
        lineRaw.forEach((row) => {
          Object.keys(row).forEach((k) => {
            if (k !== "date") pageTotals[k] = (pageTotals[k] || 0) + Number(row[k]);
          });
        });

        const topPages = Object.entries(pageTotals)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([page]) => page);

        const line = lineRaw.map((row) => {
          const newRow: LineRow = { date: row.date };
          topPages.forEach((p) => {
            newRow[p] = row[p] || 0;
          });
          return newRow;
        });

        // --- PieChart با slice "سایر" ---
        const pieAll: PieRow[] = Object.values(res.data.pie)
          .map((p) => ({ page: p.page, total: Number(p.total) || 0 }));

        const pieTop = pieAll.sort((a, b) => b.total - a.total).slice(0, 10);
        const pieOtherTotal = pieAll.slice(10).reduce((acc, cur) => acc + cur.total, 0);
        if (pieOtherTotal > 0) pieTop.push({ page: "سایر", total: pieOtherTotal });

        setLineData(line);
        setPieData(pieTop);
        setPages(topPages);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // Legend دو ستونه
  const Legend = ({ items }: { items: string[] }) => {
    const half = Math.ceil(items.length / 2);
    const col1 = items.slice(0, half);
    const col2 = items.slice(half);

    return (
      <div style={{ display: "flex", gap: 24, marginBottom: 12 }}>
        {[col1, col2].map((col, colIdx) => (
          <div key={colIdx}>
            {col.map((item, idx) => (
              <div key={item} style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: colors[idx % colors.length],
                    marginRight: 8,
                    borderRadius: 3,
                  }}
                />
                <span style={{ fontSize: 12 }}>{item}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md space-y-8">
      <h2 className="text-xl font-bold">📊 آمار بازدید صفحات</h2>

      {/* Legend LineChart */}
      <Legend items={pages} />

      {/* LineChart */}
      <div style={{ height: 300, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, "auto"]} />
            <Tooltip />
            {pages.map((page, idx) => (
              <Line
                key={page}
                type="monotone"
                dataKey={page}
                stroke={colors[idx % colors.length]}
                dot={{ r: 3 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend PieChart */}
      <Legend items={pieData.map((p) => p.page)} />

      {/* PieChart */}
      <div style={{ height: 300, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pieData} dataKey="total" nameKey="page" outerRadius={100} label>
              {pieData.map((entry, idx) => (
                <Cell key={entry.page} fill={colors[idx % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
