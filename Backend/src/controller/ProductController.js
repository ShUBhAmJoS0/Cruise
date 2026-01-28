
import { Product } from "../model/Product.js";
import { Op } from "sequelize";
import User from "../model/User.js";
import OrderItem from "../model/OrderItems.js";
import Order from "../model/Order.js";
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

    res.status(200).send({ data:product, message:"Product added successfully"});
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

    res.status(200).send({ data:product,message: "Product updated successfully"});
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
    if(product.visible==="Active"){
await product.update({ visible: "inActive" });
res.status(200).send({message:"Product deleted sucessfully"})
    }

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to delete product", error });
  }
};
export const getAllProduct = async(req,res)=>{
try {
  console.log("api hitting for get merch by artist ")
     const userId = req.user.id; 
 console.log(userId)
 const artistspecificitem = await Product.findAll({where:{createdBy:userId,visible:"Active"}})

 if(!artistspecificitem){
    return res.status(404).send({message:"no added items for this artist"})
 }

 return res.status(200).send({data:artistspecificitem, message:"fetched product sucessfully"})
} catch (error) {
    res.status(500).send({message:error.message})
}
}

export const getproductbuyers = async(req,res)=>{
  console.log("api hit")
  try {
    const userId = req.user.id;
    const productbuys = await Product.findAll({ where: { createdBy: userId}, include: [ { model: OrderItem, include: [ { model: Order, include: [{ model: User, attributes: ["name"] }] } ] } ] });
    res.status(200).send({data:productbuys,message:"fetched all merch buyers sucessfully"});
  } catch (error) {
    console.log(error.message)
    res.status(500).send({message:error.message})
  }
}
export const getproductBycreator = async(req,res)=>{
  try{
const artistId=req.params.id;
console.log(artistId)
const artistmerch = await Product.findAll({where:{createdBy:artistId,visible:"Active" }})
 if(!artistmerch){
    return res.status(404).send({message:"no  merch from this artist"})
 }

    return res.status(200).send({data:artistmerch,message:"successfully fetched merch from artist"})
  }
  catch(e){
    console.log(e)
    res.status(500).send({message:error.message})
  }
}


export const getAllMerch = async (req, res) => {
  try {
    const { category, sort, search } = req.query;

    const whereClause = {};

    if (category) {
      whereClause.productCategory = category;
    }
    console.log(category)
    if (search) {
      whereClause.productName = {
        [Op.iLike]: `%${search}%`,
      };
    }

    let order = [["createdAt", "DESC"]];
    if (sort === "Oldest") {
      order = [["createdAt", "ASC"]];
    }

    const allmerch = await Product.findAll({
      where:  { ...whereClause,
  visible: "Active"},
      order,
      include:[
        {
          model: User
        }
      ]
    });

    if (allmerch.length === 0) {
      console.log("not found")
      return res.status(200).json({ data:[],message: "No merch found" });
    }
    return res.status(200).json({
      data: allmerch,
      message:  "Merch fetched successfully"
    });

  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: e.message });
  }
};


