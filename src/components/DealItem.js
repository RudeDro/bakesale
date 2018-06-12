import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { priceDisplay } from "../util";

export default class DealItem extends Component {
  static propTypes = {
    deal: PropTypes.object.isRequired,
    onPress: PropTypes.func.isRequired
  };

  handlePress = () => {
    this.props.onPress(this.props.deal.key);
  };

  render() {
    const { deal } = this.props;

    return (
      <TouchableOpacity style={styles.container} onPress={this.handlePress}>
        <Image source={{ uri: deal.media[0] }} style={styles.image} />
        <View style={styles.textcontainer}>
          <Text style={styles.title}>{deal.title}</Text>
          <View style={styles.footer}>
            <Text style={styles.cause}>{deal.cause.name}</Text>
            <Text style={styles.price}>{priceDisplay(deal.price)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 150
  },
  container: {
    backgroundColor: "#fff",
    padding: 5,
    margin: 5,
    borderColor: "#ccc",
    borderWidth: 1
  },
  textcontainer: {
    padding: 5
  },
  footer: {
    flexDirection: "row"
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5
  },
  cause: {
    flex: 2
  },
  price: {
    flex: 1,
    textAlign: "right"
  }
});
