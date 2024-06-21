import { extent, scaleLinear, scaleTime, curveCardinal, max, min, line, scaleBand, Selection } from "d3";

// interface IBarStateTypes {
//     x: number;
//     y: number;
//     height: number;
//     fill: string;
//   }
interface DrawChartParams {
    SVG: Selection<SVGSVGElement, unknown, HTMLElement, any>;
    data: {dataKey: Date; dataValue: number, dataLineValue: number}[];
    width: number;
    height: number;
    margin: {top: number; right: number; bottom: number; left: number}
    parsedData: {dataKey: Date, dataValue: number, dataLineValue: number}[];
    xScaleRef: React.MutableRefObject<any>;
    yScaleRef: React.MutableRefObject<any>;
    yScaleLineRef: React.MutableRefObject<any>;
    // bars: IBarStateTypes[],
    // setBars: React.Dispatch<React.SetStateAction<IBarStateTypes[]>>
}
export default function draw({SVG,parsedData,width, height, margin, xScaleRef, yScaleRef, yScaleLineRef}: DrawChartParams) {
    console.log('daata', parsedData);
    // Calculate extent for line chart
    const highMaxLine = max(parsedData, d => d.dataLineValue) as number;
    const lowMinLine = min(parsedData, d => d.dataLineValue) as number;

    // Calculate extent for bar chart
    const xExtent = extent(parsedData, d => d.dataKey) as [Date, Date];
    const yExtent = extent(parsedData, d => d.dataValue) as [number, number];

    // Creating the scales for Bar chart
    const xScale = scaleTime().domain([xExtent[0], xExtent[1]]).range([margin.left, width-margin.right])
    const yScale = scaleLinear().domain([Math.min(0, yExtent[0]), yExtent[1]]).range([height-margin.bottom, (height-margin.bottom)/2])
    const xScaleBand = scaleBand().domain(parsedData.map(d => d.dataKey.toString())).range([margin.left, width-margin.right]).padding(0)

    // Creating the scales for Line chart, only y scale is needed
    const yScaleLine  = scaleLinear().domain([Math.min(0, lowMinLine), highMaxLine]).range([height-margin.bottom, margin.bottom])

    // const barWidth = ((width-margin.left-margin.right) / parsedData.length);
    const barWidth = ((width) / parsedData.length);
    console.log('this is the bar width', barWidth, width, parsedData.length, margin.left, margin.right);

    // Creating the line generator for the line chart
    const lineGenerator = line<{dataKey: Date; dataLineValue: number}>().x(d => xScale(d.dataKey)).y(d => yScaleLine(d.dataLineValue)).curve(curveCardinal);
    const linePaths = [
        {path: lineGenerator(parsedData), fill: '#fff'},
    ]

    const updatedBars = parsedData.map((d, i) => ({
        // x: margin.left + i * barWidth, // Adjusting x position to center the bar
        x: xScale(d.dataKey) - xScaleBand.bandwidth()/1.4,
        y: yScale(d.dataValue),
        height: height - margin.bottom - yScale(d.dataValue),
        width: xScaleBand.bandwidth(),
        fill: 'rebeccapurple',
        text: d.dataValue
    }));

    // Adding axes
    // SVG.append('g')
    // .attr('transform', `translate(${margin.left}, 0)`)
    // .call(axisLeft(yScale).ticks(3))

    // Define the time format for the x-axis ticks
    // const formatTime = timeFormat("%d %b %Y");

    // Adding x-axis
    // SVG.append('g')
    //     .attr('transform', `translate(0, ${height - margin.bottom})`)
    //     .call(axisBottom(xScale).ticks(parsedData.length-1).tickFormat(formatTime));
    xScaleRef.current = xScale
    yScaleRef.current = yScale
    yScaleLineRef.current = yScaleLine
    return [updatedBars, linePaths]
}