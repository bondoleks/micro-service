class User {
    constructor(
        username,
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        balance = 100.0
    ) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.balance = balance;
    }
}

module.exports = User;
