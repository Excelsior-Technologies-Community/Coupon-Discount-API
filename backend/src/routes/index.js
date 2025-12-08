const user = require("./User/userRoutes.js");
const product = require("./Product/productRoutes.js");
const review = require("./Product/reviewRoutes.js");
const cart = require("./Cart/cartRoutes.js");
const coupon = require("./Coupon/couponRoutes.js");

module.exports = [
    { path: "/api/auth", route: user },
    { path: "/api/Product", route: product },
    { path: "/api/:productId/Review", route: review },
    { path: "/api/Cart", route: cart },
    { path: "/api/Coupon", route: coupon },
]