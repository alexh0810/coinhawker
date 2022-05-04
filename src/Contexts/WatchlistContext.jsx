import React, { useContext, createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Managing watchlist items with Context

const WatchlistContext = createContext();

export const useWatchlist = () => useContext(WatchlistContext);

const WatchlistProvider = ({children}) => {
  const [watchlistCoinIds, setWatchlistCoinIds] = useState([]);

  // Get all watchlisted coins 
  const getWatchlistData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@watchlist_coins");
      setWatchlistCoinIds(jsonValue != null ? JSON.parse(jsonValue) : []);
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getWatchlistData()
  },[])

  // Store a coin into watchlist
  const storeWatchlistCoinId = async (coinId) => {
    try {
      const newWatchlist = [...watchlistCoinIds, coinId];
      const jsonValue = JSON.stringify(newWatchlist);
      await AsyncStorage.setItem('@watchlist_coins', jsonValue);
      setWatchlistCoinIds(newWatchlist);
    } catch (e) {
      console.log(e)
    }
  }

  // Remove a coin from watchlist
  const removeWatchlistCoinId = async (coinId) => {
    const newWatchlist = watchlistCoinIds.filter((coinIdValue) => coinIdValue !== coinId);
    const jsonValue = JSON.stringify(newWatchlist);
    await AsyncStorage.setItem('@watchlist_coins', jsonValue);
    setWatchlistCoinIds(newWatchlist);
  }

  return (
    <WatchlistContext.Provider value={{watchlistCoinIds, storeWatchlistCoinId, removeWatchlistCoinId}}>
      {children}
    </WatchlistContext.Provider>
  )
}

export default WatchlistProvider;