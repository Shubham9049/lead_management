import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";

const UsersScreen = () => {
  const [users, setusers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredusers, setFilteredusers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    axios
      .get("https://app.bigwigmedia.in/UsersApi.php")
      .then((response) => {
        setusers(response.data);
        setFilteredusers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = users.filter((query) =>
      Object.values(query)
        .join(" ")
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
    setFilteredusers(filtered);
    setCurrentPage(1);
  }, [searchText, users]);

  const totalPages = Math.ceil(filteredusers.length / itemsPerPage);
  const paginatedData = filteredusers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <LinearGradient colors={["#0F172A", "#1E293B"]} style={styles.container}>
      <Text style={styles.title}>Users</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        placeholderTextColor="#ccc"
        value={searchText}
        onChangeText={setSearchText}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FACC15" />
        </View>
      ) : (
        <ScrollView horizontal>
          <View>
            <View style={[styles.row, styles.header]}>
              <Text style={styles.headerText}>Type</Text>
              <Text style={styles.headerText}>Name</Text>
              <Text style={styles.headerText}>Email</Text>
              <Text style={styles.headerText}>Mobile</Text>
            </View>
            
            <FlatList
              data={paginatedData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View
                  style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]}
                >
                  <Text style={styles.cell}>{item["Type"]}</Text>
                  <Text style={styles.cell}>{item["Name"]}</Text>
                  <Text style={styles.cell}>{item["Email"]}</Text>
                  <Text style={styles.cell}>{item["Mobile"]}</Text>
                </View>
              )}
            />
          </View>
        </ScrollView>
      )}

      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
          disabled={currentPage === 1}
          onPress={() => setCurrentPage((prev) => prev - 1)}
        >
          <Text style={styles.paginationText}>Previous</Text>
        </TouchableOpacity>

        <Text style={styles.pageNumber}>Page {currentPage} of {totalPages}</Text>

        <TouchableOpacity
          style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
          disabled={currentPage === totalPages}
          onPress={() => setCurrentPage((prev) => prev + 1)}
        >
          <Text style={styles.paginationText}>Next</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default UsersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FACC15",
    marginBottom: 15,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  header: {
    backgroundColor: "#1E293B",
    borderRadius: 10,
    paddingVertical: 15,
    marginBottom:5
  },
  headerText: {
    width: 150,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FACC15",
  },
  cell: {
    width: 150,
    textAlign: "center",
    color: "#fff",
    fontSize: 14,
  },
  evenRow: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  oddRow: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  paginationButton: {
    backgroundColor: "#FACC15",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  paginationText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F3B8C",
  },
  pageNumber: {
    fontSize: 16,
    color: "#FACC15",
  },
  disabledButton: {
    backgroundColor: "gray",
  },
  searchInput: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    color: "#fff",
    fontSize: 16,
  },
});
