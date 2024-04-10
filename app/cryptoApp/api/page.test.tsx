import { describe } from "node:test";
import APIService from "./cryptoCoinsService";
import { log } from "console";

const mockedJsonLinkEur =
{

    "data": {
        "base": "LINK", "currency": "EUR",
        "prices":
            [{
                "price": "16.127495157934305",
                "time": "1712428530"
            }],
    }
}
describe('test', () => {
    const api = new APIService()
    it('test', () => {
        expect(api.sum(1, 1)).toEqual(2);
    });
});

describe('unix converter', () => {
    const api = new APIService()
    it('converts unix to readable date', () => {
        expect(api.formatTimestampUNIX(1712428530)).toEqual('6/4/2024 14:35:30');
    });
});


describe('iso converter', () => {
    const api = new APIService()
    it('converts iso to readable date', () => {
        expect(api.formatTimestampISO8601("2024-04-06T14:35:30")).toEqual("6/4/2024 14:35:30");
    });
});

describe('fetch crypto price history', () => {
    const api = new APIService();
    let fetchMock: jest.Mock<any, any>;

    beforeEach(() => {
        fetchMock = jest.fn();
        global.fetch = fetchMock;
    });

    afterEach(() => {
        fetchMock.mockClear();
    });

    it('returns data on successful call', async () => {
        const expectedData = [
            {
                price: 16.127495157934305,
                time: '6/4/2024 14:35:30'
            }
        ];

        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockedJsonLinkEur)
        });

        const result = await api.getCoinPriceHistory('LINK - EUR', '1');

        expect(result).toEqual(expectedData);
    });

    it(' breaks on unsuccessful call', async () => {
        const result = await api.getCoinPriceHistory('LINK - EUR', '1');
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockedJsonLinkEur)
        });
        await expect(api.getCoinPriceHistory('LINK - EUR', '1')).rejects.toThrow('Price data not available');
    });
});