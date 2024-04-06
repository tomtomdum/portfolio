import APIService from "./cryptoCoinsService";

describe('Page', () => {
    const api = new APIService()
    it('renders a heading', () => {
        expect(api.sum(1, 1)).toEqual(2);
    });
});
