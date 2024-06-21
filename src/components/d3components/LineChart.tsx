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

type D3LineChartProps = {
    data: Datum[];
  };

const D3LineChart = ({ data }: D3LineChartProps) => {
  const [paths, setPaths] = useState<{ path: string | null; fill: string }[]>([]);
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; content: string }>({ visible: false, x: 0, y: 0, content: '' });
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    // console.log('running effect with data', data);
    if (!data) return;

    // Convert dates from strings to Date objects
    const parsedData = data.map(d => ({ ...d, date: new Date(d.date) })).slice(0,40);

     // Get the min and max of temperatures, yExtent
     const highMax = d3.max(parsedData, d => d.high) as number;
     const lowMin = d3.min(parsedData, d => d.low) as number;
     console.log('high max and low min', highMax, lowMin);
     // const [min, max] = d3.extent(data, d => d.high)

     // Get the xExtent
     const extent = d3.extent(parsedData, d => d.date) as [Date, Date]

     // Creating the scales
     const xScale = d3.scaleTime().domain(extent).range([margin.left, width - margin.right])
     const yScale = d3.scaleLinear().domain([lowMin, highMax]).range([height,0])

     // Creating two line generators
     // return xScale(d.date)} This means for each of the dates, translate that to an x value
     // var highLine = d3.line()
     //               .x((d) => {return xScale(d.date)})
     //               .y((d) => {return yScale(d.high)})
     // var lowLine = d3.line()
     //                 .x((d) => {return xScale(d.date)})
     //                 .y((d) => {return yScale(d.low)})
     // return [
     //   {path: highLine(data), fill: 'red'},
     //   {path: lowLine(data), fill: 'blue'}
     // ]

     // Instead of creating two line generators for the high and low lines, we can do as below
     const line = d3.line().x(d => xScale(d.date)).curve(d3.curveCardinal); 

     const linePaths = [
        {path: line.y(d => yScale(d.high))(parsedData), fill: '#dc2626'},
        {path: line.y(d => yScale(d.low))(parsedData), fill: '#38bdf8'},
     ]

     if(svgRef.current){
       d3.select(svgRef.current).append('g')
       .call(d3.axisLeft(yScale).ticks(5))
       .attr('transform', `translate(${margin.left}, 0)`)

       d3.select(svgRef.current).append('g')
        .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b")))
        .attr('transform', `translate(0, ${height-margin.bottom})`)

      // Adding data points to the line chart
      d3.select(svgRef.current).selectAll('.data-point-high')
      .data(parsedData)
      .enter()
      .append('circle')
      .attr('class', 'data-point-high')
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.high))
      .attr('r', 5)
      .attr('fill', '#dc2626')
      .on('mouseover', (event, d) => {
        setTooltip({
          visible: true,
          x: event.pageX,
          y: event.pageY,
          content: yScale(d.high)
        })
      })
      .on("mouseout", () => {
        setTimeout(() => {
          setTooltip({ ...tooltip, visible: false });
        }, 500)
      });
 
      d3.select(svgRef.current).selectAll('.data-point-low')
      .data(parsedData)
      .enter()
      .append('circle')
      .attr('class', 'data-point-low')
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.low))
      .attr('r', 5)
      .attr('fill', '#38bdf8');
     }

     
     setPaths(linePaths)
     
    
  }, [data]);

  return (
    <>
    <h1>Line chart</h1>
    <svg ref={svgRef} width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {paths.map(p => {
            return <path key={p.fill} fill="none" stroke={p.fill} strokeWidth="2" d={p.path}></path>
        })}
    </svg>
    {tooltip.visible && (
        <div style={{
          position: 'absolute',
          top: tooltip.y + 10,
          left: tooltip.x + 10,
          background: 'papayawhip',
          padding: '5px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          pointerEvents: 'none',
          color: '#000'
        }}
          dangerouslySetInnerHTML={{ __html: tooltip.content }}
        />
      )}
    </>
  );
};

export default D3LineChart;
