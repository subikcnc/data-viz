import {useEffect, useMemo, useRef, useState} from 'react'
import data from './data.json';
import lineData from './lineData.json';
import draw from './draw';
import { axisBottom, axisLeft, axisRight, select, svg, timeFormat } from 'd3';

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
const BasicBarLineChart = ({width=960, height=650, margin}: BasicBarChartProps) => {
  // State to store bars
  const [bars, setBars] = useState<IBarStateTypes[]>([]);
  const [paths, setPaths] = useState<{ path: string | null; fill: string }[]>([]);
  const xScaleRef = useRef()
  const yScaleLineRef = useRef();
  const yScaleRef = useRef()
  // Get the SVG ref using useRef
  const svgRef = useRef(null);
  // 1 First lets modify the data to convert dataKey string to Dates
  const parsedData = useMemo(() => {
    return data.map(d => ({ ...d, dataKey: new Date(d.dataKey) }));
  }, []);

  console.log('parsed bar line data', parsedData);

  // 2 Call the function to draw chart in a side effect
  useEffect(() => {
    if(svgRef.current){
      const SVG = select(svgRef.current);
      const [updatedbars, updatedpaths] = draw({SVG,parsedData, width, height, margin, xScaleRef, yScaleRef, yScaleLineRef})
      setBars(updatedbars)
      setPaths(updatedpaths)
    }
    
     // The above is used to remove the vertical bar in the axis
  },[width, height, margin, parsedData])

  useEffect(() => {
    if(!bars.length) return
    const formatTime = timeFormat("%d %b %Y");
    select('.bar-line-chart-basic .yAxis').call(axisLeft(yScaleRef.current).ticks(5))
    select('.bar-line-chart-basic .yAxis-line').call(axisRight(yScaleLineRef.current).ticks(8))
    select('.bar-line-chart-basic .xAxis').call(axisBottom(xScaleRef.current).ticks(parsedData.length-1).tickFormat(formatTime))

  },[bars, parsedData])
  return (
    <svg ref={svgRef} width={width} height={height} viewBox={`0 0 ${width} ${height}`} className='bar-line-chart-basic'>
      {/* {parsedData.map(d => {
        return <g key={d.dataKey.toString()} className="bar-group"><rect></rect></g>
      })} */}
      {bars.map((b,i) => (
        <g key={i}>
          <rect x={b.x} y={b.y} width={b.width} height={b.height} fill={b.fill}></rect>
          <text textAnchor='middle' alignmentBaseline='middle' dominantBaseline={'middle'} x={b.x+b.width/2} y={b.y + 20} fill='#fff'>{b.text}</text>
        </g>
      ))}
      {paths.map(p => {
            return <path key={p.fill} fill="none" stroke={p.fill} strokeWidth="2" d={p.path}></path>
        })}
      <g className="yAxis-line" transform={`translate(${width - margin.right}, 0)`} />
      <g className="xAxis" transform={`translate(0, ${height - margin.bottom})`} />
      <g className="yAxis" transform={`translate(${margin.left}, 0)`} />
      <text fill="papayawhip" x={margin.left} y={height}>X-axis scale</text>
      <text fill="papayawhip" x={0} transform={`translate(${14}, ${margin.top + height/2}) rotate(-90)`}>Bar Y-axis</text>
      <text fill="papayawhip" x={0} transform={`translate(${width-margin.right-20}, ${margin.top+100}) rotate(-90)`}>Line Y-axis</text>
    </svg>
  )
}

export default BasicBarLineChart