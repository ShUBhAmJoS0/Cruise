
import { Product } from "../model/Product.js";

export const addProduct = async (req, res) => {
  try {
    console.log("hit apit")
    console.log(req.body)
    const artistId = req.user.id
    const { productName, price, description, stockQuantity, category, sku} = req.body;
    const imageUrl = req.files?.image?.[0]?.path.replace(/\\/g, '/') || null;
   console.log(price,description,productName,req.body)
   if(!productName||!price || !description || !stockQuantity || !category || !sku ||!imageUrl){
    return res.status(401).send({message:"no fields can be empty"})
   }
    const product = await Product.create({
        
       productName:productName,
      productPrice: price,
      productDescription:description,
      productQuantity:stockQuantity,
      productCategory:category,
      skuNumber:sku,
      createdBy:artistId,
     productImage: imageUrl,
    });

    res.status(200).send({ data:product, message:"Product added successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to add product", error });
  }
};
export const editProduct = async (req, res) => {
    console.log("editproduct Api hit")
  try {
    console.log(req)
    const { id } = req.params;
    const { productName, price, description, stockQuantity, category, sku, artistId } = req.body;


    const product = await Product.findByPk(id);
    if (!product) return res.status(404).send({ message: "Product not found" });
  let imageUrl = product.productImage; 
    if (req.files?.image?.[0]) {
      imageUrl = req.files.image[0].path.replace(/\\/g, '/');
    }
    await product.update({
      productName:productName,
      productPrice:price,
      productDescription:description,
      productQuantity:stockQuantity,
      productCategory:category,
      skuNumber:sku,
      createdBy:artistId,
      productImage:imageUrl,
    });

    res.status(200).send({ data:product,message: "Product updated successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to update product", error });
  }
};

export const getProductbyid = async(req,res)=>{
    try{
        const {id} = req.params;
        const product = await Product.findOne({where:{productId:id}})
        console.log(product)
        res.status(200).send({data:product,message:"fetched data sucessfully"})
    }
    catch(e){
        res.status(500).send({message:e.message})
    }
}
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.destroy();
    res.status(200).send({ data:product,message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to delete product", error });
  }
};
export const getAllProduct = async(req,res)=>{
try {
     const userId = req.user.id; 
 console.log(userId)
 const artistspecificitem = await Product.findAll({where:{createdBy:userId}})

 if(!artistspecificitem){
    return res.status(404).send({message:"no added items for this artist"})
 }
 return res.status(200).send({data:artistspecificitem,message:"fetched product sucessfully"})
} catch (error) {
    res.status(500).send({message:error.message})
}
}

