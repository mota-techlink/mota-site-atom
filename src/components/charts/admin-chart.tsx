"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts"

interface AdminChartProps {
  data: { name: string; revenue: number; orders: number; users: number }[]
  formatCurrency: (value: number) => string
}

export function AdminChart({ data, formatCurrency }: AdminChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          formatter={(value) => {
            if (typeof value === "number" && value > 1000) {
              return formatCurrency(value);
            }
            return value;
          }}
        />
        <Legend />
        <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
        <Bar dataKey="orders" fill="#3b82f6" name="Orders" />
      </BarChart>
    </ResponsiveContainer>
  )
}
