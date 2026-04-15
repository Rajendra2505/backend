const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});
const upload = multer({ storage: storage });


router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', upload.single('image'), addProduct); 
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;