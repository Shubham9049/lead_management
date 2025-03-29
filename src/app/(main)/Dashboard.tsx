import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [totalLeads, setTotalLeads] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://app.bigwigmedia.in/StudentsApi.php")
      .then((response) => {
        setTotalLeads(response.data.length);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching total leads:", error);
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#D17A47" style={styles.loader} />
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Leads</Text>
          <Text style={styles.count}>{totalLeads}</Text>
        </View>
      )}
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#FFFFFF", // White background
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333", // Dark text for contrast
    textAlign: "center",
    marginBottom: 20,
    textTransform: "uppercase",
  },
  loader: {
    marginTop: 20,
  },
  card: {
    backgroundColor: "#F8F8F8", // Soft grey card for contrast
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#999",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    color: "#555", // Dark grey for readability
    fontWeight: "bold",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  count: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#D17A47", // Warm orange for highlight
    textShadowColor: "rgba(209, 122, 71, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});
