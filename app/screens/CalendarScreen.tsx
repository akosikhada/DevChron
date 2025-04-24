import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
  StyleSheet,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useTaskContext } from "../context/TaskContext";
import {
  getTasksForDate,
  formatDate,
  formatDateForDisplay,
} from "../utils/dateUtils";
import { Task } from "../context/TaskContext";
import Calendar from "../components/Calendar";
import TaskFormModal from "../components/TaskFormModal";
import TaskDetail from "../components/TaskDetail";
import Colors from "../constants/Colors";
import Header from "../components/Header";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;

// Mood data structure
type Mood = {
  emoji: string;
  label: string;
  color: string;
};

const MOODS: Mood[] = [
  { emoji: "😀", label: "Happy", color: "#FFD700" },
  { emoji: "😌", label: "Calm", color: "#90EE90" },
  { emoji: "😐", label: "Neutral", color: "#E0E0E0" },
  { emoji: "😔", label: "Sad", color: "#ADD8E6" },
  { emoji: "😡", label: "Angry", color: "#FF6347" },
];

// Format date for storage keys
const formatDateKey = (date: Date): string => {
  return formatDate(date);
};

interface TaskItemProps {
  task: Task;
  onPress: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onPress }) => {
  const priorityColors = {
    low: "#4CAF50",
    medium: "#FFC107",
    high: "#FF6B6B",
  };

  // Get category icon based on category name
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

  // Format time display
  const formatTimeDisplay = (timeString: string) => {
    if (!timeString) return "";

    const [hours, minutes] = timeString.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;

    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <TouchableOpacity
      style={[styles.taskItem, task.isCompleted && styles.taskItemCompleted]}
      onPress={() => onPress(task)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.priorityIndicator,
          { backgroundColor: priorityColors[task.priority] },
        ]}
      />

      <View style={styles.taskContent}>
        <View style={styles.taskHeader}>
          <View style={styles.taskTitleContainer}>
            <Ionicons
              name={getCategoryIcon(task.category)}
              size={isSmallDevice ? 16 : 18}
              color={Colors.primary}
              style={{ marginRight: 8 }}
            />
            <Text
              style={[
                styles.taskTitle,
                task.isCompleted && styles.taskTitleCompleted,
              ]}
              numberOfLines={1}
            >
              {task.title}
            </Text>
          </View>

          <View style={styles.statusContainer}>
            {task.isCompleted ? (
              <View style={styles.completedBadge}>
                <Ionicons name="checkmark" size={12} color="#fff" />
                <Text style={styles.completedText}>Done</Text>
              </View>
            ) : (
              <Text style={styles.taskTime}>
                {formatTimeDisplay(task.dueTime)}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.taskMeta}>
          <View style={styles.metaItem}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={Colors.gray[500]}
              style={styles.metaIcon}
            />
            <Text style={styles.metaText}>
              {formatDateForDisplay(task.dueDate)}
            </Text>
          </View>

          {task.location && (
            <View style={styles.metaItem}>
              <Ionicons
                name="location-outline"
                size={14}
                color={Colors.gray[500]}
                style={styles.metaIcon}
              />
              <Text style={styles.metaText} numberOfLines={1}>
                {task.location}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const CalendarScreen: React.FC = () => {
  const statusBarHeight = StatusBar.currentHeight || 0;
  const { tasks, addTask, updateTask, deleteTask, completeTask } =
    useTaskContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isTaskFormVisible, setIsTaskFormVisible] = useState(false);
  const [isTaskDetailVisible, setIsTaskDetailVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  // Mood tracking state
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const tasksForSelectedDate = getTasksForDate(tasks, selectedDate);

  // Limit the tasks for display
  const limitedTasksForDisplay = tasksForSelectedDate.slice(0, 3);
  const hasMoreTasks = tasksForSelectedDate.length > 3;

  // Load saved mood for selected date
  useEffect(() => {
    const loadMood = async () => {
      try {
        const dateKey = formatDateKey(selectedDate);
        const savedMood = await AsyncStorage.getItem(`mood_${dateKey}`);
        if (savedMood) {
          setSelectedMood(JSON.parse(savedMood));
        } else {
          setSelectedMood(null);
        }
      } catch (error) {
        console.error("Failed to load mood:", error);
        setSelectedMood(null);
      }
    };

    loadMood();
  }, [selectedDate]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsTaskFormVisible(true);
  };

  const handleTaskPress = (task: Task) => {
    setSelectedTask(task.id);
    setIsTaskDetailVisible(true);
  };

  const handleEditTask = (taskId: string) => {
    setIsTaskDetailVisible(false);
    setTimeout(() => {
      setIsTaskFormVisible(true);
    }, 300);
  };

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteModalVisible(true);
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setIsDeleteModalVisible(false);
      setIsTaskDetailVisible(false);
      setTaskToDelete(null);
    }
  };

  const handleCloseTaskForm = () => {
    setIsTaskFormVisible(false);
    if (!isTaskDetailVisible) {
      setSelectedTask(null);
    }
  };

  const handleCloseTaskDetail = () => {
    setIsTaskDetailVisible(false);
    setSelectedTask(null);
  };

  const handleSaveTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    if (selectedTask) {
      updateTask(selectedTask, taskData);
    } else {
      addTask({
        ...taskData,
        dueDate: taskData.dueDate || formatDate(selectedDate),
      });
    }
    setIsTaskFormVisible(false);
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    // In a real app with a backend, we would fetch new data here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Handle mood selection
  const handleMoodSelect = async (mood: Mood) => {
    setSelectedMood(mood);
    try {
      const dateKey = formatDateKey(selectedDate);
      await AsyncStorage.setItem(`mood_${dateKey}`, JSON.stringify(mood));
    } catch (error) {
      console.error("Failed to save mood:", error);
    }
  };

  const selectedTaskData = selectedTask
    ? tasks.find((task) => task.id === selectedTask)
    : null;

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No tasks for this day</Text>
      <Text style={styles.emptySubtitle}>Tap the + button to add a task</Text>
    </View>
  );

  // Format date for display
  const formatSelectedDate = () => {
    const today = new Date();
    const isToday =
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear();

    if (isToday) {
      return "Today";
    }

    return selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: Platform.OS === "android" ? 0 : 0,
        },
      ]}
    >
      <Header
        title="Calendar"
        titleIcon="calendar"
        showBackButton={false}
        rightIcon={undefined}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Calendar
          tasks={tasks}
          onDateSelect={handleDateSelect}
          selectedDate={selectedDate}
        />

        <View style={styles.tasksContainer}>
          <Text style={styles.tasksTitle}>{formatSelectedDate()}'s Tasks</Text>

          {tasksForSelectedDate.length === 0 ? (
            renderEmptyList()
          ) : (
            <>
              <FlatList
                data={limitedTasksForDisplay}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TaskItem task={item} onPress={handleTaskPress} />
                )}
                contentContainerStyle={{
                  paddingBottom: 16,
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                  />
                }
                scrollEnabled={false}
              />

              {hasMoreTasks && (
                <TouchableOpacity
                  style={styles.viewAllButton}
                  onPress={() => {
                    console.log("View all tasks for", selectedDate);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.viewAllText}>
                    View all {tasksForSelectedDate.length} tasks
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
              )}
            </>
          )}

          {/* Mood Tracker */}
          <View style={styles.moodTrackerContainer}>
            <Text style={styles.moodTitle}>How are you feeling today?</Text>
            <View style={styles.moodOptions}>
              {MOODS.map((mood, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleMoodSelect(mood)}
                  style={[
                    styles.moodOption,
                    selectedMood?.label === mood.label && {
                      backgroundColor: mood.color + "40",
                      borderColor: mood.color,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={styles.moodLabel}>{mood.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedMood && (
              <View
                style={[
                  styles.selectedMoodDisplay,
                  { backgroundColor: selectedMood.color + "20" },
                ]}
              >
                <Text style={styles.selectedMoodText}>
                  You're feeling{" "}
                  <Text style={{ fontWeight: "600" }}>
                    {selectedMood.label.toLowerCase()}
                  </Text>{" "}
                  {selectedMood.emoji}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingActionButton}
        onPress={handleAddTask}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <TaskFormModal
        visible={isTaskFormVisible}
        onClose={handleCloseTaskForm}
        onSave={handleSaveTask}
        initialValues={selectedTaskData || undefined}
        onDelete={deleteTask}
      />

      <TaskDetail
        visible={isTaskDetailVisible}
        onClose={handleCloseTaskDetail}
        task={selectedTaskData}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />

      <DeleteConfirmationModal
        visible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onDelete={confirmDeleteTask}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
  },
  tasksContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  tasksTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  taskItem: {
    marginBottom: 16,
    flexDirection: "row",
    borderRadius: 12,
    backgroundColor: Colors.white,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: "hidden",
  },
  taskItemCompleted: {
    opacity: 0.8,
    backgroundColor: Colors.gray[50],
  },
  priorityIndicator: {
    width: 4,
    alignSelf: "stretch",
    marginRight: 12,
    borderRadius: 2,
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  taskTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  taskTitle: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: "600",
    color: Colors.gray[800],
    flex: 1,
  },
  taskTitleCompleted: {
    color: Colors.gray[500],
    textDecorationLine: "line-through",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  completedText: {
    fontSize: 12,
    color: "#fff",
    marginLeft: 2,
  },
  taskTime: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.primary,
  },
  taskMeta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
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
  taskDate: {
    color: Colors.gray[500],
    marginRight: 16,
    fontSize: 14,
  },
  taskSeparator: {
    color: Colors.gray[400],
    marginHorizontal: 8,
  },
  taskLocation: {
    color: Colors.gray[500],
    fontSize: 14,
  },
  emptyContainer: {
    marginTop: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  emptyTitle: {
    color: Colors.gray[500],
    marginBottom: 8,
    fontSize: 18,
    fontWeight: "500",
  },
  emptySubtitle: {
    color: Colors.gray[400],
    fontSize: 16,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginTop: 8,
    backgroundColor: Colors.primary + "10",
    borderRadius: 12,
  },
  viewAllText: {
    color: Colors.primary,
    fontWeight: "600",
    fontSize: 15,
    marginRight: 6,
  },
  // Mood tracker styles
  moodTrackerContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  moodTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: Colors.gray[800],
    textAlign: "center",
  },
  moodOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  moodOption: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.gray[200],
    width: width / 5 - 16,
    marginBottom: 8,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 12,
    color: Colors.gray[700],
    textAlign: "center",
  },
  selectedMoodDisplay: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  selectedMoodText: {
    fontSize: 14,
    color: Colors.gray[800],
  },
  floatingActionButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: Colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default CalendarScreen;
