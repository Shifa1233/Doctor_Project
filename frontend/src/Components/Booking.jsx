import React, { useState, useEffect } from "react";
import axios from "axios";
import { Icon } from '@iconify/react/dist/iconify.js'
import { useNavigate } from "react-router-dom";
import book from '../assets/book.avif'

const getDaysInMonth = (year, month) => {
  const days = [];
  const date = new Date(year, month, 1);

  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const getFirstDayOfMonth = (year, month) => {
  const date = new Date(year, month, 1);
  return date.getDay();
};

const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

const Calendar = () => {
  const currentDate = new Date();

  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [selectedTime, setSelectedTime] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  useEffect(() => {
    const fetchAvailableSlots = async (date) => {
      try {
        const formattedDate = formatDateToYMD(date);
        const response = await axios.get(`http://127.0.0.1:8000/available-slots/?date=${formattedDate}`);
        setAvailableSlots(response.data.slots); 
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching available slots:", error);
      }
    };

    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    const fetchSlotsForMonth = async () => {
      try {
        const formattedMonth = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
        const response = await axios.get(`http://127.0.0.1:8000/available-slots/?month=${formattedMonth}`);
        setAvailableSlots(response.data.slots);
      } catch (error) {
        console.error("Error fetching available slots:", error);
      }
    };

    fetchSlotsForMonth(); 
  }, [currentMonth, currentYear]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11); 
      setCurrentYear(currentYear - 1); 
    } else {
      setCurrentMonth(currentMonth - 1); 
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0); 
      setCurrentYear(currentYear + 1); 
    } else {
      setCurrentMonth(currentMonth + 1); 
    }
  };

  const handleDateClick = (date) => {
    if (date >= currentDate && date.getDay() !== 0) { // Only allow selection if the date is today or in the future and not a Sunday
      setSelectedDate(date);
      setShowTimePicker(true);
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const formatDateToYMD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0'); 
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async () => {
    try {
      const formattedDate = formatDateToYMD(selectedDate);
      const token = localStorage.getItem("authToken");

      const response = await axios.post(
        "http://127.0.0.1:8000/book-appointment/",
        {
          date: formattedDate,
          time_slot: selectedTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`Appointment booked for ${formattedDate} at ${selectedTime}`);
      setShowTimePicker(false);
      setSelectedTime("");
    } catch (error) {
      alert("This slot is already booked!");
      console.error("Error booking appointment:", error);
    }
  };

  const isSlotAvailable = (time) => {
    return availableSlots?.some((slot) => slot.time_slot === time && slot.status === "available");
  };

  const isPastDate = (date) => {
    return date < currentDate.setHours(0, 0, 0, 0);  
  };

  const isSunday = (date) => {
    return date.getDay() === 0; 
  };

  const navigate = useNavigate();

  return (
    <div className="flex h-screen">
      {/* Left Section with Blue Background */}
      <div className="w-1/2 bg-blue-500 flex items-center justify-center text-white flex-col">
    <div className="absolute top-0 left-0 items-center cursor-pointer w-fit ml-6 pt-5" onClick={() => navigate("/home")}>
      <Icon icon="famicons:arrow-back-circle-outline" width="30" height="30" style={{ color: 'white' }} />
    </div>
    <div className="text-center">
      <h1 className="text-4xl font-bold">Select Your Appointment</h1>
      <p className="mt-4 text-lg">Choose a date and time for your appointment.</p>
    </div>
  
    {/* Image Below the Text */}
    <div className="mt-6 w-75 h-75">
      <img
        src={book}
        alt="Appointment Image"
        className="object-cover w-full h-full rounded-lg"
      />
      </div>
    </div>

      <div className="w-1/2 bg-white">
        <div className="max-w-lg mx-auto mt-10 bg-gray-300 rounded-lg shadow-lg p-4">
          {/* Calendar Header */}
          <div className="flex justify-between items-center mb-4">
            <button className="text-xl font-bold" onClick={handlePrevMonth}>
              &lt;
            </button>
            <div className="text-xl font-bold">
              {`${selectedDate.toLocaleString("default", { month: "long" })} ${currentYear}`}
            </div>
            <button className="text-xl font-bold" onClick={handleNextMonth}>
              &gt;
            </button>
          </div>

          {/* Days of the Week */}
          <div className="grid grid-cols-7 text-center py-2 bg-gray-100 rounded-lg font-semibold">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
              <div key={index} className="py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Days of the Month */}
          <div className="grid grid-cols-7 font-bold gap-2 py-4">
            {Array(firstDayOfMonth)
              .fill(null)
              .map((_, index) => (
                <div key={index} />
              ))}

            {daysInMonth.map((day, index) => {
              const isToday =
                day.getDate() === currentDate.getDate() &&
                day.getMonth() === currentDate.getMonth();
              const isSelected = day.getDate() === selectedDate.getDate();
              const isDisabled = isPastDate(day) || isSunday(day); // Disable past dates and Sundays

              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(day)}
                  disabled={isDisabled} // Disable button for past dates and Sundays
                  className={`p-2 text-sm rounded-lg ${
                    isToday
                      ? "bg-blue-500 text-white"
                      : isSelected
                      ? "bg-green-500 text-white"
                      : isDisabled
                      ? "bg-gray-200 text-gray-600 cursor-not-allowed" // Disabled style
                      : "hover:bg-gray-400"
                  }`}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>

          {/* Time Slot Section (Visible after a date is selected) */}
          {showTimePicker && (
            <div className="mt-4 ">
              <h3 className="font-semibold text-lg">Choose a Time Slot:</h3>
              <div className="flex flex-wrap gap-2 mt-2">
              {timeSlots.map((time, index) => (
      <button
        key={index}
        className={`p-2 rounded-lg text-sm ${
        selectedTime === time
        ? "bg-blue-500 text-white" 
        : !isSlotAvailable(time) 
        ? "bg-gray-200 text-gray-600 cursor-not-allowed" 
        : "bg-gray-200 hover:bg-gray-400" 
        }`}
        onClick={() => handleTimeSelect(time)}
        disabled={!isSlotAvailable(time)} 
              >
        {time}
        </button>
        ))}

              </div>

              {/* Submit Button */}
              {selectedTime && (
                <div className="flex justify-center mt-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg "
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
