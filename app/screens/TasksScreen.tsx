import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Platform,
  Dimensions,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTaskContext } from "../context/TaskContext";
import TaskItem from "../components/TaskItem";
import FAB from "../components/FAB";
import TaskFormModal from "../components/TaskFormModal";
import Colors from "../constants/Colors";
import Header from "../components/Header";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;

const FilterOptions = ["All", "Pending", "Completed"] as const;
type FilterOption = (typeof FilterOptions)[number];

const SortOptions = ["Due Date", "Priority", "Created"] as const;
type SortOption = (typeof SortOptions)[number];

const TasksScreen: React.FC = () => {
  const { tasks, addTask, completeTask, updateTask, deleteTask } =
    useTaskContext();
  const [isTaskFormVisible, setIsTaskFormVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [filterOption, setFilterOption] = useState<FilterOption>("All");
  const [sortOption, setSortOption] = useState<SortOption>("Due Date");
  const [refreshing, setRefreshing] = useState(false);
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  // Filter tasks based on selected option
  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filterOption === "All" ||
      (filterOption === "Pending" && !task.isCompleted) ||
      (filterOption === "Completed" && task.isCompleted);

    return matchesFilter;
  });

  // Sort tasks based on selected option
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOption === "Due Date") {
      return (
        new Date(a.dueDate + "T" + (a.dueTime || "00:00")).getTime() -
        new Date(b.dueDate + "T" + (b.dueTime || "00:00")).getTime()
      );
    } else if (sortOption === "Priority") {
      const priorityValue = { high: 0, medium: 1, low: 2 };
      return priorityValue[a.priority] - priorityValue[b.priority];
    } else {
      // Created
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsEditMode(false);
    setIsTaskFormVisible(true);
  };

  const handleTaskPress = (taskId: string) => {
    setSelectedTask(taskId);
    setIsActionModalVisible(true);
  };

  const handleEditTask = () => {
    setIsActionModalVisible(false);
    setIsEditMode(true);
    setTimeout(() => {
      setIsTaskFormVisible(true);
    }, 300);
  };

  const handleDeleteTask = () => {
    if (selectedTask) {
      setIsActionModalVisible(false);
      setTimeout(() => {
        setIsDeleteModalVisible(true);
      }, 300);
    }
  };

  const confirmDeleteTask = () => {
    if (selectedTask) {
      deleteTask(selectedTask);
      setIsDeleteModalVisible(false);
    }
  };

  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId);
  };

  const handleCloseTaskForm = () => {
    setIsTaskFormVisible(false);
    setSelectedTask(null);
    setIsEditMode(false);
  };

  const handleCloseActionModal = () => {
    setIsActionModalVisible(false);
    setSelectedTask(null);
  };

  const handleSaveTask = (taskData: any) => {
    if (isEditMode && selectedTask) {
      updateTask(selectedTask, taskData);
    } else {
      addTask(taskData);
    }
    setIsTaskFormVisible(false);
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const selectedTaskData = selectedTask
    ? tasks.find((task) => task.id === selectedTask)
    : undefined;

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

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="clipboard-outline" size={60} color={Colors.gray[300]} />
      </View>
      <Text style={styles.emptyTitle}>No tasks found</Text>
      <Text style={styles.emptySubtitle}>Tap the + button to add a task</Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={handleAddTask}
        activeOpacity={0.7}
      >
        <Ionicons name="add" size={20} color={Colors.white} />
        <Text style={styles.emptyButtonText}>Create New Task</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Tasks"
        titleIcon={undefined}
        showBackButton={false}
        rightIcon={undefined}
      />

      <View style={styles.infoBar}>
        <Text style={styles.taskCount}>
          {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"}
        </Text>
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          <TouchableOpacity
            style={[
              styles.filterPill,
              filterOption === "All" && styles.filterPillActive,
            ]}
            onPress={() => setFilterOption("All")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="list-outline"
              size={16}
              color={filterOption === "All" ? Colors.white : Colors.gray[600]}
              style={styles.filterIcon}
            />
            <Text
              style={[
                styles.filterPillText,
                filterOption === "All" && styles.filterPillTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              filterOption === "Pending" && styles.filterPillActive,
            ]}
            onPress={() => setFilterOption("Pending")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="time-outline"
              size={16}
              color={
                filterOption === "Pending" ? Colors.white : Colors.gray[600]
              }
              style={styles.filterIcon}
            />
            <Text
              style={[
                styles.filterPillText,
                filterOption === "Pending" && styles.filterPillTextActive,
              ]}
            >
              Pending
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              filterOption === "Completed" && styles.filterPillActive,
            ]}
            onPress={() => setFilterOption("Completed")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={16}
              color={
                filterOption === "Completed" ? Colors.white : Colors.gray[600]
              }
              style={styles.filterIcon}
            />
            <Text
              style={[
                styles.filterPillText,
                filterOption === "Completed" && styles.filterPillTextActive,
              ]}
            >
              Completed
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, { borderStyle: "dashed" }]}
            onPress={() => {
              // Cycle through sort options
              const currentIndex = SortOptions.indexOf(sortOption);
              const nextIndex = (currentIndex + 1) % SortOptions.length;
              setSortOption(SortOptions[nextIndex]);
            }}
            activeOpacity={0.7}
          >
            <Ionicons
              name="calendar-outline"
              size={16}
              color={Colors.primary}
              style={styles.filterIcon}
            />
            <Text style={[styles.filterPillText, { color: Colors.primary }]}>
              {sortOption}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <FlatList
        data={sortedTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onPress={handleTaskPress}
            onComplete={handleCompleteTask}
          />
        )}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingBottom: Platform.OS === "ios" ? 120 : 80,
          paddingTop: 8,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <FAB onPress={handleAddTask} />

      <TaskFormModal
        visible={isTaskFormVisible}
        onClose={handleCloseTaskForm}
        onSave={handleSaveTask}
        onDelete={deleteTask}
        initialValues={selectedTaskData}
      />

      {/* Task Action Modal */}
      <Modal
        visible={isActionModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseActionModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCloseActionModal}
        >
          <View style={styles.actionModalContainer}>
            {selectedTaskData && (
              <>
                <View style={styles.taskModalContent}>
                  <Text style={styles.actionModalTitle}>Task Actions</Text>
                  <Text style={styles.taskModalTitle}>
                    {selectedTaskData.title}
                  </Text>

                  <View style={styles.actionsGrid}>
                    <TouchableOpacity
                      style={styles.actionCard}
                      onPress={handleEditTask}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.actionIconContainer,
                          { backgroundColor: Colors.primary },
                        ]}
                      >
                        <Ionicons
                          name="create-outline"
                          size={26}
                          color={Colors.white}
                        />
                      </View>
                      <Text style={styles.actionCardTitle}>Edit</Text>
                      <Text style={styles.actionCardDescription}>
                        Modify task details
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionCard}
                      onPress={() => {
                        handleCompleteTask(selectedTaskData.id);
                        handleCloseActionModal();
                      }}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.actionIconContainer,
                          { backgroundColor: "#4CAF50" },
                        ]}
                      >
                        <Ionicons
                          name={
                            selectedTaskData.isCompleted
                              ? "refresh-outline"
                              : "checkmark-outline"
                          }
                          size={26}
                          color={Colors.white}
                        />
                      </View>
                      <Text style={styles.actionCardTitle}>
                        {selectedTaskData.isCompleted
                          ? "Mark Incomplete"
                          : "Complete"}
                      </Text>
                      <Text style={styles.actionCardDescription}>
                        {selectedTaskData.isCompleted
                          ? "Set as pending task"
                          : "Mark as completed"}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionCard}
                      onPress={handleDeleteTask}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.actionIconContainer,
                          { backgroundColor: "#FF6B6B" },
                        ]}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={26}
                          color={Colors.white}
                        />
                      </View>
                      <Text style={styles.actionCardTitle}>Delete</Text>
                      <Text style={styles.actionCardDescription}>
                        Remove this task
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionCard}
                      onPress={handleCloseActionModal}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.actionIconContainer,
                          { backgroundColor: Colors.gray[400] },
                        ]}
                      >
                        <Ionicons
                          name="close-outline"
                          size={26}
                          color={Colors.white}
                        />
                      </View>
                      <Text style={styles.actionCardTitle}>Cancel</Text>
                      <Text style={styles.actionCardDescription}>
                        Close this menu
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

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
  infoBar: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskCount: {
    fontSize: 14,
    color: Colors.gray[500],
    fontWeight: "500",
  },
  filtersContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterScrollContent: {
    paddingRight: 16,
    flexDirection: "row",
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray[100],
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
  },
  filterIcon: {
    marginRight: 6,
  },
  filterPillText: {
    fontWeight: "500",
    fontSize: 14,
    color: Colors.gray[600],
  },
  filterPillTextActive: {
    color: Colors.white,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.gray[50],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  emptyTitle: {
    color: Colors.gray[700],
    marginBottom: 8,
    fontSize: 20,
    fontWeight: "600",
  },
  emptySubtitle: {
    color: Colors.gray[500],
    fontSize: 16,
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 22,
  },
  emptyButton: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  actionModalContainer: {
    backgroundColor: "transparent",
    width: "100%",
  },
  taskModalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  actionModalTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.gray[500],
    marginBottom: 8,
    textAlign: "center",
  },
  taskModalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.gray[800],
    marginBottom: 20,
    textAlign: "center",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: -8,
  },
  actionCard: {
    width: "46%",
    backgroundColor: Colors.gray[50],
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: "2%",
    alignItems: "center",
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  actionCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.gray[800],
    marginBottom: 4,
    textAlign: "center",
  },
  actionCardDescription: {
    fontSize: 12,
    color: Colors.gray[500],
    textAlign: "center",
  },
});

export default TasksScreen;
