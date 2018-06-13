import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  Dimensions
} from "react-native";
import ajax from "./src/ajax";
import DealList from "./src/components/DealList";
import DealDetail from "./src/components/DealDetail";
import SearchBar from "./src/components/SearchBar";

export default class App extends React.Component {
  titleXPos = new Animated.Value(0);

  state = {
    deals: [],
    dealsFromSearch: [],
    currentDealId: null
  };

  searchDeals = async searchTerm => {
    let dealsFromSearch = [];
    if (searchTerm) {
      dealsFromSearch = await ajax.fetchDealsSearchResult(searchTerm);
    }
    console.log(dealsFromSearch);
    this.setState({ dealsFromSearch });
  };

  animateTitle = (direction = 1) => {
    const windowWidth = Dimensions.get("window").width - 160;
    Animated.timing(this.titleXPos, {
      toValue: direction * (windowWidth / 2),
      duration: 1000,
      easing: Easing.ease
    }).start(({ finished }) => {
      if (finished) {
        this.animateTitle(direction * -1);
      }
    });
  };

  async componentDidMount() {
    this.animateTitle();
    const deals = await ajax.fetchInitialDeals();
    this.setState({ deals });
  }

  setCurrentDeal = dealId => {
    this.setState({
      currentDealId: dealId
    });
  };

  unsetCurrentDeal = () => {
    this.setState({
      currentDealId: null
    });
  };

  currentDeal = () => {
    return this.state.deals.find(deal => deal.key === this.state.currentDealId);
  };

  render() {
    if (this.state.currentDealId) {
      return (
        <DealDetail
          initialDealData={this.currentDeal()}
          onBackPress={this.unsetCurrentDeal}
        />
      );
    }
    const dealsToDisplay =
      this.state.dealsFromSearch.length > 0
        ? this.state.dealsFromSearch
        : this.state.deals;

    if (dealsToDisplay.length > 0) {
      return (
        <View style={styles.container}>
          <SearchBar searchDeals={this.searchDeals} />
          <DealList deals={dealsToDisplay} onItemPress={this.setCurrentDeal} />
        </View>
      );
    } else {
      return (
        <Animated.View style={[{ left: this.titleXPos }, styles.container]}>
          <Text style={styles.header}>Bakesale</Text>
        </Animated.View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  header: {
    fontSize: 40
  }
});
