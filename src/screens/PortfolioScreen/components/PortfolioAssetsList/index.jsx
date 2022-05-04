import React from "react";
import { View, Text, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import styles from "./styles";
import PortfolioAssetsItem from "../PortfolioAssetItem";
import { useNavigation } from "@react-navigation/native";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  allPortfolioAssets,
  allPortfolioBoughtAssetsInStorage,
} from "../../../../atoms/PortfolioAssets";
import { SwipeListView } from "react-native-swipe-list-view";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Portfolio screen where assets list is rendered
const PortfolioAssetsList = () => {
  const navigation = useNavigation();
  const assets = useRecoilValue(allPortfolioAssets);
  const [storageAssets, setStorageAssets] = useRecoilState(
    allPortfolioBoughtAssetsInStorage
  );

  // Function to get current balance of portfolio
  const getCurrentBalance = () =>
    assets.reduce(
      (total, currentAsset) =>
        total + currentAsset.currentPrice * currentAsset.quantityBought,
      0
    );

  // Function to get current value change of portfolio
  const getCurrentValueChange = () => {
    const currentBalance = getCurrentBalance();
    const boughtBalance = assets.reduce(
      (total, currentAsset) =>
        total + currentAsset.priceBought * currentAsset.quantityBought,
      0
    );

    return (currentBalance - boughtBalance).toFixed(2);
  };

  // Function to get percentage change of portfolio
  const getCurrentPercentageChange = () => {
    const currentBalance = getCurrentBalance();
    const boughtBalance = assets.reduce(
      (total, currentAsset) =>
        total + currentAsset.priceBought * currentAsset.quantityBought,
      0
    );
    return (
      (((currentBalance - boughtBalance) / boughtBalance) * 100).toFixed(2) || 0
    );
  };

  // Deleting an asset from portfolio
  const onDeleteAsset = async (asset) => {
    const newAssets = storageAssets.filter(
      (coin) => coin.unique_id !== asset.item.unique_id
    );
    const jsonValue = JSON.stringify(newAssets);
    await AsyncStorage.setItem("@portfolio_coins", jsonValue);
    setStorageAssets(newAssets);
  };

  const renderDeleteButton = (data) => {
    return (
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "#EA3943",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingRight: 30,
          marginLeft: 20,
        }}
        onPress={() => onDeleteAsset(data)}
      >
        <FontAwesome name="trash-o" size={24} color="white" />
      </Pressable>
    );
  };

  const isChangePositive = () => getCurrentValueChange() >= 0;

  return (
    // Using swipelistview to render delete button on each row
    <SwipeListView
      data={assets}
      renderItem={({ item }) => <PortfolioAssetsItem assetItem={item} />}
      rightOpenValue={-75}
      disableRightSwipe
      closeOnRowPress
      keyExtractor={({ id }, index) => `${id}${index}`}
      renderHiddenItem={(data) => renderDeleteButton(data)}
      ListHeaderComponent={
        <>
          <View style={styles.balanceContainer}>
            <View>
              <Text style={styles.currentBalance}>Current Balance</Text>
              <Text style={styles.currentBalanceValue}>
                ${getCurrentBalance().toFixed(2)}
              </Text>
              <Text
                style={{
                  ...styles.valueChange,
                  color: isChangePositive() ? "green" : "red",
                }}
              >
                ${getCurrentValueChange()} (All Time)
              </Text>
            </View>
            <View
              style={{
                ...styles.priceChangePercentageContainer,
                backgroundColor: isChangePositive() ? "green" : "red",
              }}
            >
              <AntDesign
                name={isChangePositive() ? "caretup" : "caretdown"}
                size={12}
                color={"white"}
                style={{ alignSelf: "center", marginRight: 5 }}
              />
              <Text style={styles.percentageChange}>
                {getCurrentPercentageChange()}%
              </Text>
            </View>
          </View>
          <Text style={styles.assetsLabel}>Your Assets</Text>
        </>
      }
      ListFooterComponent={
        <Pressable
          style={styles.buttonContainer}
          onPress={() => navigation.navigate("AddNewAssetScreen")}
        >
          <Text style={styles.buttonText}>Add New Asset</Text>
        </Pressable>
      }
    />
  );
};

export default PortfolioAssetsList;
