import { useEffect, useRef, useState, useMemo } from "react";
import * as echarts from "echarts";

type DataItem = {
  city: string;
  fuel: string;
  year: number;
  month: number;
  rsp: number;
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function App() {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState<DataItem[]>([]);

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // parsing the the csv files
  useEffect(() => {
    fetch("/dataset.csv")
      .then((res) => res.text())
      .then((text) => {
        const rows = text.trim().split("\n");

        const parsed: DataItem[] = rows
          .slice(1)
          .map((row) => {
            const cols = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);

            if (!cols || cols.length < 7) return null;

            const calendarDate = cols[3].replace(/"/g, "").trim();
            const dateObj = new Date(calendarDate);

            return {
              city: cols[5].replace(/"/g, "").trim(),
              fuel: cols[4].replace(/"/g, "").trim(),
              year: dateObj.getFullYear(),
              month: dateObj.getMonth() + 1,
              rsp: cols[6] ? Number(cols[6].replace(/"/g, "").trim()) : 0,
            };
          })
          .filter(Boolean) as DataItem[];

        console.log(parsed);
        setData(parsed);

        if (parsed.length > 0) {
          setSelectedCity(parsed[0].city);
          setSelectedFuel(parsed[0].fuel);
          setSelectedYear(parsed[0].year);
        }
      });
  }, []);

  //  Unique Dropdown values using set
  const cities = useMemo(() => [...new Set(data.map((d) => d.city))], [data]);

  const fuels = useMemo(() => [...new Set(data.map((d) => d.fuel))], [data]);

  const years = useMemo(
    () => [...new Set(data.map((d) => d.year))].sort(),
    [data],
  );

  // Monthly Average Function --------
  const monthlyAverage = useMemo(() => {
    if (!selectedCity || !selectedFuel || selectedYear === null) return [];

    const totals = new Array(12).fill(0);
    const counts = new Array(12).fill(0);

    data.forEach((item) => {
      if (
        item.city === selectedCity &&
        item.fuel === selectedFuel &&
        item.year === selectedYear
      ) {
        const idx = item.month - 1;
        totals[idx] += item.rsp;
        counts[idx]++;
      }
    });

    return totals.map((t, i) =>
      counts[i] === 0 ? 0 : +(t / counts[i]).toFixed(2),
    );
  }, [data, selectedCity, selectedFuel, selectedYear]);

  // -------- Chart --------
  useEffect(() => {
    if (!chartRef.current || monthlyAverage.length === 0) return;

    const chart = echarts.init(chartRef.current);

    chart.setOption({
      title: {
        text: `Monthly Avg RSP - ${selectedCity} (${selectedFuel}, ${selectedYear})`,
        left: "center",
      },
      tooltip: {},
      xAxis: {
        type: "category",
        data: MONTHS,
      },
      yAxis: {
        type: "value",
        name: "RSP (INR/L)",
      },
      series: [
        {
          type: "bar",
          data: monthlyAverage,
        },
      ],
    });

    return () => {
      chart.dispose();
    };
  }, [monthlyAverage, selectedCity, selectedFuel, selectedYear]);

  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif", position:'relative' }}>
      <h2>Retail Selling Price Dashboard</h2>
      <span style={{position:'absolute', top:'2rem', left:'50rem', fontWeight:900}}>Check for year: 2021, 2020 for better graphs</span>
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <select
          value={selectedFuel}
          onChange={(e) => setSelectedFuel(e.target.value)}
        >
          {fuels.map((fuel) => (
            <option key={fuel} value={fuel}>
              {fuel}
            </option>
          ))}
        </select>

        <select
          value={selectedYear ?? ""}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div ref={chartRef} style={{ width: "100%", height: "500px" }} />
    </div>
  );
}
