import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  ScrollView,
  Image,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  Animated,
  Dimensions,
  Linking
} from "react-native";
import { priceDisplay } from "../util";
import ajax from "../ajax";

export default class DealDetail extends Component {
  imageXPos = new Animated.Value(0);

  imagePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gs) => {
      this.imageXPos.setValue(gs.dx);
    },
    onPanResponderRelease: (evt, gs) => {
      this.windowWidth = Dimensions.get("window").width;
      if (Math.abs(gs.dx) > this.windowWidth * 0.4) {
        // Swipe left of right
        const direction = Math.sign(gs.dx);
        console.log("Swipe left");
        Animated.timing(this.imageXPos, {
          toValue: direction * this.windowWidth,
          duration: 250
        }).start(() => {
          this.handleSwipe(-1 * direction);
        });
      } else {
        Animated.spring(this.imageXPos, {
          toValue: 0
        }).start();
      }
    }
  });

  handleSwipe = indexDirection => {
    if (!this.state.deal.media[this.state.imageIndex + indexDirection]) {
      Animated.spring(this.imageXPos, {
        toValue: 0
      }).start();
      return;
    }
    this.setState(
      prevState => ({
        imageIndex: prevState.imageIndex + indexDirection
      }),
      () => {
        // next image animation
        this.imageXPos.setValue(this.windowWidth * indexDirection);
        Animated.spring(this.imageXPos, {
          toValue: 0,
          duration: 250
        }).start();
      }
    );
  };

  static propTypes = {
    initialDealData: PropTypes.object.isRequired,
    onBackPress: PropTypes.func.isRequired
  };

  state = {
    deal: this.props.initialDealData,
    imageIndex: 0
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

  openDealUrl = () => {
    Linking.openURL(this.state.deal.url);
  };

  render() {
    const { deal } = this.state;
    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={this.onBackPress}>
          <Text style={styles.backbutton}>Back</Text>
        </TouchableOpacity>
        <Animated.Image
          {...this.imagePanResponder.panHandlers}
          source={{ uri: deal.media[this.state.imageIndex] }}
          style={[{ left: this.imageXPos }, styles.image]}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{deal.title}</Text>
          <View style={styles.footer}>
            <Text style={styles.cause}>{deal.cause.name}</Text>
            <Text style={styles.price}>{priceDisplay(deal.price)}</Text>
          </View>
        </View>
        {deal.user && (
          <View style={styles.userContainer}>
            <Image
              source={{ uri: deal.user.avatar }}
              style={styles.userImage}
            />
            <Text style={styles.username}>{deal.user.name}</Text>
          </View>
        )}
        {deal.description && (
          <View>
            <Text style={styles.description}>{deal.description}</Text>
          </View>
        )}
        {deal.url && (
          <Button title="Buy this deal!" onPress={this.openDealUrl} />
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
  userImage: {
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
    marginTop: 30
  },
  userContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  textContainer: {
    marginBottom: 5
  },
  footer: {
    flexDirection: "row",
    marginHorizontal: 5
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    backgroundColor: "#eee",
    padding: 5
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
    marginLeft: 10,
    marginBottom: 10,
    color: "#22f"
  }
});
