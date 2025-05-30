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

const QueriesScreen = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    axios
      .get("https://app.bigwigmedia.in/QueryApi.php")
      .then((response) => {
        setQueries(response.data);
        setFilteredQueries(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching queries:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = queries.filter((query) =>
      Object.values(query)
        .join(" ")
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
    setFilteredQueries(filtered);
    setCurrentPage(1);
  }, [searchText, queries]);

  const totalPages = Math.ceil(filteredQueries.length / itemsPerPage);
  const paginatedData = filteredQueries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Queries</Text>

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
            <View style={[styles.row, styles.header]}>
              <Text style={styles.headerText}>Application No</Text>
              <Text style={styles.headerText}>Applicant Name</Text>
              <Text style={styles.headerText}>Programme Name</Text>
              <Text style={styles.headerText}>Query</Text>
              <Text style={styles.headerText}>Reply</Text>
              <Text style={styles.headerText}>Query Date</Text>
            </View>
            
            <FlatList
              data={paginatedData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View
                  style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]}
                >
                  <Text style={styles.cell}>{item["Application Number"]}</Text>
                  <Text style={styles.cell}>{item["Student Name"]}</Text>
                  <Text style={styles.cell}>{item["Programme Name"]}</Text>
                  <Text style={styles.cell}>{item["Query"]}</Text>
                  <Text style={styles.cell}>{item["Reply"] || "No Reply"}</Text>
                  <Text style={styles.cell}>{item["Query Date"]}</Text>
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

export default QueriesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 40,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#D17A47",
    marginBottom: 15,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  header: {
    backgroundColor: "#D17A47",
    borderRadius: 10,
    paddingVertical: 15,
    marginBottom: 5,
  },
  headerText: {
    width: 150,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
  cell: {
    width: 150,
    textAlign: "center",
    color: "#333",
    fontSize: 14,
  },
  evenRow: {
    backgroundColor: "#f9f9f9",
  },
  oddRow: {
    backgroundColor: "#fff",
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
    color: "#fff",
  },
  pageNumber: {
    fontSize: 16,
    color: "#D17A47",
  },
  disabledButton: {
    backgroundColor: "gray",
  },
  searchInput: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    color: "#333",
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D17A47',
  },
});
