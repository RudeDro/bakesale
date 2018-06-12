import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  ScrollView,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { priceDisplay } from "../util";
import ajax from "../ajax";

export default class DealDetail extends Component {
  static propTypes = {
    initialDealData: PropTypes.object.isRequired,
    onBackPress: PropTypes.func.isRequired
  };

  state = {
    deal: this.props.initialDealData
  };

  onBackPress = () => {
    this.props.onBackPress();
  };

  async componentDidMount() {
    const fulldeal = await ajax.fetchDealDetails(
      this.props.initialDealData.key
    );
    console.log(fulldeal);
    this.setState({ deal: fulldeal });
  }

  render() {
    const { deal } = this.state;
    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={this.onBackPress}>
          <Text style={styles.backbutton}>Back</Text>
        </TouchableOpacity>
        <Image source={{ uri: deal.media[0] }} style={styles.image} />
        <View style={styles.textcontainer}>
          <Text style={styles.title}>{deal.title}</Text>
          <View style={styles.footer}>
            <Text style={styles.cause}>{deal.cause.name}</Text>
            <Text style={styles.price}>{priceDisplay(deal.price)}</Text>
          </View>
        </View>
        {deal.user && (
          <View style={styles.usercontainer}>
            <Image
              source={{ uri: deal.user.avatar }}
              style={styles.userimage}
            />
            <Text style={styles.username}>{deal.user.name}</Text>
          </View>
        )}
        {deal.description && (
          <View>
            <Text style={styles.description}>{deal.description}</Text>
          </View>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 150
  },
  userimage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    paddingTop: 5
  },
  username: {
    paddingTop: 5
  },
  container: {
    backgroundColor: "#fff",
    padding: 5,
    margin: 5,
    marginTop: 50,
    borderColor: "#ccc",
    borderWidth: 1
  },
  usercontainer: {
    alignItems: "center",
    justifyContent: "center"
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
  },
  description: {
    margin: 10
  },
  backbutton: {
    marginBottom: 10,
    color: "#22f"
  }
});
