import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category, owner } = req.body;

    // Validation - ensure required fields are present
    if (!name || !description || !price || !stock || !category || !owner) {
      throw new ApiError(400, "All required fields must be provided");
    }

    // console.log("request  ", req);

    // Check for product images uploaded via multer
    const productImages = req.files;
    // console.log(productImages);
    if (!productImages || productImages.length === 0) {
      throw new ApiError(400, "Product images are required");
    }

    // Perform the upload to Cloudinary for each product image
    const uploadedImages = await Promise.all(
      productImages.map(async (image) => {
        const imageUrl = await uploadOnCloudinary(image.path);
        return imageUrl?.url || null;
      })
    );

    // console.log("uploaded images ", uploadedImages);
    // Create the product in the database with the uploaded image URLs
    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      owner,
      productImage: uploadedImages,
    });

    // console.log("product ", product);

    if (!product) {
      throw new ApiError(500, "Error while creating the product");
    }

    return res
      .status(201)
      .json(new ApiResponse(200, product, "Product created successfully"));
  } catch (error) {
    console.log(error);
    res.status(400).json(new ApiError(400, error.message));
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    res
      .status(200)
      .json(
        new ApiResponse(200, products, "All products retrieved successfully")
      );
  } catch (error) {
    res.status(500).json(new ApiError(500, "Error while fetching products"));
  }
};

const getProductById = async (req, res, next) => {
  try {
    const productId = req.params.id;
    // Code to find a product by ID using the Product model
    // Send the retrieved product as a JSON response
  } catch (error) {
    // Handle errors
    console.error(error);
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    console.log("product id  ",productId);

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    console.log("product  ", product);
    // Destructure the fields you want to update from the request body
    const { name, description, price, stock, category } = req.body;

    // Update the product fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.category = category || product.category;

    // Check if new images are uploaded
    const newImages = req.files;
    if (newImages && newImages.length > 0) {
      const uploadedImages = await Promise.all(
        newImages.map(async (image) => {
          const imageUrl = await uploadOnCloudinary(image.path);
          return imageUrl?.url || null;
        })
      );
      // Update the product's image array with the new images
      product.productImage = [...product.productImage, ...uploadedImages];
    }

    console.log("updated products ", product);

    // Save the updated product
    const updatedProduct = await product.save();

    res
      .status(200)
      .json(
        new ApiResponse(200, updatedProduct, "Product updated successfully")
      );
  } catch (error) {
    res.status(400).json(new ApiError(400, "Error while updating product"));
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    console.log(productId);
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    console.log(product);
    // Delete the product
    await Product.findByIdAndDelete(productId);

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Product deleted successfully"));
  } catch (error) {
    console.log(error);
    res.status(400).json(new ApiError(400, "Error while deleting product"));
  }
};

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
