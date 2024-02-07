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
            const res = await fetch('https://api.coinbase.com/v2/prices/' + product + '/historic?days=' + numberOfDays);
            const jsonData = await res.json();

            if (!jsonData.data || !jsonData.data.prices) {
                throw new Error('Prices data not available');
            }
            // Extract the prices array from the API response
            const pricesArray: any[] = jsonData.data.prices;

            // Map and transform the data to conform to the PriceData interface
            const formattedData: PriceData[] = pricesArray.map((item: any) => ({
                price: parseFloat(item.price), // Convert the price from string to number
                time: this.formatTimestampUNIX(item.time), // Format the timestamp to a readable date
            }));
            //the data received from the API was formatted recent to old.
            formattedData.sort((a, b) => a.time.localeCompare(b.time));


            return formattedData;
        } catch (error) {
            console.error('Error fetching coin price history:', error);
            throw error; // Re-throw the error to handle it outside the function
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
            time: this.formatTimestampISO8601(item.time),
        }));

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
    formatTimestampISO8601(timestampISO: string) {
        const timestampUnix = Date.parse(timestampISO); // Parse ISO 8601 timestamp to Unix timestamp in milliseconds

        const date = new Date(timestampUnix); // Create a Date object using the Unix timestamp


        // Extract day, month, and year components in local time zone
        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are zero-based, so add 1
        const year = date.getFullYear();

        // Format the date as "day/month/year"
        const formattedDate = `${day}/${month}/${year}`;

        // Extract hour, minute, and second components in local time zone
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();

        // Format the time as "hour:min:sec"
        const formattedTime = `${hour}:${minute}:${second}`;

        return formattedDate + ' ' + formattedTime;
    }


    formatTimestampUNIX(timestamp: number) {
        const date = new Date(timestamp * 1000); // Convert seconds to milliseconds

        // Extract day, month, and year components in local time zone
        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are zero-based, so add 1
        const year = date.getFullYear();

        // Format the date as "day/month/year"
        const formattedDate = `${day}/${month}/${year}`;

        // Extract hour, minute, and second components in local time zone
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();

        // Format the time as "hour:min:sec"
        const formattedTime = `${hour}:${minute}:${second}`;

        return formattedDate + ' ' + formattedTime;
    }

}


export default APIService;