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
    <View style={styles.container}>
      <Text style={styles.title}>Users</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        placeholderTextColor="#666"
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
    </View>
  );
};

export default UsersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
    paddingTop: 40,
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
    backgroundColor: "#F5F5F5",
  },
  oddRow: {
    backgroundColor: "#EAEAEA",
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
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    color: "#333",
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D17A47',
  },
});
