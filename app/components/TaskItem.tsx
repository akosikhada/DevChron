import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Task } from "../context/TaskContext";
import { formatDateForDisplay, getRemainingTime } from "../utils/dateUtils";
import Colors from "../constants/Colors";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;

interface TaskItemProps {
  task: Task;
  onPress: (taskId: string) => void;
  onComplete: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onPress, onComplete }) => {
  const priorityColors = {
    low: "#4CAF50",
    medium: "#FFC107",
    high: "#FF6B6B",
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "work":
        return "briefcase-outline";
      case "personal":
        return "person-outline";
      case "shopping":
        return "cart-outline";
      case "health":
        return "fitness-outline";
      default:
        return "folder-outline";
    }
  };

  // Get the time component in a readable format
  const formatTimeDisplay = (timeString: string) => {
    if (!timeString) return "";
    
    const [hours, minutes] = timeString.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  // Check if the task is due today
  const isToday = () => {
    const today = new Date();
    const taskDate = new Date(task.dueDate);
    
    return (
      today.getDate() === taskDate.getDate() &&
      today.getMonth() === taskDate.getMonth() &&
      today.getFullYear() === taskDate.getFullYear()
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.container, 
        task.isCompleted && styles.containerCompleted
      ]}
      onPress={() => onPress(task.id)}
      activeOpacity={0.7}
    >
      <TouchableOpacity
        style={[
          styles.checkbox,
          task.isCompleted && styles.checkboxChecked,
        ]}
        onPress={() => onComplete(task.id)}
        activeOpacity={0.7}
      >
        {task.isCompleted && (
          <Ionicons name="checkmark" size={16} color="white" />
        )}
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text
            style={[
              styles.title, 
              task.isCompleted && styles.titleCompleted
            ]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
        </View>

        {task.description ? (
          <Text 
            style={[
              styles.description,
              task.isCompleted && styles.descriptionCompleted
            ]} 
            numberOfLines={1}
          >
            {task.description}
          </Text>
        ) : null}

        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Ionicons 
              name="calendar-outline" 
              size={14} 
              color={task.isCompleted ? Colors.gray[400] : Colors.primary} 
              style={styles.metaIcon}
            />
            <Text style={styles.metaText}>
              {isToday() ? "Today" : formatDateForDisplay(task.dueDate)}
            </Text>
          </View>

          {task.dueTime && (
            <View style={styles.metaItem}>
              <Ionicons 
                name="time-outline" 
                size={14} 
                color={task.isCompleted ? Colors.gray[400] : Colors.primary} 
                style={styles.metaIcon}
              />
              <Text style={styles.metaText}>
                {formatTimeDisplay(task.dueTime)}
              </Text>
            </View>
          )}

          {task.category && (
            <View style={styles.metaItem}>
              <Ionicons 
                name={getCategoryIcon(task.category)} 
                size={14} 
                color={task.isCompleted ? Colors.gray[400] : Colors.primary} 
                style={styles.metaIcon}
              />
              <Text style={styles.metaText}>
                {task.category}
              </Text>
            </View>
          )}
        </View>

        {!task.isCompleted && (
          <View style={styles.footerContainer}>
            <View 
              style={[
                styles.priorityBadge, 
                { backgroundColor: priorityColors[task.priority] + '15' }
              ]}
            >
              <View 
                style={[
                  styles.priorityDot, 
                  { backgroundColor: priorityColors[task.priority] }
                ]} 
              />
              <Text 
                style={[
                  styles.priorityText, 
                  { color: priorityColors[task.priority] }
                ]}
              >
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Text>
            </View>

            <Text
              style={[
                styles.remainingText,
                getRemainingTime(task.dueDate, task.dueTime).includes("Overdue") && 
                styles.overdue,
              ]}
            >
              {getRemainingTime(task.dueDate, task.dueTime)}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    flexDirection: "row",
    borderRadius: 16,
    backgroundColor: Colors.white,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  containerCompleted: {
    opacity: 0.8,
    backgroundColor: Colors.gray[50],
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  title: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: "600",
    color: Colors.gray[800],
    flex: 1,
  },
  titleCompleted: {
    color: Colors.gray[500],
    textDecorationLine: "line-through",
  },
  checkbox: {
    height: 24,
    width: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  description: {
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 10,
  },
  descriptionCompleted: {
    color: Colors.gray[400],
    textDecorationLine: "line-through",
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 4,
  },
  metaIcon: {
    marginRight: 4,
  },
  metaText: {
    fontSize: 13,
    color: Colors.gray[600],
  },
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "600",
  },
  remainingText: {
    fontSize: 12,
    color: Colors.gray[500],
    fontStyle: "italic",
  },
  overdue: {
    color: "#FF6B6B",
    fontWeight: "500",
  },
});

export default TaskItem;
