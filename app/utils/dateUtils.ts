import { Task } from "../context/TaskContext";

export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const formatDateForDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const getDayName = (date: Date): string => {
  return date.toLocaleDateString(undefined, { weekday: "short" });
};

export const getMonthName = (date: Date): string => {
  return date.toLocaleDateString("en-US", { month: "long" });
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

export const getTasksForDate = (tasks: Task[], date: Date): Task[] => {
  const dateString = formatDate(date);
  return tasks.filter((task) => task.dueDate === dateString);
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const sortTasksByDueDate = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    const dateA = new Date(`${a.dueDate}T${a.dueTime || "00:00"}`);
    const dateB = new Date(`${b.dueDate}T${b.dueTime || "00:00"}`);
    return dateA.getTime() - dateB.getTime();
  });
};

export const getUpcomingTasks = (tasks: Task[], count: number = 3): Task[] => {
  const today = formatDate(new Date());
  const pendingTasks = tasks.filter(
    (task) => !task.isCompleted && task.dueDate >= today,
  );
  return sortTasksByDueDate(pendingTasks).slice(0, count);
};

export const getRemainingTime = (dueDate: string, dueTime?: string): string => {
  const now = new Date();
  const due = new Date(`${dueDate}T${dueTime || "23:59"}`);

  if (due < now) {
    return "Overdue";
  }

  const diffTime = Math.abs(due.getTime() - now.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Due today";
  } else if (diffDays === 1) {
    return "Due tomorrow";
  } else {
    return `Due in ${diffDays} days`;
  }
};

// Add default export to satisfy expo-router
export default function DateUtils() {
  // This is just a dummy component to satisfy expo-router's requirements
  // It's not meant to be used directly
  return null;
}
