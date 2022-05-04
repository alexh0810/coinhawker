import axios from "axios";

/*GET request to get all data (id, image, name, symbol, market data) 
on a coin based on coinId 
*/
export const getDetailedCoinData = async (coinId) => {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false`)
    return response.data;
  } catch (e) {
    console.log(e);
  }
}

export const getCoinMarketChart = async (coinId, selectedRange) => {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${selectedRange}&interval=hourly`)
    return response.data;
  } catch (e) {
    console.log(e)
  }
}

// GET request to Coingecko to get all coins market data (default page number is 1)
export const getMarketData = async (pageNumber = 1) => {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=${pageNumber}&sparkline=false&price_change_percentage=24h`)
    return response.data;
  } catch (e) {
    console.log(e)
  }
}

// GET request to get data of coins in the watchlist
export const getWatchlistedCoins = async (pageNumber = 1, coinIds) => {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&per_page=50&page=${pageNumber}&sparkline=false&price_change_percentage=24h`);
    return response.data;
  } catch (e) {
    console.log(e);
  }
}

//GET list of all coins 
export const getAllCoins = async () => {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/list?include_platform=false`)
    return response.data;
  } catch (e) {
    console.error(e);
  }
}