import React, { useState } from "react";
import Image1 from "../../assets/bckg.jpeg";
import { Bar } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { jsPDF } from "jspdf";
ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const SolarCalculator = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    city: "",
    customerType: "",
    units: "",
    message: "",
  });

  const [forecastRange, setForecastRange] = useState(12);

  const deviceData = [
    { name: "Fan", wattage: 80 },
    { name: "Light/Bulb", wattage: 20 },
    { name: "AC", wattage: 1500 },
    { name: "Refrigerator", wattage: 400 },
    { name: "TV", wattage: 150 },
    { name: "Washing Machine", wattage: 500 },
    { name: "Water Pump", wattage: 750 },
    { name: "Iron", wattage: 1000 },
    { name: "Computer", wattage: 300 },
    { name: "Printer", wattage: 200 },
  ];

  const [selectedDevices, setSelectedDevices] = useState([]);
  const [deviceUsage, setDeviceUsage] = useState({});
  const [result, setResult] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeviceSelection = (deviceName) => {
    setSelectedDevices((prev) =>
      prev.includes(deviceName)
        ? prev.filter((device) => device !== deviceName)
        : [...prev, deviceName]
    );
  };

  const handleUsageChange = (deviceName, field, value) => {
    setDeviceUsage((prev) => ({
      ...prev,
      [deviceName]: { ...prev[deviceName], [field]: value },
    }));
  };

  const handleQuantityChange = (deviceName, value) => {
    handleUsageChange(deviceName, "quantity", value);
  };

  const predictBestPanelSetup = async (city, userLoad) => {
    try {
      const response = await fetch("http://localhost:8000/api/predict-solar-setup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, user_load: userLoad }),
      });
      return await response.json();
    } catch (error) {
      console.error("Prediction error:", error);
      return null;
    }
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    const { units, perUnitRate, customerType } = formData;
    if (!customerType || !units || !perUnitRate) {
      alert("Please fill out all fields including units and per unit rate.");
      return;
    }
    let totalWattHours = 0;
    selectedDevices.forEach((deviceName) => {
      const device = deviceData.find((d) => d.name === deviceName);
      const { quantity = 0, hours = 0 } = deviceUsage[deviceName] || {};
      totalWattHours += device.wattage * quantity * hours;
    });
    const adjustmentFactor = customerType === "residential" ? 1.2 : customerType === "commercial" ? 1.5 : 1.8;
    const adjustedWattHours = totalWattHours * adjustmentFactor;
    const requiredKW = adjustedWattHours / 1000;
    const estimatedDailyKWh = adjustedWattHours / 1000;
    const monthlyBillBefore = units * perUnitRate;
    const prediction = await predictBestPanelSetup(formData.city, adjustedWattHours);
    if (!prediction) return alert("Prediction failed.");

    const estimatedSolarCost = prediction.total_price;
    const requiredPanels = prediction.required_panels;
    const afterSolarMonthlyBill = monthlyBillBefore * 0.05;
    const monthlySavings = monthlyBillBefore - afterSolarMonthlyBill;
    const yearlySavings = monthlySavings * 12;
    const paybackPeriod = estimatedSolarCost / yearlySavings;

    setResult({
      totalWattHours: adjustedWattHours.toFixed(2),
      estimatedDailyKWh: estimatedDailyKWh.toFixed(2),
      requiredKW: requiredKW.toFixed(2),
      requiredPanels,
      panelWattage: prediction.panel_wattage,
      monthlyBillBefore: monthlyBillBefore.toFixed(2),
      estimatedSolarCost: estimatedSolarCost.toFixed(0),
      monthlySavings: monthlySavings.toFixed(2),
      yearlySavings: yearlySavings.toFixed(2),
      paybackPeriod: paybackPeriod.toFixed(1),
    });
  };

  const generateForecastComparisonData = () => {
    if (!result) return { before: [], after: [] };
    const before = Array.from({ length: forecastRange }, () => parseFloat(result.monthlyBillBefore));
    const after = Array.from({ length: forecastRange }, () => parseFloat(result.monthlyBillBefore) * 0.05);
    return { before, after };
  };

  const forecastLabels = Array.from({ length: forecastRange }, (_, i) => `Month ${i + 1}`);
  const { before, after } = generateForecastComparisonData();

  const forecastChartData = {
    labels: forecastLabels,
    datasets: [
      {
        label: "Before Solar (PKR)",
        data: before,
        backgroundColor: "rgba(239, 68, 68, 0.7)",
      },
      {
        label: "After Solar (PKR)",
        data: after,
        backgroundColor: "rgba(34, 197, 94, 0.7)",
      },
    ],
  };

  const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
  },
  scales: {
    y: {
      min: 0,
      max: result ? parseFloat(result.monthlyBillBefore) * 1.2 : undefined,
      ticks: {
        stepSize: 1000,
      },
    },
  },
};



  return (
    <div className="container mx-auto p-0">
      {/* Hero Section */}
      <div className="relative h-[90vh] w-full flex items-center justify-center text-white mb-10">
        <img
          src={Image1}
          alt="Solar background"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-80 filter blur-sm saturate-150"
        />


        <div className="relative text-center z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Solar Calculator</h1>
          <p className="text-xl md:text-2xl font-medium">Calculate Your Load</p>
        </div>
      </div>

      {/* User Form */}
      <div className="max-w-l mx-auto p-8 bg-orange-200">
        <h2 className="text-3xl font-bold text-center mb-2">Get A Quote</h2>
        <p className="text-center text-gray-600 mb-6">
          Complete the below form and our team will contact you shortly
        </p>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleCalculate}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
            className="w-full border border-gray-300 rounded-lg px-5 py-3 text-lg"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-md px-5 py-3 text-lg"
            required
          />
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleInputChange}
            placeholder="Enter contact number"
            className="w-full border border-gray-300 rounded-md px-5 py-3 text-lg"
            required
          />
          <input
            type="number"
            name="perUnitRate"
            value={formData.perUnitRate || ""}
            onChange={handleInputChange}
            placeholder="Per unit rate (PKR)"
            className="w-full border border-gray-300 rounded-md px-5 py-3 text-lg"
            required
          />

          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="Enter city"
            className="w-full border border-gray-300 rounded-md px-5 py-3 text-lg"
          />
          <select
            name="customerType"
            value={formData.customerType}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-5 py-3 text-lg"
            required
          >
            <option value="">Select Customer Type</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
          </select>
          <input
            type="number"
            name="units"
            value={formData.units}
            onChange={handleInputChange}
            placeholder="Units"
            className="w-full border border-gray-300 rounded-md px-5 py-3 text-lg"
            required
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows="4"
            className="w-full md:col-span-2 border border-gray-300 rounded-md px-5 py-3 text-lg"
            placeholder="Enter your message"
          />
          <div className="md:col-span-2 text-center mt-4">
            <button
              type="submit"
              className="bg-primary text-white font-semibold py-2 px-6 rounded hover:bg-white hover:text-primary border-2 border-primary transition"
            >
              Request a Meeting
            </button>
          </div>
        </form>
      </div>

      {/* Device Selection */}
      <div className="mb-6">
        <h1 className="text-4xl md:text-5xl text-center font-bold mb-4">Select your appliances</h1>
        <div
          className="relative cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <div className="bg-gray-200 p-4 rounded-md border border-gray-300 text-lg">
            <span>Select Devices</span>
          </div>
          {dropdownOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 mt-2 rounded-md shadow-md p-4">
              {deviceData.map((device) => (
                <div key={device.name} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={device.name}
                    checked={selectedDevices.includes(device.name)}
                    onChange={() => handleDeviceSelection(device.name)}
                    className="mr-2"
                  />
                  <label htmlFor={device.name} className="text-lg">{device.name}</label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Device Usage Inputs */}
      {selectedDevices.map((deviceName) => {
        const deviceInfo = deviceData.find((d) => d.name === deviceName);
        return (
          <div key={deviceName} className="border p-4 rounded shadow mb-4">
            <h3 className="text-xl font-semibold mb-2">{deviceName}</h3>
            <div className="mb-2">
              <label className="block mb-1">Quantity</label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() =>
                    handleQuantityChange(
                      deviceName,
                      Math.max((deviceUsage[deviceName]?.quantity || 0) - 1, 0)
                    )
                  }
                  className="bg-gray-300 p-2 rounded-l"
                >
                  -
                </button>
                <input
                  type="number"
                  value={deviceUsage[deviceName]?.quantity || 0}
                  onChange={(e) =>
                    handleQuantityChange(deviceName, parseInt(e.target.value) || 0)
                  }
                  className="border p-2 text-center w-12"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleQuantityChange(
                      deviceName,
                      (deviceUsage[deviceName]?.quantity || 0) + 1
                    )
                  }
                  className="bg-gray-300 p-2 rounded-r"
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <label className="block mb-1">Hours Used Per Day</label>
              <select
                value={deviceUsage[deviceName]?.hours || ""}
                onChange={(e) =>
                  handleUsageChange(deviceName, "hours", parseInt(e.target.value))
                }
                required
                className="border p-2 rounded w-full"
              >
                <option value="">Select Hours</option>
                <option value="1">1-3 Hours</option>
                <option value="4">4-6 Hours</option>
                <option value="7">7-9 Hours</option>
                <option value="10">10+ Hours</option>
              </select>
            </div>
          </div>
        );
      })}
      {/* Calculate Button */}
      <div className="text-center mb-6">
        <button
          type="button"
          onClick={handleCalculate}
          className="bg-primary text-white font-semibold py-2 px-6 rounded hover:bg-white hover:text-primary border-2 border-primary transition"
        >
          Calculate
        </button>
      </div>
      {/* Result */}

      {/* Dashboard-style Graphs */}

      {result && (
        <div className="mt-8 bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Your Estimated Solar Requirement</h2>
          <p>Daily Consumption: {result.estimatedDailyKWh} kWh</p>
          <p>Monthly Bill (Before): PKR {result.monthlyBillBefore}</p>
          <p>Required System Size: {result.requiredKW} kW</p>
          <p>Required Panels: {result.requiredPanels} Panels</p>
          <p>Selected Panel Wattage: {result.panelWattage}W</p>
          <p>Estimated Solar Cost: PKR {result.estimatedSolarCost}</p>
          <p>Estimated Monthly Savings: PKR {result.monthlySavings}</p>
          <p>Estimated Yearly Savings: PKR {result.yearlySavings}</p>
          <p>Payback Period: {result.paybackPeriod} years</p>

          <div className="mt-8">
            <div className="bg-green-100 border border-green-400 rounded p-4 mb-6">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Estimated Savings Summary</h3>
              <ul className="list-disc pl-6 text-green-800">
                <li>1 Year Savings: PKR {(parseFloat(result.monthlySavings) * 12).toFixed(0)}</li>
                <li>2 Year Savings: PKR {(parseFloat(result.monthlySavings) * 24).toFixed(0)}</li>
                <li>5 Year Savings: PKR {(parseFloat(result.monthlySavings) * 60).toFixed(0)}</li>
              </ul>
            </div>

            <label className="block mb-2 font-semibold">Select Forecast Duration:</label>
            <select
              value={forecastRange}
              onChange={(e) => setForecastRange(Number(e.target.value))}
              className="mb-4 p-2 border rounded"
            >
              <option value={12}>1 Year</option>
              <option value={24}>2 Years</option>
              <option value={60}>5 Years</option>
            </select>

            <h3 className="text-lg font-semibold mt-4 mb-2">Electricity Bill Before vs After Solar</h3>
            <Bar data={forecastChartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SolarCalculator;