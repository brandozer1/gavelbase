import React, {useEffect, useState} from 'react';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import {Card} from 'primereact/card';
export default function Dashboardpage() {
  const [chartData, setChartData] = useState({})
  const [chartOptions, setChartOptions] = useState({})
  useEffect(() => {
    setChartData({
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [

        {
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: true,
          backgroundColor: 'rgba(0, 189, 255, .5)',
          borderColor: 'rgba(0, 189, 255, 1)',
          tension: .4
        }
      ]
    })
    // no legend or labels
    // no gridlines no units
    setChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          display: false,
          grid: {
            display: false
          }
        },
        y: {
          display: false,
          grid: {
            display: false
          }
        }
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart'
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true
      }
    })
  }, [])

  return (
    <div className='flex surface-ground px-4 w-12 flex-column'>
      
      <div className='flex justify-content-between'>
        <h1>Dashboard</h1>
        <div className='flex gap-3 align-items-center'>
          <Button label='Create New Auction' icon='pi pi-megaphone'/>
          <Button label='Add Lot(s)' icon='pi pi-box'/>
          <Button label='Add Cosignor' icon='pi pi-user'/>
        </div>
        
      </div>
      <div className='flex gap-4'>
        <Card subTitle='Bids' title='640' className='w-3 p-0'>
          <Chart className='w-full' type="line" data={chartData} options={chartOptions} />
        </Card>
        <Card subTitle='Revenue' title='$12036.54' className='w-3'>
          <Chart className='w-full' type="line" data={chartData} options={chartOptions} />
        </Card>
        <Card subTitle='Lots Sold' title='231' className='w-3'>
          <Chart className='w-full' type="line" data={chartData} options={chartOptions} />
        </Card>
        <Card subTitle='Average Price' title='$32.21' className='w-3'>
          <Chart className='w-full' type="line" data={chartData} options={chartOptions} />
        </Card>
      </div>
    </div>
  )
}
