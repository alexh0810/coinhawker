import { atom, selector } from 'recoil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getWatchlistedCoins } from '../services/requests';

// Use Recoil to manage portfolio assets 

export const allPortfolioBoughtAssets = selector({
  key: 'allPortfolioBoughtAssets',
  get: async () => {
    const jsonValue = await AsyncStorage.getItem('@portfolio_coins')
    return jsonValue != null ? JSON.parse(jsonValue) : []
  }
})

//GET assets and their market data
export const allPortfolioBoughtAssetsFromAPI = selector({
  key: 'allPortfolioBoughtAssetsFromAPI',
  get: async ({get}) => {
    // First get all assets in portfolio
    const boughtPortfolioAssets = get(allPortfolioBoughtAssetsInStorage)
    // Then fetch their data from CoinGecko API by passing coinID and pageNumber
    const portfolioAssetsMarketData = await getWatchlistedCoins(1, boughtPortfolioAssets.map((portfolioAsset) => portfolioAsset.id).join(','))
    // Return data from coin assets 
    const boughtAssets = boughtPortfolioAssets.map((boughtAsset) => {
      const portfolioAsset = portfolioAssetsMarketData.filter((item) => boughtAsset.id === item.id)[0]
      return {
        ...boughtAsset,
        currentPrice: portfolioAsset.current_price,
        priceChangePercentage: portfolioAsset.price_change_percentage_24h
      }
    })
    // Return also the quantity of coins bought
    return boughtAssets.sort((item1, item2) => (item1.quantityBought * item1.currentPrice) < (item2.quantityBought * item2.currentPrice))
  }
})

export const allPortfolioAssets = atom({
  key: 'allPortfolioAssets',
  default: allPortfolioBoughtAssetsFromAPI
})

export const allPortfolioBoughtAssetsInStorage = atom({
  key: 'allPortfolioBoughtAssetsInStorage',
  default: allPortfolioBoughtAssets,
})

