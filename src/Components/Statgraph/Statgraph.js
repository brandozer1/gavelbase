import React, {useEffect, useState} from 'react'
import { Chart } from 'primereact/chart';
import {Card} from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';

export default function Statgraph({stat, statName, lineColor, backgroundColor}) {
    const [chartData, setChartData] = useState({})
    const [chartOptions, setChartOptions] = useState({})
    const [span, setSpan] = useState('30')

    function spanChange (e) {
        setSpan(e.value);
    }

    const spans = [
        {label: 'This Week', value: '7'},
        {label: 'This Month', value: '30'},
        {label: 'This Year', value: '365'},
        {label: 'All Time', value: 'all'}
    ]
    useEffect(() => {
        setChartData({
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [

                {
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: true,
                backgroundColor: backgroundColor || 'rgba(0, 189, 255, .5)',
                borderColor: lineColor || 'rgba(0, 189, 255, 1)',
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
    <div className='w-3 surface-card border-round shadow-2 p-3'>
        <div className='flex justify-content-between'>
            <span>{statName || 'Total Bids'}</span>
            <Dropdown className='h-2rem flex align-items-center' onChange={(e)=>spanChange(e)} value={span} options={spans} />
        </div>
        <span className='text-4xl'>1200</span>
        <Chart className='w-full' type="line" data={chartData} options={chartOptions} />
    </div>
  )
}
