import React, { Component } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import debounce from "lodash";

export default class SearchBar extends Component {
  static propTypes = {
    searchDeals: PropTypes.func.isRequired
  };

  state = {
    searchTerm: ""
  };

  debouncedSearchdeals = debounce(this.props.searchDeals, 300);

  handleChange = searchTerm => {
    this.setState({ searchTerm }, () => {
      this.debouncedSearchdeals(this.state.searchTerm);
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Search all deals"
          style={styles.input}
          onChangeText={this.handleChange}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%"
  },
  input: {
    marginHorizontal: 10,
    paddingTop: 50
  }
});
