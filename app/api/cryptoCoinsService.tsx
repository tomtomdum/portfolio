import { json } from "stream/consumers";
import { PriceData, TradeData, TradingPair } from "../interfaces/crypto";




class APIService {
    /**
     * 
     * @param numberOfDays range of days to check for price, from today to the past selected day
     * @returns price history data of bitcoin
     */
    async getCoinPriceHistory(product: string, numberOfDays: string): Promise<PriceData[]> {
        try {
            const res = await fetch(`https://api.coinbase.com/v2/prices/${product}/historic?days=${numberOfDays}`);
            const jsonData = await res.json();

            // Check if pricesArray exists in the response data
            const pricesArray: any[] = jsonData?.data?.prices;

            if (!pricesArray) {
                throw new Error('Prices array not found in API response');
            }

            // Map and transform the data to conform to the PriceData interface
            const formattedData: PriceData[] = pricesArray.map((item: any) => ({
                price: parseFloat(item.price), // Convert the price from string to number
                time: this.formatTimestamp(item.time), // Format the timestamp to a readable date
            }));

            // Sort the data by time
            formattedData.sort((a, b) => a.time.localeCompare(b.time));

            return formattedData;
        } catch (error) {
            console.error('Error fetching coin price history:', error);
            throw error; // Rethrow the error to handle it in the caller function
        }
    }

    /**
     * https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getproducttrades
     * @param product 
     * @param numberOfDays 
     * @returns 
     */
    async getTradeHistory(product: string, numberOfDays: string,): Promise<TradeData[]> {
        const res = await fetch('https://api.exchange.coinbase.com/products/' + product + '/trades');
        const jsonData = await res.json();

        const formattedData: TradeData[] = jsonData.map((item: any) => ({
            trade_id: item.trade_id,
            side: item.side,
            size: parseFloat(item.size),
            price: parseFloat(item.price),
            time: this.formatTimestamp(item.time), // Assuming you have a function to format timestamps
        }));

        console.log(formattedData);

        return formattedData;
    }

    async fetchProducts(): Promise<TradingPair[]> {
        const res = await fetch('https://api.exchange.coinbase.com/products');
        const jsonData = await res.json();

        // Extract the prices array from the API response
        const productsArray: any[] = jsonData;

        return productsArray;
    }

    // Helper function to format Unix timestamp to a readable date
    formatTimestamp(timestamp: string): string {
        const date = new Date(parseInt(timestamp) * 1000);
        return date.toLocaleString();
    }


}


export default APIService;