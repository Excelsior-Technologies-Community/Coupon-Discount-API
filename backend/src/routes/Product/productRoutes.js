const express = require("express");
const {
    addProduct,
    getProductById,
    getProducts,
    updateProduct,
    softDeleteProduct
} = require("../../controllers/Product/productController.js");
const upload = require("../../middleware/upload.js");

const router = express.Router();

router.post("/",upload.single("image"), addProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id",upload.single("image"), updateProduct);
router.delete("/:id", softDeleteProduct);

module.exports = router;