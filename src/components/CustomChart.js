// MUI
import Alert from "@mui/material/Alert";
// Recharts
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
// Wordcloud
import ReactWordcloud from "react-wordcloud";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#BAC004",
  "#A904C0",
];

export const CustomAreaChart = ({ data, loading }) => {
  if (loading) return <></>;
  if (!loading && data.length === 0)
    return <Alert severity="info">Data Tidak Ditemukan</Alert>;
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="value" stroke="#82ca9d" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const CustomPieChart = ({ data, loading }) => {
  if (loading) return <></>;
  if (!loading && data.length === 0)
    return <Alert severity="info">Data Tidak Ditemukan</Alert>;
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart width={600} height={600}>
        <Pie
          dataKey="value"
          startAngle={360}
          endAngle={0}
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={(i) => {
            return `(${i.value}) ${i.label ? i.label : "unknown"}`;
          }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export const CustomBarChart = ({ data, loading }) => {
  if (loading) return <></>;
  if (!loading && data.length === 0)
    return <Alert severity="info">Data Tidak Ditemukan</Alert>;
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis
          dataKey="label"
          scale="point"
          padding={{ left: 10, right: 10 }}
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <CartesianGrid strokeDasharray="3 3" />
        <Bar dataKey="value" fill="#FFBB28" background={{ fill: "#eee" }} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const CustomWordCloud = ({ data, loading }) => {
  if (loading) return <></>;
  if (!loading && data.length === 0)
    return <Alert severity="info">Data Tidak Ditemukan</Alert>;
  return <ReactWordcloud words={data} options={{ fontSizes: [8, 40] }} />;
};
