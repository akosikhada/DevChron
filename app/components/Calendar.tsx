import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Task } from "../context/TaskContext";
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  getMonthName,
  isSameDay,
  getTasksForDate,
} from "../utils/dateUtils";
import Colors from "../constants/Colors";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;

interface CalendarProps {
  tasks: Task[];
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
}

const Calendar: React.FC<CalendarProps> = ({
  tasks,
  onDateSelect,
  selectedDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  const [animation] = useState(new Animated.Value(0));

  // Calendar days generation
  useEffect(() => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
    const days: Date[] = [];

    // Previous month days
    const prevMonthDays = firstDayOfMonth;
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);

    for (
      let i = daysInPrevMonth - prevMonthDays + 1;
      i <= daysInPrevMonth;
      i++
    ) {
      days.push(new Date(prevMonthYear, prevMonth, i));
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentYear, currentMonth, i));
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 rows x 7 days = 42
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;

    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(nextMonthYear, nextMonth, i));
    }

    setCalendarDays(days);

    // Create animation when month changes
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentMonth, currentYear]);

  // Go to previous month
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Go to next month
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Go to today
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    onDateSelect(today);
  };

  // Check if a day has tasks
  const hasTasksOnDay = (date: Date): boolean => {
    return getTasksForDate(tasks, date).length > 0;
  };

  // Get task count for a specific day
  const getTaskCountForDay = (date: Date): number => {
    return getTasksForDate(tasks, date).length;
  };

  // Check if a day is today
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return isSameDay(date, today);
  };

  // Check if a day is selected
  const isSelectedDay = (date: Date): boolean => {
    return isSameDay(date, selectedDate);
  };

  // Check if a day is from the current month
  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentMonth;
  };

  // Group days into weeks for better rendering
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  // Animation values
  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.monthTitle}>
          {getMonthName(new Date(currentYear, currentMonth))} {currentYear}
        </Text>

        <View style={styles.headerControls}>
          <TouchableOpacity
            onPress={goToToday}
            style={styles.todayButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name="today-outline"
              size={16}
              color={Colors.primary}
              style={{ marginRight: 4 }}
            />
            <Text style={styles.todayText}>Today</Text>
          </TouchableOpacity>

          <View style={styles.monthNavigation}>
            <TouchableOpacity
              onPress={goToPreviousMonth}
              style={styles.navigationButton}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={20} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={goToNextMonth}
              style={styles.navigationButton}
              activeOpacity={0.7}
            >
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Weekday headers */}
      <View style={styles.weekdayHeader}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
          <View key={i} style={styles.weekdayItem}>
            <Text
              style={[
                styles.weekdayText,
                i === 0 || i === 6 ? styles.weekendDayText : {},
              ]}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <Animated.View
        style={[styles.calendarGrid, { opacity, transform: [{ translateY }] }]}
      >
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((date, dayIndex) => {
              const isCurrentMonthDay = isCurrentMonth(date);
              const isTodayDay = isToday(date);
              const isSelected = isSelectedDay(date);
              const hasTasks = hasTasksOnDay(date);
              const taskCount = getTaskCountForDay(date);

              return (
                <TouchableOpacity
                  key={dayIndex}
                  style={[
                    styles.dayCell,
                    isTodayDay && styles.todayCell,
                    isSelected && styles.selectedCell,
                    !isCurrentMonthDay && styles.otherMonthCell,
                  ]}
                  onPress={() => onDateSelect(date)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dayText,
                      !isCurrentMonthDay && styles.otherMonthText,
                      isTodayDay && styles.dayTextToday,
                      isSelected && styles.selectedText,
                      (dayIndex === 0 || dayIndex === 6) &&
                        isCurrentMonthDay &&
                        !isTodayDay &&
                        !isSelected &&
                        styles.weekendDayText,
                    ]}
                  >
                    {date.getDate()}
                  </Text>

                  {hasTasks && (
                    <View
                      style={[
                        styles.taskIndicator,
                        isSelected && styles.selectedTaskIndicator,
                        isTodayDay && styles.todayTaskIndicator,
                      ]}
                    >
                      {taskCount > 1 && (
                        <Text
                          style={[
                            styles.taskCount,
                            isSelected && styles.selectedTaskCount,
                            isTodayDay && styles.todayTaskCount,
                          ]}
                        >
                          {taskCount}
                        </Text>
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    marginBottom: 16,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.gray[800],
    marginBottom: 8,
  },
  headerControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  todayButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  todayText: {
    fontWeight: "500",
    color: Colors.primary,
    fontSize: 14,
  },
  monthNavigation: {
    flexDirection: "row",
  },
  navigationButton: {
    backgroundColor: Colors.gray[100],
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  weekdayHeader: {
    flexDirection: "row",
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  weekdayItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  weekdayText: {
    color: Colors.gray[600],
    fontWeight: "500",
    fontSize: isSmallDevice ? 12 : 13,
  },
  weekendDayText: {
    color: Colors.secondary,
  },
  calendarGrid: {
    borderRadius: 8,
    overflow: "hidden",
  },
  weekRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  dayCell: {
    aspectRatio: 1,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    margin: 2,
  },
  todayCell: {
    backgroundColor: Colors.primary,
  },
  selectedCell: {
    backgroundColor: Colors.secondary,
  },
  otherMonthCell: {
    opacity: 0.4,
  },
  dayText: {
    fontSize: isSmallDevice ? 14 : 16,
    color: Colors.gray[800],
    fontWeight: "normal",
  },
  dayTextToday: {
    color: Colors.white,
    fontWeight: "bold",
  },
  selectedText: {
    color: Colors.white,
    fontWeight: "bold",
  },
  otherMonthText: {
    color: Colors.gray[400],
  },
  taskIndicator: {
    position: "absolute",
    bottom: 4,
    height: 16,
    minWidth: 16,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedTaskIndicator: {
    backgroundColor: Colors.white,
  },
  todayTaskIndicator: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  taskCount: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: "bold",
  },
  selectedTaskCount: {
    color: Colors.secondary,
  },
  todayTaskCount: {
    color: Colors.primary,
  },
});

export default Calendar;
