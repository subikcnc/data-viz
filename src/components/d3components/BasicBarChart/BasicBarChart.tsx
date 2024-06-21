import {useEffect, useMemo, useRef, useState} from 'react'
import data from './data.json';
import draw from './draw';
import { axisBottom, axisLeft, select, timeFormat } from 'd3';

interface IBarStateTypes {
  x: number;
  y: number;
  height: number;
  width: number;
  fill: string;
  text: string;
}

interface BasicBarChartProps{
  width?: number;
  height?: number;
  margin: {top: number; right: number; bottom: number; left: number}
}
const BasicBarChart = ({width=960, height=650, margin}: BasicBarChartProps) => {
  // State to store bars
  const [bars, setBars] = useState<IBarStateTypes[]>([]);
  const xScaleRef = useRef()
  const yScaleRef = useRef()
  // Get the SVG ref using useRef
  const svgRef = useRef<SVGSVGElement | null>(null);
  // 1 First lets modify the data to convert dataKey string to Dates
  const parsedData = useMemo(() => {
    return data.map(d => ({ ...d, dataKey: new Date(d.dataKey) }));
  }, []);

  // 2 Call the function to draw chart in a side effect
  useEffect(() => {
    if(svgRef.current){
      const SVG = select(svgRef.current);
      const updatedbars = draw({SVG,parsedData, width, height, margin, xScaleRef, yScaleRef})
      setBars(updatedbars)
    }
    
     // The above is used to remove the vertical bar in the axis
  },[width, height, margin, parsedData])

  useEffect(() => {
    if(!bars.length) return
    const formatTime = timeFormat("%d %b %Y");
    select('.bar-chart-basic .yAxis').transition().duration(250).call(axisLeft(yScaleRef.current).ticks(10))
    select('.bar-chart-basic .xAxis').transition().duration(250).call(axisBottom(xScaleRef.current).tickFormat(formatTime))
  },[bars, parsedData])
  return (
    <svg ref={svgRef} width={width} height={height} viewBox={`0 0 ${width} ${height}`} className='bar-chart-basic'>
      {/* {parsedData.map(d => {
        return <g key={d.dataKey.toString()} className="bar-group"><rect></rect></g>
      })} */}
      {bars.map((b,i) => (
        <g key={i}>
          <rect x={b.x} y={b.y} width={b.width} height={b.height} fill={b.fill}></rect>
          <text textAnchor='middle' alignmentBaseline='middle' dominantBaseline={'middle'} x={b.x+b.width/2} y={b.y + 20} fill='#fff'>{b.text}</text>
        </g>
      ))}
      <g className="xAxis" transform={`translate(0, ${height - margin.bottom})`} />
      <g className="yAxis" transform={`translate(${margin.left}, 0)`} />
    </svg>
  )
}

export default BasicBarChart