import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {data, sunshine} from './constants'
import D3BarChart from './components/d3components/BarChart'
import D3LineChart from './components/d3components/LineChart'
import ChartBar from './components/d3components/Chart'
import Circles from './components/d3components/Circles'
import CirclesGapMinder from './components/d3components/gapMinder/Circles'
import gapData from './components/d3components/gapMinder/gapminder_data.json'
import {scaleOrdinal, ScaleOrdinal} from 'd3-scale'
import { schemeTableau10 } from 'd3-scale-chromatic'
import PieChart from './components/d3components/Pie/PieChart'

// Dummy data for chart


function App() {
   const [selectedYear, setSelectedYear] = useState({ x: 1957 })
   const [selectedContinent, setSelectedContinent] = useState<string>('all')

   const handleSliderChange = ({ x }) => {
    setSelectedYear((state) => ({ ...state, x }))
  }

  const handleLegendClick = function(continent: string) {
    setSelectedContinent((prevState) => prevState === continent ? "all" : continent)
    console.log('selected continent', continent);
  }

  const continents = [...new Set(gapData.map(d => d.continent))]
  const color:ScaleOrdinal<string,string> = scaleOrdinal<string,string>().domain(continents).range(schemeTableau10)

  console.log('continent', continents);

  // Data for chart
  const sunshineData = sunshine.map((d) => {
    return {city: d.CITY, sunshine: d['JUL']}
  }).sort((a,b) => b.sunshine - a.sunshine).slice(0,20)

  console.log('sunshine data', sunshineData);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Chart Components</h1>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <h1>Pie Chart</h1>
      <PieChart width={960} height={600} />
      <h1>Donut Chart</h1>
      <PieChart width={960} height={600} type='donut' />
      <CirclesGapMinder data={gapData} colorScale={color} year={selectedYear.x} onSliderChange={handleSliderChange} continents={continents} selectedContinent={selectedContinent}  setContinent={handleLegendClick}/>
      <Circles />
      <ChartBar width={900} height={600} data={sunshineData}/>
      <D3BarChart data={data} />
      <D3LineChart data={data} />
      {/* <BarChartComponent />
      <LineChartComponent /> */}
    </>
  )
}

export default App
