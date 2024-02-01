class Product {
    constructor(
        creatorUserId,
        buyerUserId,
        subscriptionType,
        productName,
        productDescription,
        price,
        sold = false,
        createDate,
        balanceBefore,
        balanceAfter,
        purchaseDate
    ) {
        this.creatorUserId = creatorUserId;
        this.buyerUserId = buyerUserId;
        this.subscriptionType = subscriptionType;
        this.productName = productName;
        this.productDescription = productDescription;
        this.price = price;
        this.sold = sold;
        this.createDate = createDate;
        this.balanceBefore = balanceBefore;
        this.balanceAfter = balanceAfter;
        this.purchaseDate = purchaseDate;
    }
}

module.exports = Product;
