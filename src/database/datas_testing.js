const data = [
  {
    title: "Efficiency",
    value: "91.5% ▲ 2.3%",
    trend: "green",
    detail: "Current efficiency over the last hour has increased by 2.3% compared to the previous average. This improvement is attributed to reduced machine setup times and optimized operator rotations.",
    chartType: "line",
    chartData: [
      { name: "08:00", value: 82 },
      { name: "09:00", value: 85 },
      { name: "10:00", value: 83 },
      { name: "11:00", value: 84 },
      { name: "12:00", value: 86 },
      { name: "13:00", value: 85 },
      { name: "14:00", value: 87 },
      { name: "15:00", value: 91.5 }
    ]
  },
  {
    title: "Yield rate",
    value: "98.7% ▼ 0.1%",
    trend: "red",
    detail: "Yield rate slightly dropped by 0.1% due to minor quality rejections in station 4. Quality team has been notified to investigate potential calibration issues.",
    chartType: "line",
    chartData: [
      { name: "08:00", value: 98.8 },
      { name: "09:00", value: 98.9 },
      { name: "10:00", value: 98.7 },
      { name: "11:00", value: 98.6 },
      { name: "12:00", value: 98.7 },
      { name: "13:00", value: 98.8 },
      { name: "14:00", value: 98.7 }
    ]
  },
  {
    title: "Production (UPH)",
    value: "420 ▲ 15",
    trend: "green",
    detail: "Current production rate at 420 units per hour, showing a 15 UPH increase from previous hour. This improvement follows the implementation of the new workflow optimization.",
    chartType: "bar",
    chartData: [
      { name: "08:00", value: 380 },
      { name: "09:00", value: 395 },
      { name: "10:00", value: 405 },
      { name: "11:00", value: 390 },
      { name: "12:00", value: 415 },
      { name: "13:00", value: 420 }
    ]
  },
  {
    title: "Cumulative Production",
    value: "5,603",
    trend: "green",
    detail: "Total units produced this shift with an average of 420 UPH. Projected to reach 6,800 units by shift end, exceeding target by 3%.",
    chartType: "line",
    chartData: [
      { name: "Shift Start", value: 0 },
      { name: "4h", value: 1600 },
      { name: "5h", value: 2100 },
      { name: "6h", value: 2800 },
      { name: "7h", value: 3600 },
      { name: "8h", value: 4500 },
      { name: "Current", value: 5603 }
    ]
  },
  {
    title: "Downtime",
    value: "12 mins",
    trend: "red",
    detail: "Downtime has reached 12 minutes this hour (8% of hour). Primary cause: 8 minutes for mold change in station 2, 4 minutes for material replenishment.",
    chartType: "bar",
    chartData: [
      { name: "Mech. Issues", value: 8 },
      { name: "Material Wait", value: 4 },
      { name: "Changeover", value: 0 },
      { name: "Quality Check", value: 0 }
    ]
  },
  {
    title: "Efficiency Trend",
    value: "89.2%",
    trend: "green",
    detail: "Hourly efficiency shows consistent improvement from 84% to 89.2% after implementing the new standard work procedures at 10:30.",
    chartType: "line",
    chartData: [
      { name: "06:00", value: 84 },
      { name: "07:00", value: 85 },
      { name: "08:00", value: 86 },
      { name: "09:00", value: 87 },
      { name: "10:00", value: 85 },
      { name: "11:00", value: 88 },
      { name: "12:00", value: 89.2 }
    ]
  },
  {
    title: "Unit Fail Rate",
    value: "3.2% ▼ 0.4%",
    trend: "green",
    detail: "Failure rate improved by 0.4% after adjusting torque settings on station 3. Current defects: 1.8% misalignment, 1.4% cosmetic.",
    chartType: "bar",
    chartData: [
      { name: "Misalignment", value: 1.8 },
      { name: "Cosmetic", value: 1.4 },
      { name: "Functional", value: 0 },
      { name: "Other", value: 0 }
    ]
  },
  {
    title: "12h Production Trend",
    value: "Avg 410 UPH",
    trend: "green",
    detail: "Production has been consistent over the past 12 hours, peaking at 435 UPH during 2nd shift. Current rate is 5% above 12h average.",
    chartType: "line",
    chartData: [
      { name: "12h ago", value: 380 },
      { name: "10h", value: 395 },
      { name: "8h", value: 410 },
      { name: "6h", value: 425 },
      { name: "4h", value: 435 },
      { name: "2h", value: 420 },
      { name: "Current", value: 430 }
    ]
  },
  {
    title: "OEE (Overall Equipment)",
    value: "85.7% ▲ 2.1%",
    trend: "green",
    detail: "Overall Equipment Effectiveness improved to 85.7% (Availability: 92%, Performance: 93%, Quality: 98.7%). Exceeds plant target of 85%.",
    chartType: "circle"
  }
];

export default data;