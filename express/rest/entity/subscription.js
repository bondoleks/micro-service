class Subscription {
    constructor(
        userId,
        subscriptionType,
        subscriptionDescription,
        price,
        expirationTime,
        availableAds,
        balanceBefore,
        balanceAfter,
        purchaseTime = new Date()
    ) {
        this.userId = userId;
        this.subscriptionType = subscriptionType;
        this.subscriptionDescription = subscriptionDescription;
        this.price = price;
        this.expirationTime = expirationTime;
        this.availableAds = availableAds;
        this.balanceBefore = balanceBefore;
        this.balanceAfter = balanceAfter;
        this.purchaseTime = purchaseTime;
    }
}

module.exports = Subscription;
