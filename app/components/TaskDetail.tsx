import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Task } from "../context/TaskContext";
import { formatDateForDisplay } from "../utils/dateUtils";
import Colors from "../constants/Colors";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;

interface TaskDetailProps {
  visible: boolean;
  onClose: () => void;
  task: Task | null | undefined;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({
  visible,
  onClose,
  task,
  onEdit,
  onDelete,
}) => {
  if (!task) return null;

  const statusBarHeight = StatusBar.currentHeight || 0;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "work":
        return "briefcase-outline";
      case "personal":
        return "home-outline";
      case "shopping":
        return "cart-outline";
      case "health":
        return "heart-outline";
      default:
        return "folder-outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#FF6B6B";
      case "medium":
        return "#FFC107";
      case "low":
        return "#4CAF50";
      default:
        return "#FFC107";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "High Priority";
      case "medium":
        return "Medium Priority";
      case "low":
        return "Low Priority";
      default:
        return "Medium Priority";
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "";

    const [hours, minutes] = timeString.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;

    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const GREEN = "#4CAF50";

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView
        style={[
          styles.container,
          { paddingTop: Platform.OS === "android" ? statusBarHeight : 0 },
        ]}
      >
        <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />

        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Task Details</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.cardContainer}>
            {/* Title and Category Section */}
            <View style={styles.titleSection}>
              <View
                style={[
                  styles.priorityBadge,
                  { backgroundColor: getPriorityColor(task.priority) + "20" },
                ]}
              >
                <View
                  style={[
                    styles.priorityDot,
                    { backgroundColor: getPriorityColor(task.priority) },
                  ]}
                />
                <Text
                  style={[
                    styles.priorityText,
                    { color: getPriorityColor(task.priority) },
                  ]}
                >
                  {getPriorityLabel(task.priority)}
                </Text>
              </View>

              <Text style={styles.taskTitle}>{task.title}</Text>

              <View style={styles.categoryContainer}>
                <View style={styles.categoryBadge}>
                  <Ionicons
                    name={getCategoryIcon(task.category)}
                    size={18}
                    color={Colors.primary}
                  />
                  <Text style={styles.categoryText}>{task.category}</Text>
                </View>
              </View>
            </View>

            {/* Time and Date Section */}
            <View style={styles.infoCard}>
              <View style={styles.infoCardRow}>
                <View style={styles.infoIconContainer}>
                  <Ionicons
                    name="calendar-outline"
                    size={22}
                    color={Colors.primary}
                  />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Due Date</Text>
                  <Text style={styles.infoValue}>
                    {formatDateForDisplay(task.dueDate)}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoCardRow}>
                <View style={styles.infoIconContainer}>
                  <Ionicons
                    name="time-outline"
                    size={22}
                    color={Colors.primary}
                  />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Due Time</Text>
                  <Text style={styles.infoValue}>
                    {formatTime(task.dueTime)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Location Section (if available) */}
            {task.location && (
              <View style={styles.infoCard}>
                <View style={styles.infoCardRow}>
                  <View style={styles.infoIconContainer}>
                    <Ionicons
                      name="location-outline"
                      size={22}
                      color={Colors.primary}
                    />
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Location</Text>
                    <Text style={styles.infoValue}>{task.location}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Status Section */}
            <View style={styles.infoCard}>
              <View style={styles.infoCardRow}>
                <View style={styles.infoIconContainer}>
                  <Ionicons
                    name={
                      task.isCompleted ? "checkmark-circle" : "ellipse-outline"
                    }
                    size={22}
                    color={task.isCompleted ? GREEN : Colors.primary}
                  />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Status</Text>
                  <Text
                    style={[
                      styles.infoValue,
                      { color: task.isCompleted ? GREEN : Colors.gray[700] },
                    ]}
                  >
                    {task.isCompleted ? "Completed" : "Pending"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Notes Section */}
            <View style={styles.notesSection}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <View style={styles.notesContainer}>
                {task.description ? (
                  <Text style={styles.notesText}>{task.description}</Text>
                ) : (
                  <Text style={styles.emptyNotesText}>
                    No notes added for this task.
                  </Text>
                )}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editActionButton]}
            onPress={() => onEdit(task.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="create-outline"
              size={22}
              color={Colors.white}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.actionButtonText}>Edit Task</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteActionButton]}
            onPress={() => onDelete(task.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="trash-outline"
              size={22}
              color={Colors.white}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.actionButtonText}>Delete Task</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.gray[800],
  },
  backButton: {
    padding: 4,
  },
  headerRightPlaceholder: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  cardContainer: {
    padding: 16,
  },
  titleSection: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 40,
    marginBottom: 12,
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: "600",
  },
  taskTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.gray[800],
    marginBottom: 16,
    lineHeight: 30,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary + "15",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 40,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
    textTransform: "capitalize",
    marginLeft: 6,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoCardRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.gray[500],
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.gray[800],
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray[200],
    marginVertical: 12,
  },
  notesSection: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 100, // Extra space for the bottom buttons
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.gray[800],
    marginBottom: 12,
  },
  notesContainer: {
    backgroundColor: Colors.gray[50],
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
  },
  notesText: {
    fontSize: 15,
    color: Colors.gray[700],
    lineHeight: 22,
  },
  emptyNotesText: {
    fontSize: 15,
    color: Colors.gray[500],
    fontStyle: "italic",
  },
  actionButtonsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 6,
  },
  editActionButton: {
    backgroundColor: Colors.primary,
  },
  deleteActionButton: {
    backgroundColor: "#FF6B6B",
  },
  actionButtonText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 16,
  },
});

export default TaskDetail;
