import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

const width = 1200;
const height = 650;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };

interface Datum {
    date: string;
    high: number;
    low: number;
    avg: number;
  }

type D3BarChartProps = {
    data: Datum[];
  };

const D3BarChart = ({ data }: D3BarChartProps) => {
  const [bars, setBars] = useState([]);
  const xScaleRef = useRef();
  const yScaleRef = useRef();

  useEffect(() => {
    if (!data) return;

    // Convert dates from strings to Date objects
    const parsedData = data.map(d => ({ ...d, date: new Date(d.date) }));

    // 1. Map date to x position
    const extent = d3.extent(parsedData, (d) => new Date(d.date)) as [Date, Date];
    const xScale = d3.scaleTime().domain(extent).range([margin.left, width-margin.right]);

    // 2. Map temperature to y position
    const [min, max] = d3.extent(parsedData, (d) => d.high);
    const yScale = d3
      .scaleLinear()
      .domain([Math.min(min, 0), max])
      .range([height - margin.bottom, margin.top]);

    // 3. Map avg temp to color
    const colorExtent = d3.extent(parsedData, (d) => d.avg).reverse();
    const colorScale = d3
      .scaleSequential()
      .domain(colorExtent)
      .interpolator(d3.interpolateRdYlBu);

    // Create array of objects: x, y, height
    const updatedBars = parsedData.map((d) => ({
      x: xScale(new Date(d.date)),
      y: yScale(d.high),
      height: yScale(d.low) - yScale(d.high),
      fill: colorScale(d.avg),
    }));

    console.log('these are the updated bars', updatedBars);

    setBars(updatedBars);
    xScaleRef.current = xScale;
    yScaleRef.current = yScale;
  }, [data]);

  useEffect(() => {
    if (!bars.length) return;

    d3.select(".barChart .xAxis").call(d3.axisBottom(xScaleRef.current).tickFormat(d3.timeFormat("%b")));
    d3.select(".barChart .yAxis").call(d3.axisLeft(yScaleRef.current).tickFormat(d => `${d}℉`));
  }, [bars]);

  return (
    <>
    <h1>Bar chart</h1>
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className='barChart'>
      {bars.map((d, i) => (
        <rect key={i} x={d.x} y={d.y} width={2} height={d.height} fill={d.fill} />
      ))}
      <g className="xAxis" transform={`translate(0, ${height - margin.bottom})`} />
      <g className="yAxis" transform={`translate(${margin.left}, 0)`} />
    </svg>
    </>
  );
};

export default D3BarChart;
