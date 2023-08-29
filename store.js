export class DiscountOffer {
  constructor(partnerName, expiresIn, discountRateInPercent) {
    this.partnerName = partnerName;
    this.expiresIn = expiresIn;
    this.discountInPercent = discountRateInPercent;
  }
}

export class Store {
  constructor(discountOffers = []) {
    this.discountOffers = discountOffers;
  }

  updateDiscounts() {
    for (let i = 0; i < this.discountOffers.length; i++) {
      this.updateDiscount(this.discountOffers[i]);
    }
    return this.discountOffers;
  }

  updateDiscount(offer) {
    switch (offer.partnerName) {
      case "Ilek":
        return this.updateIlekDiscount(offer);
      case "Naturalia":
        this.updateNaturaliaDiscount(offer);
        break;
      case "Vinted":
        this.updateVintedDiscount(offer);
        break;
      case "BackMarket": // Add a case for the new partner "BackMarket"
        this.updateBackMarketDiscount(offer);
        break;
      default:
        this.updateDefaultDiscount(offer);
        break;
    }
    // Ensure discount is within [0, 50] range
    offer.discountInPercent = Math.max(
      0,
      Math.min(50, offer.discountInPercent)
    );

    // Update expiration
    offer.expiresIn--;
  }

  updateIlekDiscount(offer) {
    offer.discountInPercent = Math.max(
      0,
      Math.min(50, offer.discountInPercent)
    );
  }
  updateNaturaliaDiscount(offer) {
    offer.discountInPercent += offer.expiresIn > 0 ? 1 : 2;
  }

  updateVintedDiscount(offer) {
    if (offer.expiresIn <= 0) {
      offer.discountInPercent = 0;
    } else if (offer.expiresIn <= 5) {
      offer.discountInPercent += 3;
    } else if (offer.expiresIn <= 10) {
      offer.discountInPercent += 2;
    } else {
      offer.discountInPercent += 1;
    }
  }

  updateBackMarketDiscount(offer) {
    offer.discountInPercent -= offer.expiresIn <= 0 ? 4 : 2; // Decreases twice as fast
  }

  updateDefaultDiscount(offer) {
    offer.discountInPercent -= offer.expiresIn <= 0 ? 2 : 1;
  }
}
