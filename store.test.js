import { Store, DiscountOffer } from "./store";

describe("DiscountOffer", () => {
  it("should create a DiscountOffer object", () => {
    const offer = new DiscountOffer("TestPartner", 5, 20);
    expect(offer).toBeDefined();
    expect(offer.partnerName).toBe("TestPartner");
    expect(offer.expiresIn).toBe(5);
    expect(offer.discountInPercent).toBe(20);
  });
});

describe("Store", () => {
  it("should create a Store object with discount offers", () => {
    const discountOffers = [
      new DiscountOffer("Ilek", 10, 100),
      new DiscountOffer("Naturalia", 5, 10),
      new DiscountOffer("Vinted", 7, 20),
      new DiscountOffer("BackMarket", 5, 30),
      new DiscountOffer("TestPartner", 8, 20),
    ];
    const store = new Store(discountOffers);
    expect(store).toBeDefined();
    expect(store.discountOffers).toHaveLength(5);
  });

  it("should update discounts correctly for Naturalia", () => {
    //before expiration date
    const storeBeforeExpired = new Store([
      new DiscountOffer("Naturalia", 5, 10),
    ]);
    storeBeforeExpired.updateDiscounts();
    expect(storeBeforeExpired.discountOffers[0]).toEqual(
      new DiscountOffer("Naturalia", 4, 11)
    );
    //After expiration date
    const storeAfterExpired = new Store([
      new DiscountOffer("Naturalia", -4, 10),
    ]);
    storeAfterExpired.updateDiscounts();
    expect(storeAfterExpired.discountOffers[0]).toEqual(
      new DiscountOffer("Naturalia", -5, 12)
    );
  });

  it("should update discounts correctly for Vinted", () => {
    //expiresIn > 10
    const storeUpper10 = new Store([new DiscountOffer("Vinted", 11, 20)]);
    storeUpper10.updateDiscounts();
    expect(storeUpper10.discountOffers[0]).toEqual(
      new DiscountOffer("Vinted", 10, 21)
    );
    //expiresIn <= 10 && >5
    const storeUpper5 = new Store([new DiscountOffer("Vinted", 8, 30)]);
    storeUpper5.updateDiscounts();
    expect(storeUpper5.discountOffers[0]).toEqual(
      new DiscountOffer("Vinted", 7, 32)
    );
    //expiresIn > 0 && <=5
    const storeUpper0 = new Store([new DiscountOffer("Vinted", 4, 25)]);
    storeUpper0.updateDiscounts();
    expect(storeUpper0.discountOffers[0]).toEqual(
      new DiscountOffer("Vinted", 3, 28)
    );
    //expiresIn <= 0
    const storeLower0 = new Store([new DiscountOffer("Vinted", -6, 25)]);
    storeLower0.updateDiscounts();
    expect(storeLower0.discountOffers[0]).toEqual(
      new DiscountOffer("Vinted", -7, 0)
    );
  });

  it("should update discounts correctly for BackMarket", () => {
    //before expiration date
    const storeBeforeExpired = new Store([
      new DiscountOffer("BackMarket", 5, 30),
    ]);
    storeBeforeExpired.updateDiscounts();
    expect(storeBeforeExpired.discountOffers[0]).toEqual(
      new DiscountOffer("BackMarket", 4, 28)
    );
    //After expiration date
    const storeAfterExpired = new Store([
      new DiscountOffer("BackMarket", -5, 30),
    ]);
    storeAfterExpired.updateDiscounts();
    expect(storeAfterExpired.discountOffers[0]).toEqual(
      new DiscountOffer("BackMarket", -6, 26)
    );
  });

  it("should update discounts correctly for Ilek", () => {
    const store = new Store([new DiscountOffer("Ilek", 10, 50)]);
    store.updateDiscounts();
    expect(store.discountOffers[0]).toEqual(new DiscountOffer("Ilek", 10, 50));
  });

  it("should ensure discounts are within [0, 50] range", () => {
    const store = new Store([
      new DiscountOffer("TestPartner", 5, 60),
      new DiscountOffer("TestPartner", 8, -80),
    ]);
    store.updateDiscounts();
    expect(store.discountOffers[0].discountInPercent).toBe(50);
    expect(store.discountOffers[1].discountInPercent).toBe(0);
  });

  it("should update expiration dates", () => {
    const store = new Store([new DiscountOffer("TestPartner", 5, 10)]);
    store.updateDiscounts();
    expect(store.discountOffers[0].expiresIn).toBe(4);
  });

  it("should decrease the discount and expiresIn", () => {
    expect(
      new Store([new DiscountOffer("TestPartner", 2, 3)]).updateDiscounts()
    ).toEqual([new DiscountOffer("TestPartner", 1, 2)]);
  });
});
