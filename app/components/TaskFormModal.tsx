import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Dimensions,
  Alert,
  StatusBar,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Task } from "../context/TaskContext";
import { formatDate, formatDateForDisplay } from "../utils/dateUtils";
import Colors from "../constants/Colors";
import DatePickerCustom from "./DatePickerCustom";
import TimePickerCustom from "./TimePickerCustom";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;

interface TaskFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, "id" | "createdAt">) => void;
  onDelete?: (taskId: string) => void;
  initialValues?: Task;
}

const PRIORITY_OPTIONS = [
  { id: "low", label: "Low", color: "#4CAF50" },
  { id: "medium", label: "Medium", color: "#FFC107" },
  { id: "high", label: "High", color: "#FF6B6B" },
];

const CATEGORY_OPTIONS = [
  { id: "work", label: "Work", icon: "briefcase-outline" },
  { id: "personal", label: "Personal", icon: "home-outline" },
  { id: "shopping", label: "Shopping", icon: "cart-outline" },
  { id: "health", label: "Health", icon: "heart-outline" },
  { id: "other", label: "Others", icon: "ellipsis-horizontal-outline" },
];

const TaskFormModal: React.FC<TaskFormModalProps> = ({
  visible,
  onClose,
  onSave,
  onDelete,
  initialValues,
}) => {
  // Animation value
  const [fadeAnim] = useState(new Animated.Value(0));
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(formatDate(new Date()));
  const [dueTime, setDueTime] = useState("09:30");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("work");
  const [location, setLocation] = useState("");

  // Date picker state
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState("");

  // Fade in animation when modal becomes visible
  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible]);

  // Set initial values if editing an existing task
  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title);
      setDescription(initialValues.description || "");
      setDueDate(initialValues.dueDate);
      setDueTime(initialValues.dueTime || "09:30");
      setPriority(initialValues.priority || "medium");
      setCategory(initialValues.category || "work");
      setLocation(initialValues.location || "");

      // Parse date and time for the date picker
      if (initialValues.dueDate) {
        const [year, month, day] = initialValues.dueDate.split("-").map(Number);
        const date = new Date();
        date.setFullYear(year, month - 1, day);

        if (initialValues.dueTime) {
          const [hours, minutes] = initialValues.dueTime.split(":").map(Number);
          date.setHours(hours, minutes);
        }

        setSelectedDate(date);
        setFormattedDate(formatDateForDisplay(initialValues.dueDate));
      }
    } else {
      // Reset form for new task
      setTitle("");
      setDescription("");
      const now = new Date();
      setDueDate(formatDate(now));
      setFormattedDate(formatDateForDisplay(formatDate(now)));

      // Set default time to the nearest half hour
      const roundedMinutes = Math.ceil(now.getMinutes() / 30) * 30;
      now.setMinutes(roundedMinutes % 60);
      if (roundedMinutes === 60) {
        now.setHours(now.getHours() + 1);
      }

      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setDueTime(`${hours}:${minutes}`);

      setPriority("medium");
      setCategory("work");
      setLocation("");
      setSelectedDate(now);
    }
  }, [initialValues, visible]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("Missing Information", "Please enter a task title");
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      dueDate,
      dueTime,
      priority: priority as "medium" | "low" | "high",
      category,
      location: location.trim(),
      isCompleted: initialValues ? initialValues.isCompleted : false,
    });

    onClose();
  };

  const showDeleteConfirmation = () => {
    setDeleteAlertVisible(true);
  };

  const handleDelete = () => {
    if (initialValues && onDelete) {
      onDelete(initialValues.id);
      setDeleteAlertVisible(false);
      onClose();
    }
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    const formattedDateString = formatDate(date);
    setDueDate(formattedDateString);
    setFormattedDate(formatDateForDisplay(formattedDateString));
  };

  const handleTimeChange = (date: Date) => {
    setSelectedDate(date);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    setDueTime(`${hours}:${minutes}`);
  };

  const formattedTimeDisplay = () => {
    if (!dueTime) return "";

    const [hours, minutes] = dueTime.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM

    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteAlertVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDeleteAlertVisible(false)}
      >
        <View style={styles.deleteModalOverlay}>
          <View style={styles.deleteModalContainer}>
            <View style={styles.deleteIconContainer}>
              <Ionicons name="trash-outline" size={38} color="#FF6B6B" />
            </View>
            <Text style={styles.deleteModalTitle}>Delete Task</Text>
            <Text style={styles.deleteModalMessage}>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </Text>
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                style={styles.cancelDeleteButton}
                onPress={() => setDeleteAlertVisible(false)}
              >
                <Text style={styles.cancelDeleteButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmDeleteButton}
                onPress={handleDelete}
              >
                <Text style={styles.confirmDeleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            style={styles.headerButton}
          >
            <Ionicons name="close-outline" size={24} color={Colors.gray[600]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {initialValues ? "Edit Task" : "New Task"}
          </Text>
          <TouchableOpacity
            onPress={handleSave}
            activeOpacity={0.7}
            style={styles.saveButton}
          >
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        <Animated.ScrollView
          style={[styles.content, { opacity: fadeAnim }]}
          showsVerticalScrollIndicator={false}
        >
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Task Title"
            placeholderTextColor={Colors.gray[400]}
            autoFocus={!initialValues}
          />

          <View style={styles.sectionTitle}>
            <Ionicons
              name="flag-outline"
              size={18}
              color={Colors.gray[700]}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitleText}>Priority</Text>
          </View>

          <View style={styles.priorityContainer}>
            {PRIORITY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.priorityOption,
                  priority === option.id && {
                    borderColor: option.color,
                    borderWidth: 2,
                  },
                ]}
                onPress={() => setPriority(option.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.priorityDot,
                    { backgroundColor: option.color },
                  ]}
                />
                <Text
                  style={[
                    styles.priorityText,
                    priority === option.id && {
                      color: option.color,
                      fontWeight: "600",
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sectionTitle}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color={Colors.gray[700]}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitleText}>Date & Time</Text>
          </View>

          <View style={styles.dateTimeContainer}>
            <TouchableOpacity
              style={[
                styles.dateTimeButton,
                datePickerVisible && {
                  borderColor: Colors.primary,
                  borderWidth: 2,
                },
              ]}
              onPress={() => {
                setDatePickerVisible(!datePickerVisible);
                if (!datePickerVisible) {
                  setTimePickerVisible(false);
                }
              }}
              activeOpacity={0.7}
            >
              <View style={styles.dateTimeIconContainer}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={Colors.primary}
                />
              </View>
              <Text style={styles.dateTimeText}>
                {formattedDate || formatDateForDisplay(dueDate)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.dateTimeButton,
                timePickerVisible && {
                  borderColor: Colors.primary,
                  borderWidth: 2,
                },
              ]}
              onPress={() => {
                setTimePickerVisible(!timePickerVisible);
                if (!timePickerVisible) {
                  setDatePickerVisible(false);
                }
              }}
              activeOpacity={0.7}
            >
              <View style={styles.dateTimeIconContainer}>
                <Ionicons
                  name="time-outline"
                  size={20}
                  color={Colors.primary}
                />
              </View>
              <Text style={styles.dateTimeText}>{formattedTimeDisplay()}</Text>
            </TouchableOpacity>
          </View>

          {datePickerVisible && (
            <View style={styles.pickerContainer}>
              <DatePickerCustom
                selectedDate={selectedDate}
                onDateChange={(date) => {
                  handleDateChange(date);
                  setDatePickerVisible(false);
                }}
                onClose={() => setDatePickerVisible(false)}
              />
            </View>
          )}

          {timePickerVisible && (
            <View style={styles.pickerContainer}>
              <TimePickerCustom
                selectedTime={selectedDate}
                onTimeChange={(date) => {
                  handleTimeChange(date);
                  setTimePickerVisible(false);
                }}
                onClose={() => setTimePickerVisible(false)}
              />
            </View>
          )}

          <View style={styles.sectionTitle}>
            <Ionicons
              name="grid-outline"
              size={18}
              color={Colors.gray[700]}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitleText}>Category</Text>
          </View>

          <View style={styles.categoryContainer}>
            {CATEGORY_OPTIONS.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryOption}
                onPress={() => setCategory(cat.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.categoryIconContainer,
                    category === cat.id && {
                      borderWidth: 2,
                      borderColor: Colors.primary,
                      backgroundColor: "transparent",
                    },
                  ]}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={22}
                    color={
                      category === cat.id ? Colors.primary : Colors.gray[500]
                    }
                  />
                </View>
                <Text
                  style={[
                    styles.categoryText,
                    category === cat.id && {
                      color: Colors.primary,
                      fontWeight: "600",
                    },
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sectionTitle}>
            <Ionicons
              name="location-outline"
              size={18}
              color={Colors.gray[700]}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitleText}>Location</Text>
            <Text style={styles.optionalText}>(Optional)</Text>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="location-outline"
              size={20}
              color={Colors.primary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.locationInput}
              value={location}
              onChangeText={setLocation}
              placeholder="Add location"
              placeholderTextColor={Colors.gray[400]}
            />
          </View>

          <View style={styles.sectionTitle}>
            <Ionicons
              name="document-text-outline"
              size={18}
              color={Colors.gray[700]}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitleText}>Notes</Text>
            <Text style={styles.optionalText}>(Optional)</Text>
          </View>

          <View style={styles.notesInputContainer}>
            <TextInput
              style={styles.notesInput}
              value={description}
              onChangeText={setDescription}
              placeholder="Add notes for this task..."
              placeholderTextColor={Colors.gray[400]}
              multiline
              textAlignVertical="top"
              numberOfLines={4}
            />
          </View>

          {/* Add delete button at the bottom for existing tasks */}
          {initialValues && onDelete && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={showDeleteConfirmation}
              activeOpacity={0.7}
            >
              <Ionicons
                name="trash-outline"
                size={22}
                color="#FF6B6B"
                style={styles.deleteButtonIcon}
              />
              <Text style={styles.deleteButtonText}>Delete Task</Text>
            </TouchableOpacity>
          )}
        </Animated.ScrollView>
      </KeyboardAvoidingView>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    backgroundColor: Colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.gray[800],
    letterSpacing: 0.5,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
  },
  cancelText: {
    fontSize: 16,
    color: Colors.gray[600],
    fontWeight: "500",
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.primary + "15",
    borderRadius: 8,
  },
  saveText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
    color: Colors.gray[800],
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  sectionTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    marginTop: 16,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitleText: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.gray[800],
    letterSpacing: 0.3,
  },
  optionalText: {
    fontSize: 14,
    color: Colors.gray[500],
    marginLeft: 6,
    fontStyle: "italic",
  },
  priorityContainer: {
    flexDirection: "row",
    marginBottom: 24,
    justifyContent: "space-between",
  },
  priorityOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    flex: 1,
    marginHorizontal: 4,
    maxWidth: width / 3 - 16,
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  priorityDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 8,
  },
  priorityText: {
    fontSize: 15,
    color: Colors.gray[700],
    fontWeight: "500",
  },
  dateTimeContainer: {
    flexDirection: "row",
    marginBottom: 24,
    justifyContent: "space-between",
  },
  dateTimeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.gray[300],
    flex: 0.48,
  },
  dateTimeButtonActive: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  dateTimeIconContainer: {
    marginRight: 12,
  },
  dateTimeText: {
    fontSize: 16,
    color: Colors.gray[800],
    fontWeight: "500",
  },
  pickerContainer: {
    marginBottom: 20,
    alignItems: "center",
    width: "100%",
    backgroundColor: "transparent",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
    justifyContent: "space-between",
  },
  categoryOption: {
    alignItems: "center",
    width: width / 5 - 10,
    marginBottom: 16,
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.gray[300],
  },
  categoryOptionActive: {
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: 13,
    color: Colors.gray[700],
    textAlign: "center",
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 12,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  locationInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.gray[800],
  },
  notesInputContainer: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 12,
    marginBottom: 32,
    padding: 4,
  },
  notesInput: {
    padding: 12,
    minHeight: 120,
    fontSize: 16,
    color: Colors.gray[800],
    textAlignVertical: "top",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginTop: 20,
    marginBottom: 36,
    borderWidth: 2,
    borderColor: "#FF6B6B",
    borderStyle: "dashed",
    borderRadius: 12,
  },
  deleteButtonIcon: {
    marginRight: 12,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF6B6B",
  },
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  deleteModalContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    width: "90%",
    maxWidth: 340,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  deleteIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.gray[800],
    marginBottom: 12,
  },
  deleteModalMessage: {
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  deleteModalButtons: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  cancelDeleteButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  cancelDeleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.gray[700],
  },
  confirmDeleteButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#FF6B6B",
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  confirmDeleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});

export default TaskFormModal;
