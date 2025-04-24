import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Image,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import Colors from "../constants/Colors";

const AboutScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const cardWidth = width * 0.42;

  const openGitHub = () => {
    Linking.openURL("https://github.com/akosikhada");
  };

  const openWebsite = () => {
    Linking.openURL("https://akosikhada.vercel.app");
  };

  const contactSupport = () => {
    Linking.openURL("mailto:support@devchron.app");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Header title="About" titleIcon="information-circle" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoBackground}>
            <Ionicons name="timer-outline" size={60} color={Colors.primary} />
          </View>
          <Text style={styles.appTitle}>DevChron</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </View>

        <View style={styles.descriptionCard}>
          <Text style={styles.appDescription}>
            DevChron is a time management app for developers. It offers a
            calendar view, task management tools, and priority organization to
            help you stay focused on your projects. The simple, modern interface
            is designed to boost your productivity and streamline your workflow.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Key Features</Text>

        <View style={styles.featuresColumn}>
          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Ionicons
                name="calendar-outline"
                size={28}
                color={Colors.white}
              />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Task Calendar</Text>
              <Text style={styles.featureDescription}>
                View and organize your tasks on a clean calendar interface
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View
              style={[
                styles.featureIconContainer,
                { backgroundColor: Colors.secondary },
              ]}
            >
              <Ionicons name="list-outline" size={28} color={Colors.white} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Task Management</Text>
              <Text style={styles.featureDescription}>
                Create, edit, and delete tasks with detailed information
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View
              style={[
                styles.featureIconContainer,
                { backgroundColor: "#4F46E5" },
              ]}
            >
              <Ionicons name="flag-outline" size={28} color={Colors.white} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Priority System</Text>
              <Text style={styles.featureDescription}>
                Categorize tasks by priority level (low, medium, high)
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View
              style={[
                styles.featureIconContainer,
                { backgroundColor: "#8B5CF6" },
              ]}
            >
              <Ionicons
                name="file-tray-full-outline"
                size={28}
                color={Colors.white}
              />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Task Categories</Text>
              <Text style={styles.featureDescription}>
                Organize tasks by project or category
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View
              style={[
                styles.featureIconContainer,
                { backgroundColor: "#10B981" },
              ]}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={28}
                color={Colors.white}
              />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Completion Tracking</Text>
              <Text style={styles.featureDescription}>
                Mark tasks as complete and track your progress
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Connect With Us</Text>

        <View style={styles.connectSection}>
          <TouchableOpacity
            style={styles.connectCard}
            onPress={openGitHub}
            activeOpacity={0.7}
          >
            <Ionicons name="logo-github" size={24} color={Colors.gray[800]} />
            <Text style={styles.connectText}>GitHub</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.connectCard}
            onPress={openWebsite}
            activeOpacity={0.7}
          >
            <Ionicons name="globe-outline" size={24} color={Colors.gray[800]} />
            <Text style={styles.connectText}>Website</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.connectCard}
            onPress={contactSupport}
            activeOpacity={0.7}
          >
            <Ionicons name="mail-outline" size={24} color={Colors.gray[800]} />
            <Text style={styles.connectText}>Support</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.copyright}>
          © {new Date().getFullYear()} DevChron. All rights reserved.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 24,
  },
  logoBackground: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  appVersion: {
    color: Colors.gray[500],
    marginTop: 6,
    fontSize: 14,
  },
  descriptionCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  appDescription: {
    color: Colors.gray[700],
    textAlign: "justify",
    letterSpacing: 0.5,
    lineHeight: 22,
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
    color: Colors.gray[800],
    paddingLeft: 4,
  },
  featuresColumn: {
    marginBottom: 30,
  },
  featureCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: Colors.gray[800],
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.gray[600],
    lineHeight: 20,
  },
  connectSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  connectCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    width: "30%",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  connectText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
    color: Colors.gray[700],
  },
  copyright: {
    textAlign: "center",
    color: Colors.gray[400],
    marginBottom: 32,
    fontSize: 13,
  },
});

export default AboutScreen;
