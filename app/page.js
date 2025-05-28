
'use client';

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Select from "react-select";

const airportOptions = [
  { value: "DCA", label: "Washington National (DCA)" },
  { value: "IAD", label: "Washington Dulles (IAD)" },
  { value: "BWI", label: "Baltimore/Washington (BWI)" },
  { value: "JFK", label: "New York (JFK)" },
  { value: "LHR", label: "London Heathrow (LHR)" },
  { value: "CDG", label: "Paris Charles de Gaulle (CDG)" },
  { value: "HND", label: "Tokyo Haneda (HND)" },
  { value: "DXB", label: "Dubai International (DXB)" },
  { value: "LAX", label: "Los Angeles (LAX)" },
  { value: "ORD", label: "Chicago O'Hare (ORD)" },
  { value: "NBO", label: "Nairobi Jomo Kenyatta (NBO)" },
  { value: "ADD", label: "Addis Ababa Bole (ADD)" },
  { value: "CMN", label: "Casablanca Mohammed V (CMN)" },
  { value: "LOS", label: "Lagos Murtala Muhammed (LOS)" },
  { value: "DKR", label: "Dakar Blaise Diagne (DKR)" }
];

const timeZoneOptions = Array.from({ length: 27 }, (_, i) => {
  const offset = i - 12;
  const label = `UTC${offset >= 0 ? '+' : ''}${offset}`;
  return { value: label, label };
});

export default function CompTimeCalculator() {
  const [entries, setEntries] = useState([
    {
      date: "",
      isWorkDay: "yes",
      departureCity: null,
      departure: "",
      departureTZ: null,
      arrivalDate: "",
      arrivalCity: null,
      arrival: "",
      arrivalTZ: null,
      compTime: null,
    },
  ]);

  const calculateCompTime = (entry) => {
    try {
      const depOffset = parseInt(entry.departureTZ?.value.replace("UTC", "")) || 0;
      const arrOffset = parseInt(entry.arrivalTZ?.value.replace("UTC", "")) || 0;

      const dep = new Date(`${entry.date}T${entry.departure}:00Z`);
      dep.setHours(dep.getHours() - depOffset);

      let arr = new Date(`${entry.arrivalDate || entry.date}T${entry.arrival}:00Z`);
      arr.setHours(arr.getHours() - arrOffset);

      if (arr < dep) arr.setDate(arr.getDate() + 1);

      let totalMinutes = 0;
      const current = new Date(dep);

      while (current < arr) {
        const day = current.getDay();
        const hour = current.getHours();
        const isWorkHour = (hour >= 9 && hour < 17) && (day >= 1 && day <= 5) && entry.isWorkDay === "yes";
        if (!isWorkHour) totalMinutes += 1;
        current.setMinutes(current.getMinutes() + 1);
      }

      return (Math.round((totalMinutes / 60) * 4) / 4).toFixed(2);
    } catch {
      return null;
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] = value;
    if (updated[index].date && updated[index].departure && updated[index].arrival && updated[index].departureTZ && updated[index].arrivalTZ) {
      updated[index].compTime = calculateCompTime(updated[index]);
    }
    setEntries(updated);
  };

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        date: "",
        isWorkDay: "yes",
        departureCity: null,
        departure: "",
        departureTZ: null,
        arrivalDate: "",
        arrivalCity: null,
        arrival: "",
        arrivalTZ: null,
        compTime: null,
      },
    ]);
  };

  const totalCompTime = entries.reduce((sum, entry) => {
    return sum + (parseFloat(entry.compTime) || 0);
  }, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-2">Comp Time for Travel Calculator</h1>
      <div className="grid grid-cols-10 gap-4 font-semibold text-sm border-b pb-2 text-left">
        <div>Date</div>
        <div>Workday?</div>
        <div>Departure</div>
        <div>Dep. Time</div>
        <div>Dep. TZ</div>
        <div>Arrival</div>
        <div>Arr. Date</div>
        <div>Arr. Time</div>
        <div>Arr. TZ</div>
        <div>Comp Time</div>
      </div>
      {entries.map((entry, index) => (
        <div key={index} className="grid grid-cols-10 gap-4 items-center border-b py-2">
          <Input type="date" value={entry.date} onChange={(e) => handleChange(index, "date", e.target.value)} />
          <select className="border border-gray-300 p-2 rounded w-full" value={entry.isWorkDay} onChange={(e) => handleChange(index, "isWorkDay", e.target.value)}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <Select options={airportOptions} value={entry.departureCity} onChange={(option) => handleChange(index, "departureCity", option)} placeholder="Departure City" className="w-full" />
          <Input type="time" value={entry.departure} onChange={(e) => handleChange(index, "departure", e.target.value)} />
          <Select options={timeZoneOptions} value={entry.departureTZ} onChange={(option) => handleChange(index, "departureTZ", option)} placeholder="Dep TZ" className="w-full" />
          <Select options={airportOptions} value={entry.arrivalCity} onChange={(option) => handleChange(index, "arrivalCity", option)} placeholder="Arrival City" className="w-full" />
          <Input type="date" value={entry.arrivalDate} onChange={(e) => handleChange(index, "arrivalDate", e.target.value)} />
          <Input type="time" value={entry.arrival} onChange={(e) => handleChange(index, "arrival", e.target.value)} />
          <Select options={timeZoneOptions} value={entry.arrivalTZ} onChange={(option) => handleChange(index, "arrivalTZ", option)} placeholder="Arr TZ" className="w-full" />
          <div className="text-center font-medium">{entry.compTime !== null ? `${entry.compTime} hrs` : "--"}</div>
        </div>
      ))}
      <div className="flex justify-between items-center pt-4">
        <Button onClick={addEntry}>Add Travel Segment</Button>
        <div className="text-right font-semibold text-lg">Total Comp Time: {totalCompTime.toFixed(2)} hrs</div>
      </div>
    </div>
  );
}
