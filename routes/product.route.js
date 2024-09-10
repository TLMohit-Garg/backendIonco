import express from "express";
import {getProducts, getProduct, createProduct,updateProduct,deleteProduct} from "../controllers/product.controller.js";

const router = express.Router();

// router.get("/",(req, res) => {
//     res.send("Hello from Node API server update")
// });

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
// module.exports = router;

