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
  const recommendedProducts = {
    fan: [
      { name: 'DC Inverter Fan', brand: 'Pak Fan', price: 'Rs. 6,500' },
      { name: 'Solar Compatible Fan', brand: 'GFC', price: 'Rs. 7,000' },
    ],
    Refrigerator: [
      { name: 'Inverter Fridge 250L', brand: 'Haier', price: 'Rs. 65,000' },
      { name: 'Solar Hybrid Fridge', brand: 'PEL', price: 'Rs. 72,000' },
    ],
    ac: [
      { name: '1.5 Ton DC Inverter AC', brand: 'Orient', price: 'Rs. 95,000' },
      { name: 'Solar Ready AC', brand: 'Gree', price: 'Rs. 110,000' },
    ],
    tv: [
      { name: '32" LED TV (Low Watt)', brand: 'EcoStar', price: 'Rs. 28,000' },
      { name: 'Solar Smart TV 40"', brand: 'Orient', price: 'Rs. 42,000' },
    ],
    Washing_Machine: [
      { name: 'Low Power Washing Machine', brand: 'Haier', price: 'Rs. 18,000' },
      { name: 'Solar Compatible Washer', brand: 'Kenwood', price: 'Rs. 21,000' },
    ],
    iron: [
      { name: 'Dry Iron (Energy Saver)', brand: 'Panasonic', price: 'Rs. 4,000' },
      { name: 'Solar Powered Steam Iron', brand: 'Anex', price: 'Rs. 5,500' },
    ],
    water_pump: [
      { name: '0.5HP Solar Pump', brand: 'Submersible Co.', price: 'Rs. 32,000' },
      { name: '1HP Solar Water Pump', brand: 'SolarMax', price: 'Rs. 45,000' },
    ],
    Light: [
      { name: '12W LED Bulb', brand: 'Philips', price: 'Rs. 450' },
      { name: 'Solar Panel Light Kit', brand: 'Sogo', price: 'Rs. 3,200' },
    ],
    computer: [
      { name: 'Mini PC (12V)', brand: 'Intel', price: 'Rs. 38,000' },
      { name: 'Solar Efficient Workstation', brand: 'ZBox', price: 'Rs. 52,000' },
    ],
    laptop: [
      { name: 'Solar Compatible Laptop', brand: 'HP', price: 'Rs. 65,000' },
      { name: 'Energy Efficient Chromebook', brand: 'Acer', price: 'Rs. 48,000' },
    ],
    oven: [
      { name: 'Low Wattage Microwave', brand: 'Dawlance', price: 'Rs. 17,000' },
      { name: 'Solar Oven (Convection)', brand: 'Westpoint', price: 'Rs. 20,000' },
    ],
    water_dispenser: [
      { name: 'Low Wattage Dispenser', brand: 'Pel', price: 'Rs. 18,500' },
      { name: 'Solar Powered Water Dispenser', brand: 'Orient', price: 'Rs. 22,000' },
    ],
    air_cooler: [
      { name: 'Solar Air Cooler', brand: 'Boss', price: 'Rs. 15,000' },
      { name: 'Energy Efficient Cooler', brand: 'Super Asia', price: 'Rs. 18,000' },
    ],
    geyser: [
      { name: 'Solar Water Geyser 15L', brand: 'Canon', price: 'Rs. 19,000' },
      { name: 'Hybrid Geyser 25L', brand: 'NasGas', price: 'Rs. 24,000' },
    ],
    mobile_charger: [
      { name: 'Solar Mobile Charger', brand: 'Anker', price: 'Rs. 3,000' },
      { name: 'Portable Solar Power Bank', brand: 'Xiaomi', price: 'Rs. 4,500' },
    ],
    router: [
      { name: 'Low Watt Wi-Fi Router', brand: 'TP-Link', price: 'Rs. 3,200' },
      { name: '12V Solar-Compatible Router', brand: 'Tenda', price: 'Rs. 3,800' },
    ],
  };
  const getFilteredProducts = (selectedAppliances) => {
    const filtered = [];
  
    selectedAppliances.forEach((appliance) => {
      if (recommendedProducts[appliance]) {
        filtered.push(...recommendedProducts[appliance]);
      }
    });
  
    return filtered;
  };
    
  const [selectedAppliances, setSelectedAppliances] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    city: "",
    customerType: "",
    units: "",
    message: "",
  });

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
  const [meetingRequested, setMeetingRequested] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeviceSelection = (deviceName) => {
    setSelectedDevices((prevSelected) =>
      prevSelected.includes(deviceName)
        ? prevSelected.filter((device) => device !== deviceName)
        : [...prevSelected, deviceName]
    );
  };
  const handleApplianceSelect = (appliance) => {
    setSelectedAppliances((prev) =>
      prev.includes(appliance)
        ? prev.filter((a) => a !== appliance)
        : [...prev, appliance]
    );
  };
  const handleUsageChange = (deviceName, field, value) => {
    setDeviceUsage((prevUsage) => ({
      ...prevUsage,
      [deviceName]: {
        ...prevUsage[deviceName],
        [field]: value,
      },
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
  
    const { name, email, contact, city, units, perUnitRate, customerType } = formData;
  
    // Check for empty fields
    if (!name || !email || !contact || !city || !units || !perUnitRate || !customerType ) {
      alert("Please fill out all required fields.");
      return;
    }
  
    // Check if units and perUnitRate are greater than 0
    if (parseFloat(units) <= 0 || parseFloat(perUnitRate) <= 0) {
      alert("Units and Per Unit Rate must be greater than 0.");
      return;
    }
  
    // Check valid Pakistani phone number
    const phonePattern = /^03[0-9]{9}$/;
    if (!phonePattern.test(contact)) {
      alert("Please enter a valid 11-digit Pakistani phone number starting with 03.");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    for (const deviceName of selectedDevices) {
      const quantity = deviceUsage[deviceName]?.quantity || 0;
      if (quantity <= 0) {
        alert(`Please enter quantity greater than 0 for ${deviceName}.`);
        return;
      }
    }
  
   
  
    // --- Your existing calculation logic ---
    let totalWattHours = 0;
    selectedDevices.forEach((deviceName) => {
      const deviceInfo = deviceData.find((d) => d.name === deviceName);
      const { quantity = 0, hours = 0 } = deviceUsage[deviceName] || {};
      totalWattHours += deviceInfo.wattage * quantity * hours;
    });
  
    const adjustmentFactor =
      customerType === "residential" ? 1.2 :
      customerType === "commercial" ? 1.5 : 1.8;
  
    const adjustedWattHours = totalWattHours * adjustmentFactor;
    const requiredKW = adjustedWattHours / 1000;
    //const requiredPanels = Math.ceil((requiredKW * 1000) / 580);
    const estimatedDailyKWh = adjustedWattHours / 1000;
    const monthlyBillBefore = units * perUnitRate;
    //const estimatedSolarCost = requiredKW * 180000;
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
  
   
  setShowRecommendations(true);
  // 👈
  };
  const handleMeetingRequest = (e) => {
    e.preventDefault();
    setMeetingRequested(true);
  };
  
  const getRecommendations = () => {
    let products = [];
    selectedDevices.forEach(appliance => {
      if (recommendedProducts[appliance]) {
        products = [...products, ...recommendedProducts[appliance]];
      }
    });
    return products;
  };
    const filteredProducts = getFilteredProducts(selectedAppliances);
  
const handleExportPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  // Set your website name in the top-left corner
doc.setFontSize(10);
doc.setTextColor(100); // gray color for website name
doc.text("SolarAid", 10, 10); // 👈 top-left

// Centered Title with orange color
doc.setFontSize(18);
doc.setTextColor(255, 165, 0);
const pageWidth = doc.internal.pageSize.getWidth();
const text="Solaraid"
const title = "Solar Calculator Result";
const textWidth = doc.getTextWidth(title);
const x = (pageWidth - textWidth) / 2;
doc.text(title, x, 30); // y = 30
doc.setTextColor(0, 0, 0);

  doc.setFontSize(12);
  doc.text(`Monthly Bill (Before): PKR ${result.monthlyBillBefore}`, 20, 40);
  doc.text(`Required System Size: ${result.requiredKW} kW`, 20, 50);
  doc.text(`Estimated Solar Cost: PKR ${result.estimatedSolarCost}`, 20, 60);
  doc.text(`Monthly Savings: PKR ${result.monthlySavings}`, 20, 70);
  doc.text(`Yearly Savings: PKR ${result.yearlySavings}`, 20, 80);
  doc.text(`Payback Period: ${result.paybackPeriod} years`, 20, 90);

  // Save the PDF
  doc.save("solar_calculator_result.pdf");
};
const deviceToProductKey = {
  Fan: 'fan',
  AC: 'ac',
  Refrigerator: 'fridge',
  TV: 'tv',
  'Washing Machine': 'washing_machine',
  'Water Pump': 'water_pump',
  Iron: 'iron',
  Computer: 'computer',
  'Light/Bulb': 'lights',
  Oven: 'oven',
  Laptop: 'laptop',
  'Water Dispenser': 'water_dispenser',
  'Air Cooler': 'air_cooler',
  Geyser: 'geyser',
  Printer: '', // optional: if you want to ignore it
  'Mobile Charger': 'mobile_charger',
  Router: 'router',
};

const generateFluctuatingData = (baseValue) => {
  // Create fluctuating values by adding or subtracting a random number
  return Array.from({ length: 12 }, () => {
    const fluctuation = (Math.random() - 0.5) * 0.2; // This will vary the value within ±20% of the base value
    return baseValue * (1 + fluctuation);
  });
};
const chartOptions = {
  indexAxis: 'y', // 👈 This makes the Y-axis show labels (months)
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      enabled: true,
    },
  },
};
const [formSubmitted, setFormSubmitted] = useState(false);


const chartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "Before Solar (PKR)",
      data: generateFluctuatingData(parseFloat(result?.monthlyBillBefore || 0)),// Before Solar bills
      borderColor: "rgba(239, 68, 68, 1)", // red-500
      backgroundColor: "transparent",
      barThickness: 20,
      pointBackgroundColor: "white",
      pointBorderColor: "rgba(239, 68, 68, 1)",
      backgroundColor: "rgba(239, 68, 68, 0.7)",
      tension: 0.1,
    },
    {
      label: "After Solar (PKR)",
      data: generateFluctuatingData(parseFloat(result?.monthlyBillBefore || 0)), // After Solar savings
      borderColor: "rgba(34, 197, 94, 1)", // green-500
      backgroundColor: "transparent",
      barThickness: 20,
      pointBackgroundColor: "white",
      pointBorderColor: "rgba(34, 197, 94, 1)",
      backgroundColor: "rgba(34, 197, 94, 0.7)",
      tension: 0.1,
    },
  ],
};



  
<Bar data={chartData} options={chartOptions} />


  return (
    <div className="container mx-auto p-0">
      {/* Hero Section */}
      <div className="relative h-full w-full text-white mb-10">
  {/* Background Image */}
  <img
    src={Image1}
    alt="Solar background"
    className="absolute inset-0 w-full h-full object-cover object-center opacity-80 filter blur-sm saturate-150"
  />

  {/* Overlay Content */}
  <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-10">
    {/* Heading */}
    <div className="text-center py-12  shadow-lg rounded-lg mb-10">
  <h1 className="text-5xl font-extrabold drop-shadow-md mb-3 tracking-wide">
     SolarAid Calculator
  </h1>
  <p className="text-xl font-medium mb-6 italic">Effortlessly estimate your energy load and save smart</p>
    </div>

    {/* Form Container */}
    <div className="w-full max-w-4xl p-8   bg-opacity-90 rounded-xl  shadow-lg">

      <p className="text-center text-xl bold font-medium text-white-700 mb-6">
        Complete the below form and our team will contact you shortly
      </p>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleCalculate}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter your name"
          className="w-full border border-gray-300 rounded-lg px-5 py-3 text-lg text-black"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          className="w-full border border-gray-300 rounded-lg px-5 py-3 text-lg text-black"
          required
        />
        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={handleInputChange}
          placeholder="Enter contact number"
          className="w-full border border-gray-300 rounded-lg px-5 py-3 text-lg text-black"
          required
        />
        <input
          type="number"
          name="perUnitRate"
          value={formData.perUnitRate || ""}
          onChange={handleInputChange}
          placeholder="Per unit rate (PKR)"
          className="w-full border border-gray-300 rounded-lg px-5 py-3 text-lg text-black"
          required
        />
        <select
  name="city"
  value={formData.city}
  onChange={handleInputChange}
  className="w-full border border-gray-300 rounded-lg px-5 py-3 text-lg text-black"
  required
