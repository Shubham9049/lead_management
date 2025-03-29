import { StyleSheet, Text, View, FlatList, ActivityIndicator, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeadsScreen = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  useEffect(() => {
    axios
      .get("https://app.bigwigmedia.in/StudentsApi.php")
      .then((response) => {
        setStudents(response.data);
        setFilteredStudents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = students.filter((student) =>
      Object.values(student)
        .join(" ")
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [searchText, students]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedData = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Total Applicants</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        placeholderTextColor="#888"
        value={searchText}
        onChangeText={setSearchText}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D17A47" />
        </View>
      ) : (
        <ScrollView horizontal>
          <View>
            <View style={styles.tableHeader}>
              {["ID", "Name", "Email", "Mobile", "Status", "Lead Source", "Lead Status", "Reg. Date", "App No.", "Programme"].map((header) => (
                <Text key={header} style={styles.headerText}>{header}</Text>
              ))}
            </View>

            <FlatList
              data={paginatedData}
              keyExtractor={(item) => String(item["Student ID"])}
              renderItem={({ item, index }) => (
                <View style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
                  {["Student ID", "Student Name", "Email", "Mobile Number", "Status", "Lead Source", "Lead Status", "Registration Date", "Application Number", "Programme Name"].map((key) => (
                    <Text key={key} style={styles.cell}>{item[key]}</Text>
                  ))}
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
    </View>
  );
};

export default LeadsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 40,
    backgroundColor: "#FFFFFF", // White background
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#D17A47",
    marginBottom: 15,
    textAlign: "center",
  },
  searchInput: {
    backgroundColor: "#F8F8F8", // Soft background for input
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    color: "#333", // Darker text for better readability
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D17A47',
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#D17A47", // Strong contrast for headers
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 5,
  },
  headerText: {
    width: 100,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFFFFF", // White text for clarity
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD", // Lighter border for subtle separation
  },
  evenRow: {
    backgroundColor: "#F9F9F9", // Light grey for subtle row contrast
  },
  oddRow: {
    backgroundColor: "#FFFFFF", // Pure white for clean look
  },
  cell: {
    width: 100,
    textAlign: "center",
    color: "#333", // Darker text for readability
    fontSize: 14,
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
    backgroundColor: "#D17A47",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  paginationText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF", // White text for better visibility on orange background
  },
  pageNumber: {
    fontSize: 16,
    color: "#D17A47",
  },
  disabledButton: {
    backgroundColor: "#D3D3D3", // Softer gray for disabled state
  },
});
