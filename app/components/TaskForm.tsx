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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Task } from "../context/TaskContext";
import { formatDate } from "../utils/dateUtils";

interface TaskFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, "id" | "createdAt">) => void;
  initialValues?: Task;
}

const CATEGORY_OPTIONS = [
  { id: "work", label: "Work", icon: "briefcase-outline" },
  { id: "personal", label: "Personal", icon: "home-outline" },
  { id: "shopping", label: "Shopping", icon: "cart-outline" },
  { id: "health", label: "Health", icon: "heart-outline" },
  { id: "other", label: "Others", icon: "ellipsis-horizontal-outline" },
];

const TaskForm: React.FC<TaskFormProps> = ({
  visible,
  onClose,
  onSave,
  initialValues,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(formatDate(new Date()));
  const [dueTime, setDueTime] = useState("09:30");
  const [category, setCategory] = useState("work");
  const [location, setLocation] = useState("");

  // Set initial values if editing an existing task
  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title);
      setDescription(initialValues.description);
      setDueDate(initialValues.dueDate);
      setDueTime(initialValues.dueTime);
      setCategory(initialValues.category);
      setLocation(initialValues.location || "");
    } else {
      // Reset form for new task
      setTitle("");
      setDescription("");
      setDueDate(formatDate(new Date()));
      setDueTime("09:30");
      setCategory("work");
      setLocation("");
    }
  }, [initialValues, visible]);

  const handleSave = () => {
    if (!title.trim()) {
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      dueDate,
      dueTime,
      priority: "medium", // Default priority
      category,
      location,
      isCompleted: initialValues ? initialValues.isCompleted : false,
    });

    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-white">
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <TouchableOpacity onPress={onClose}>
            <Text className="text-gray-500 text-base">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold">
            {initialValues ? "Edit Task" : "New Task"}
          </Text>
          <TouchableOpacity onPress={handleSave}>
            <Text className="text-[#6366F1] text-base font-semibold">Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          <TextInput
            className="text-xl font-semibold mb-6 text-gray-800"
            value={title}
            onChangeText={setTitle}
            placeholder="Task Title"
            placeholderTextColor="#A0A0A0"
          />

          <TouchableOpacity className="flex-row items-center mb-6">
            <View className="w-8 h-8 rounded-full bg-[#EEF2FF] items-center justify-center mr-2">
              <Ionicons name="happy-outline" size={20} color="#6366F1" />
            </View>
            <Text className="text-gray-500">Add emoji</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-200">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-[#EEF2FF] items-center justify-center mr-2">
                <Ionicons name="calendar-outline" size={20} color="#6366F1" />
              </View>
              <Text className="text-gray-800">{dueDate}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-200">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-[#EEF2FF] items-center justify-center mr-2">
                <Ionicons name="folder-outline" size={20} color="#6366F1" />
              </View>
              <Text className="text-gray-800">Select Category</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
          </TouchableOpacity>

          <View className="flex-row flex-wrap mt-4 mb-6">
            {CATEGORY_OPTIONS.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                className={`mr-2 mb-2 flex-row items-center px-4 py-3 rounded-md border ${
                  category === cat.id
                    ? "border-[#6366F1] bg-[#EEF2FF]"
                    : "border-gray-200"
                }`}
                onPress={() => setCategory(cat.id)}
              >
                <Ionicons
                  name={cat.icon as any}
                  size={18}
                  color={category === cat.id ? "#6366F1" : "#A0A0A0"}
                  style={{ marginRight: 8 }}
                />
                <Text
                  className={`${
                    category === cat.id ? "text-[#6366F1]" : "text-gray-800"
                  }`}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            className="bg-gray-50 rounded-lg p-4 min-h-[120px] text-gray-800"
            value={description}
            onChangeText={setDescription}
            placeholder="Add notes..."
            placeholderTextColor="#A0A0A0"
            multiline
            textAlignVertical="top"
          />
        </ScrollView>
      </View>
    </Modal>
  );
};

export default TaskForm;