>
  <option value="">Select Your City</option>
  <option value="Karachi">Karachi</option>
  <option value="Lahore">Lahore</option>
  <option value="Islamabad">Islamabad</option>
  <option value="Rawalpindi">Rawalpindi</option>
  <option value="Faisalabad">Faisalabad</option>
  <option value="Peshawar">Peshawar</option>
  <option value="Quetta">Quetta</option>
  <option value="Multan">Multan</option>
  <option value="Hyderabad">Hyderabad</option>
  <option value="Sialkot">Sialkot</option>
  <option value="Bahawalpur">Bahawalpur</option>
  <option value="Sargodha">Sargodha</option>
</select>

        <select
          name="customerType"
          value={formData.customerType}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-5 py-3 text-lg text-black"
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
          className="w-full border border-gray-300 rounded-lg px-5 py-3 text-black text-lg"
          required
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          rows="4"
          className="w-full md:col-span-2 border border-gray-300 rounded-lg px-5 py-3 text-black text-lg"
          placeholder="Enter your message"
        />
        {/* 
        <div className="md:col-span-2 text-center mt-4">
          <button
            type="submit"
            className="bg-primary text-white font-semibold py-2 px-6 rounded hover:bg-white hover:text-primary border-2 border-primary transition"
          >
            Request a Meeting
          </button>
        </div>
        */}
      </form>
    </div>
  </div>
</div>


      {/* User Form */}
      

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
          <Bar data={chartData} />
        </div>
      )}
      

      <button
        type="button"
        onClick={handleExportPDF}
        className="bg-primary text-white font-semibold py-2 px-6 rounded hover:bg-white hover:text-primary border-2 border-primary transition"
      >
        Export to PDF
      </button>
      
     <div className="md:col-span-2 text-center mt-4">
  <button
    type="button"
    onClick={handleMeetingRequest}
    className="bg-primary text-white font-semibold py-2 px-6 rounded hover:bg-white hover:text-primary border-2 border-primary transition"
  >
    Request a Meeting
  </button>

  {meetingRequested && (
    <p className="text-green-600 font-medium mt-3 transition-all">
      ✅ Your request has been submitted. You’ll be contacted shortly.
    </p>
  )}
</div>


       
    </div>
    
  );
};

export default SolarCalculator;
