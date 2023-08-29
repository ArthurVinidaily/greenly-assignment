import { Store, DiscountOffer } from "./store";

describe("Store", () => {
  it("should decrease the discount and expiresIn", () => {
    expect(
      new Store([new DiscountOffer("TestPartner", 2, 3)]).updateDiscounts()
    ).toEqual([new DiscountOffer("TestPartner", 1, 2)]);
  });
});
