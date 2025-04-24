import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;

interface DatePickerCustomProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onClose: () => void;
}

const DatePickerCustom: React.FC<DatePickerCustomProps> = ({
  selectedDate,
  onDateChange,
  onClose,
}) => {
  const today = new Date();
  const [month, setMonth] = useState(selectedDate.getMonth());
  const [year, setYear] = useState(selectedDate.getFullYear());
  const [localSelectedDate, setLocalSelectedDate] = useState(
    new Date(selectedDate),
  );

  // Get current month days
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Format month name
  const getMonthName = (month: number) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[month];
  };

  // Check if date is today
  const isToday = (date: Date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Check if date is selected
  const isSelectedDay = (day: number) => {
    return (
      day === localSelectedDate.getDate() &&
      month === localSelectedDate.getMonth() &&
      year === localSelectedDate.getFullYear()
    );
  };

  // Generate calendar days
  const renderCalendar = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    // Render week days
    const weekDays = ["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
      <Text key={`weekday-${index}`} style={styles.weekDay}>
        {day}
      </Text>
    ));

    days.push(
      <View key="weekdays" style={styles.weekDayRow}>
        {weekDays}
      </View>,
    );

    // Create rows for the calendar
    let dayCounter = 1;
    for (let i = 0; i < 6; i++) {
      if (dayCounter > daysInMonth) break;

      const row = [];
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDayOfMonth) || dayCounter > daysInMonth) {
          row.push(
            <View key={`empty-${i}-${j}`} style={styles.dayPlaceholder} />,
          );
        } else {
          const currentDay = dayCounter;
          const date = new Date(year, month, currentDay);
          const isCurrentDay = isToday(date);
          const isSelected = isSelectedDay(currentDay);
          const isPastDate = date < today && !isToday(date);

          row.push(
            <TouchableOpacity
              key={`day-${dayCounter}`}
              style={[
                styles.day,
                isCurrentDay && styles.today,
                isSelected && styles.selectedDay,
                isPastDate && styles.pastDay,
              ]}
              disabled={isPastDate}
              onPress={() => {
                const newDate = new Date(localSelectedDate);
                newDate.setFullYear(year);
                newDate.setMonth(month);
                newDate.setDate(currentDay);
                setLocalSelectedDate(newDate);
              }}
            >
              <Text
                style={[
                  styles.dayText,
                  isCurrentDay && styles.todayText,
                  isSelected && styles.selectedDayText,
                  isPastDate && styles.pastDayText,
                ]}
              >
                {dayCounter}
              </Text>
            </TouchableOpacity>,
          );
          dayCounter++;
        }
      }

      days.push(
        <View key={`row-${i}`} style={styles.weekRow}>
          {row}
        </View>,
      );
    }

    return days;
  };

  // Go to previous month
  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  // Go to next month
  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  // Check if prev month button should be disabled
  const isPrevMonthDisabled = () => {
    return month === today.getMonth() && year === today.getFullYear();
  };

  // Save the date and close
  const handleDone = () => {
    onDateChange(localSelectedDate);
    onClose();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handlePrevMonth}
          disabled={isPrevMonthDisabled()}
          style={[
            styles.navButton,
            isPrevMonthDisabled() && styles.disabledButton,
          ]}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={isPrevMonthDisabled() ? Colors.gray[400] : Colors.primary}
          />
        </TouchableOpacity>

        <Text style={styles.monthTitle}>
          {getMonthName(month)} {year}
        </Text>

        <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
          <Ionicons name="chevron-forward" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.calendar}>{renderCalendar()}</View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.todayButton}
          onPress={() => {
            const currentDate = new Date();
            setMonth(currentDate.getMonth());
            setYear(currentDate.getFullYear());
            // Preserve time from the previously selected date
            const newDate = new Date(currentDate);
            newDate.setHours(
              localSelectedDate.getHours(),
              localSelectedDate.getMinutes(),
            );
            setLocalSelectedDate(newDate);
          }}
        >
          <Text style={styles.todayButtonText}>Today</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.gray[800],
    letterSpacing: 0.5,
  },
  calendar: {
    marginBottom: 20,
  },
  weekDayRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    paddingBottom: 10,
  },
  weekDay: {
    width: 36,
    textAlign: "center",
    fontWeight: "700",
    color: Colors.gray[500],
    fontSize: 14,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  day: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    fontSize: 15,
    color: Colors.gray[800],
    fontWeight: "500",
  },
  today: {
    backgroundColor: Colors.gray[200],
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  todayText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  selectedDay: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedDayText: {
    color: Colors.white,
    fontWeight: "600",
  },
  dayPlaceholder: {
    width: 36,
    height: 36,
  },
  pastDay: {
    opacity: 0.4,
  },
  pastDayText: {
    color: Colors.gray[400],
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  todayButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: Colors.gray[200],
    minWidth: 90,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  todayButtonText: {
    fontWeight: "600",
    color: Colors.gray[800],
    fontSize: 15,
  },
  doneButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    minWidth: 90,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  doneButtonText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 15,
  },
});

export default DatePickerCustom;
