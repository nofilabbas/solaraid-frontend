import { Link } from 'react-router-dom';
import SellerSidebar from './SellerSidebar';
import { useState, useEffect } from 'react';
import Chart from "react-apexcharts";

function DailyReport() {
    const baseUrl = 'http://127.0.0.1:8000/api';
    const sellerId = localStorage.getItem('seller_id');
    const [dates, setDates] = useState([]);
    const [data, setData] = useState([]);
 
 useEffect(() => {
    fetch_report(`${baseUrl}/seller/${sellerId}/`);
    }, []);
    function fetch_report(url) {
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data.show_daily_orders_chart);
                setDates(data.show_daily_orders_chart.Dates);
                setData(data.show_daily_orders_chart.Data);
            })
            .catch((error) => {
                console.error('Failed to fetch data:', error);
            });
    }

    const chartOptions = {
        options: {
          chart: {
            id: "basic-bar"
          },
          xaxis: {
            categories: dates
          }
        },
        series: [
          {
            name: "Orders",
            data: data
          }
        ]
      };

    const chartElement = <Chart options={chartOptions.options} series={chartOptions.series} type="bar" width="500" />

    return (
        <div className="container mx-auto mt-8">
            <div className="flex flex-wrap">
                <div className="w-full md:w-1/4 mb-4">
                    <SellerSidebar />
                </div>
                <div className="w-full md:w-3/4 mt-4">
                        <h1 className="text-3xl font-bold">Daily Reports</h1>
                    <div className="flex flex-wrap justify-between">
                        {/* <div className="text-center mb-8 max-w-[600px] mx-auto">
                            <h1 className="text-4xl font-bold">Daily Reports</h1>
                        </div> */}
                        {chartElement}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DailyReport;
