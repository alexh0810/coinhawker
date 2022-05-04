import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, View, Text } from "react-native";
import CoinItem from "../../components/CoinItem";
import { getMarketData } from "../../services/requests";

// Home view to show all coins data 

const HomeScreen = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);

  /*Fetching all coins data (default page number is 1, whenever reaching the end of the screen, this function), 
  this function is called again with new page number
  */
  const fetchCoins = async (pageNumber) => {
    if (loading) {
      return;
    }
    setLoading(true);
    const coinsData = await getMarketData(pageNumber);
    setCoins((existingCoins) => [...existingCoins, ...coinsData]);
    setLoading(false);
  };
  
  // Refetch coins data if the page refreshes
  const refetchCoins = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const coinsData = await getMarketData();
    setCoins(coinsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center'}}>
        <Text
          style={{
            fontFamily: "DroidSans",
            color: "white",
            fontSize: 25,
            letterSpacing: 1,
            paddingHorizontal: 20,
            paddingBottom: 5,
          }}
        >
          Cryptoassets
        </Text>
        <Text style={{color: 'lightgrey', fontSize: 12, paddingHorizontal: 10}}>Powered by Coingecko</Text>
      </View>
      <FlatList
        data={coins}
        renderItem={({ item }) => <CoinItem marketCoin={item} />}
        // Pagination: whenever reaching the end of the screen, make an API call to fetch data of the next page
        onEndReached={() => fetchCoins(coins.length / 50 + 1)}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            tintColor="white"
            // Refetch data whenever the screen refreshes
            onRefresh={refetchCoins}
          />
        }
      />
    </View>
  );
};

export default HomeScreen;
