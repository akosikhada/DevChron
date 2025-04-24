import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

interface TimePickerCustomProps {
  selectedTime: Date;
  onTimeChange: (date: Date) => void;
  onClose: () => void;
}

const TimePickerCustom: React.FC<TimePickerCustomProps> = ({
  selectedTime,
  onTimeChange,
  onClose,
}) => {
  // Extract hours and minutes from the initial date
  const initialHours = selectedTime.getHours();
  const initialMinutes = selectedTime.getMinutes();

  // Initialize state with the current time values
  const [hours, setHours] = useState(initialHours);
  const [minutes, setMinutes] = useState(initialMinutes);
  const [period, setPeriod] = useState(initialHours >= 12 ? "PM" : "AM");

  // Refs for scrolling to position
  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);

  // Generate hours (1-12 for AM/PM format)
  const hoursArray = Array.from({ length: 12 }, (_, i) => i + 1);

  // Generate minutes (00-59)
  const minutesArray = Array.from({ length: 60 }, (_, i) => i);

  // Convert 24-hour format to 12-hour format
  const get12HourFormat = (hour: number) => {
    if (hour === 0) return 12;
    if (hour > 12) return hour - 12;
    return hour;
  };

  // Initialize the display hour in 12-hour format
  const [displayHour, setDisplayHour] = useState(get12HourFormat(initialHours));

  // Update display hour when hours or period changes
  useEffect(() => {
    let newHours = hours;

    // If switching from PM to AM and hours > 12, subtract 12
    if (period === "AM" && hours >= 12) {
      newHours = hours - 12;
    }

    // If switching from AM to PM and hours < 12, add 12
    if (period === "PM" && hours < 12) {
      newHours = hours + 12;
    }

    setHours(newHours);
    setDisplayHour(get12HourFormat(newHours));
  }, [period]);

  // Scroll to current time values when component mounts
  useEffect(() => {
    // Scroll to hours position after a brief delay
    setTimeout(() => {
      if (hourScrollRef.current) {
        const yOffset = Math.max(0, (get12HourFormat(initialHours) - 1) * 44);
        hourScrollRef.current.scrollTo({ y: yOffset, animated: true });
      }

      // Scroll to minutes position
      if (minuteScrollRef.current) {
        const yOffset = Math.max(0, initialMinutes * 44);
        minuteScrollRef.current.scrollTo({ y: yOffset, animated: true });
      }
    }, 300);
  }, []);

  // Format minutes to always have 2 digits
  const formatMinutes = (min: number) => {
    return min.toString().padStart(2, "0");
  };

  // Handle time selection and save
  const handleDone = () => {
    const newDate = new Date(selectedTime);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    onTimeChange(newDate);
    onClose();
  };

  // Handle hour selection
  const handleHourSelect = (hour: number) => {
    let newHour = hour;
    if (period === "PM" && hour !== 12) newHour = hour + 12;
    if (period === "AM" && hour === 12) newHour = 0;

    setHours(newHour);
    setDisplayHour(hour);
  };

  // Handle minute selection
  const handleMinuteSelect = (minute: number) => {
    setMinutes(minute);
  };

  // Handle AM/PM toggle
  const togglePeriod = () => {
    const newPeriod = period === "AM" ? "PM" : "AM";
    setPeriod(newPeriod);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Time</Text>
      </View>

      <View style={styles.timeDisplay}>
        <Text style={styles.timeText}>
          {displayHour}:{formatMinutes(minutes)} {period}
        </Text>
      </View>

      <View style={styles.selectionContainer}>
        <View style={styles.column}>
          <Text style={styles.columnHeader}>Hour</Text>
          <View style={styles.scrollViewContainer}>
            <ScrollView
              ref={hourScrollRef}
              style={styles.scrollView}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.scrollViewContent}
              nestedScrollEnabled={true}
              indicatorStyle="black"
            >
              {hoursArray.map((hour) => (
                <TouchableOpacity
                  key={`hour-${hour}`}
                  style={[
                    styles.timeOption,
                    displayHour === hour && styles.selectedOption,
                  ]}
                  onPress={() => handleHourSelect(hour)}
                >
                  <Text
                    style={[
                      styles.timeOptionText,
                      displayHour === hour && styles.selectedOptionText,
                    ]}
                  >
                    {hour}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <View style={styles.column}>
          <Text style={styles.columnHeader}>Minute</Text>
          <View style={styles.scrollViewContainer}>
            <ScrollView
              ref={minuteScrollRef}
              style={styles.scrollView}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.scrollViewContent}
              nestedScrollEnabled={true}
              indicatorStyle="black"
            >
              {minutesArray.map((minute) => (
                <TouchableOpacity
                  key={`minute-${minute}`}
                  style={[
                    styles.timeOption,
                    minutes === minute && styles.selectedOption,
                  ]}
                  onPress={() => handleMinuteSelect(minute)}
                >
                  <Text
                    style={[
                      styles.timeOptionText,
                      minutes === minute && styles.selectedOptionText,
                    ]}
                  >
                    {formatMinutes(minute)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <View style={styles.column}>
          <Text style={styles.columnHeader}>AM/PM</Text>
          <View style={styles.periodContainer}>
            <TouchableOpacity
              style={[
                styles.periodOption,
                period === "AM" && styles.selectedPeriod,
              ]}
              onPress={() => setPeriod("AM")}
            >
              <Text
                style={[
                  styles.periodText,
                  period === "AM" && styles.selectedPeriodText,
                ]}
              >
                AM
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.periodOption,
                period === "PM" && styles.selectedPeriod,
              ]}
              onPress={() => setPeriod("PM")}
            >
              <Text
                style={[
                  styles.periodText,
                  period === "PM" && styles.selectedPeriodText,
                ]}
              >
                PM
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nowButton}
          onPress={() => {
            const now = new Date();
            setHours(now.getHours());
            setMinutes(now.getMinutes());
            setDisplayHour(get12HourFormat(now.getHours()));
            setPeriod(now.getHours() >= 12 ? "PM" : "AM");
          }}
        >
          <Text style={styles.nowButtonText}>Now</Text>
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
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.gray[800],
    letterSpacing: 0.5,
  },
  timeDisplay: {
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 12,
    backgroundColor: Colors.gray[50],
  },
  timeText: {
    fontSize: 28,
    fontWeight: "600",
    color: Colors.gray[800],
    letterSpacing: 1,
  },
  selectionContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  column: {
    flex: 1,
    alignItems: "center",
  },
  columnHeader: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.gray[600],
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  scrollViewContainer: {
    height: 180,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 12,
    backgroundColor: Colors.gray[50],
    width: "90%",
    overflow: "hidden",
  },
  scrollView: {
    width: "100%",
  },
  scrollViewContent: {
    paddingVertical: 8,
    alignItems: "center",
  },
  timeOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 2,
    width: "80%",
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  timeOptionText: {
    fontSize: 17,
    color: Colors.gray[700],
  },
  selectedOption: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedOptionText: {
    color: Colors.white,
    fontWeight: "600",
  },
  periodContainer: {
    marginTop: 8,
  },
  periodOption: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginVertical: 8,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: Colors.gray[100],
    width: "90%",
  },
  periodText: {
    fontSize: 17,
    color: Colors.gray[700],
    fontWeight: "500",
  },
  selectedPeriod: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedPeriodText: {
    color: Colors.white,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  nowButton: {
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
  nowButtonText: {
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

export default TimePickerCustom;
