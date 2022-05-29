const mongoose = require('mongoose');
const userModel = require("../model/userModel")
const productModel = require("../model/productModel")
const cartModel = require("../model/cartModel")



const createCart = async function (req, res) {
    try {
        const data = req.body
        const userIdbyParams = req.params.userId
        let { userId, productId, cartId } = data


        // if (!isValid(userId)) {
        // res.status(400).send({ status: false, message: 'please provide userId' })
        // return
        //  }

        const userByuserId = await userModel.findById(userIdbyParams);

        if (!userByuserId) {
            return res.status(404).send({ status: false, message: 'user not found.' });
        }

        if (userIdbyParams !== data.userId) {
            res.status(400).send({ status: false, message: "Plz Provide Similar UserId's in params and body" })
            return
        }
        // if (!isValidObjId.test(productId)) {
        // return res.status(400).send({ status: false, message: "productId  is not valid" });
        // }




        const isProductPresent = await productModel.findOne({ _id: productId, isDeleted: false })

        if (!isProductPresent) {
            return res.status(404).send({ status: false, message: `Product not found by this productId ${productId}` })
        }

        if (data.hasOwnProperty("cartId")) {

            //  if (!isValid(cartId)) {
            //  return res.status(400).send({ status: false, message: "cartId could not be blank" });
            // }

            //if (!isValidObjId.test(cartId)) {
            //    return res.status(400).send({ status: false, message: "cartId  is not valid" });
            //  }
            const isCartIdPresent = await cartModel.findById(cartId);

            if (!isCartIdPresent) {
                return res.status(404).send({ status: false, message: `Cart not found by this cartId ${cartId}` });
            }

            const cartIdForUser = await cartModel.findOne({ userId: userId });

            if (!cartIdForUser) {
                return res.status(403).send({
                    status: false,
                    message: `User is not allowed to update this cart`,
                });
            }

            if (cartId !== cartIdForUser._id.toString()) {
                return res.status(403).send({
                    status: false,
                    message: `User is not allowed to update this cart`,
                });
            }

            const isProductPresentInCart = isCartIdPresent.items.map(
                (product) => (product["productId"] = product["productId"].toString()));

            if (isProductPresentInCart.includes(productId)) {

                const updateExistingProductQuantity = await cartModel.findOneAndUpdate({ _id: cartId, "items.productId": productId },
                    {
                        $inc: { totalPrice: +isProductPresent.price, "items.$.quantity": +1, },
                    }, { new: true });

                return res.status(200).send({
                    status: true, message: "Product quantity updated to cart", data: updateExistingProductQuantity,
                });
            }

            const addNewProductInItems = await cartModel.findOneAndUpdate(
                { _id: cartId },
                {
                    $addToSet: { items: { productId: productId, quantity: 1 } },
                    $inc: { totalItems: +1, totalPrice: +isProductPresent.price },
                },
                { new: true }
            );

            return res.status(200).send({ status: true, message: "Item updated to cart", data: addNewProductInItems, });

        }
        else {
            const isCartPresentForUser = await cartModel.findOne({ userId: userId });

            if (isCartPresentForUser) {
                return res.status(400).send({ status: false, message: "cart already exist, provide cartId in req. body", });
            }

            const productData =
            {
                productId: productId,
                quantity: 1
            }

            const cartData = {
                userId: userId,
                items: [productData],
                totalPrice: isProductPresent.price,
                totalItems: 1,
            };

            const addedToCart = await cartModel.create(cartData);

            return res.status(201).send({ status: true, message: "New cart created and product added to cart", data: addedToCart });
        }
    }

    catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}


const updateCart = async function (req, res) {
    try {
        const data = req.body
        const userId = req.params.userId
        let { removeProduct, productId, cartId } = data


        // if (!isValid(userId)) {
        // res.status(400).send({ status: false, message: 'please provide userId' })
        // return
        //  }

        const userByuserId = await userModel.findById(userId);

        if (!userByuserId) {
            return res.status(404).send({ status: false, message: 'user not found.' });
        }

        //  if(userIdbyParams!==data.userId){
        //    res.status(400).send({status:false, message:"Plz Provide Similar UserId's in params and body"})
        //     return  
        //  }
        // if (!isValidObjId.test(productId)) {
        // return res.status(400).send({ status: false, message: "productId  is not valid" });
        // }




        const isProductPresent = await productModel.findOne({ _id: productId, isDeleted: false })

        if (!isProductPresent) {
            return res.status(404).send({ status: false, message: `Product not found by this productId ${productId}` })
        }

        if (data.hasOwnProperty("cartId")) {

            //  if (!isValid(cartId)) {
            //  return res.status(400).send({ status: false, message: "cartId could not be blank" });
            // }

            //if (!isValidObjId.test(cartId)) {
            //    return res.status(400).send({ status: false, message: "cartId  is not valid" });
            //  }


            const productForUser = await cartModel.findOne({ "items.productId": productId, userId: userId });
            console.log(productForUser)
            if (!productForUser) {
                return res.status(403).send({
                    status: false,
                    message: `Product not present in the cart or not present`,
                });
            }


            const isCartIdPresent = await cartModel.findById(cartId);

            if (!isCartIdPresent) {
                return res.status(404).send({ status: false, message: `Cart not found by this cartId ${cartId}` });
            }




            const cartIdForUser = await cartModel.findOne({ userId: userId, });

            if (!cartIdForUser) {
                return res.status(403).send({
                    status: false,
                    message: `User is not allowed to update this cart`,
                });
            }



            if (cartId !== cartIdForUser._id.toString()) {
                return res.status(403).send({
                    status: false,
                    message: `User is not allowed to update this cart`,
                });
            }

            const isProductPresentInCart = isCartIdPresent.items.map(
                (product) => (product["productId"] = product["productId"].toString()));




            if (removeProduct == 0) {

                if (isProductPresentInCart.includes(productId)) {





                    const updateExistingProductQuantity = await cartModel.findOneAndUpdate({ _id: cartId, "items.productId": productId },
                        {
                            $inc: { totalPrice: -isProductPresent.price, "items.$.quantity": -1, },
                        }, { new: true });

                    return res.status(200).send({
                        status: true, message: "Product quantity updated to cart", data: updateExistingProductQuantity,
                    });



                }

            }

            //  console.log(isCartIdPresent.totalPrice)
            if (removeProduct == 1) {

                let Rproduct = removeProduct
                let removeProductt = Rproduct * (-1)
                // let x = isCartIdPresent.items
                //  for(i=0;i<=x.length;i++){
                //  x[indexOf isProductPresent].quantity
                // console.log(x[i].quantity)
                //   }
                let findQuantity = isCartIdPresent.items.find(x => x.productId.toString() === productId)

                // console.log(findQuantity)
                //  console.log(findQuantity.quantity)

                let totalAmount = (isCartIdPresent.totalPrice) - (isProductPresent.price * findQuantity.quantity)

                console.log(totalAmount)
                const addNewProductInItems = await cartModel.findOneAndUpdate(
                    { _id: cartId },
                    {
                        $pull: { items: { productId: productId } },
                        $inc: { totalItems: removeProductt },
                        $set: { totalPrice: totalAmount }
                    },
                    { new: true }
                );

                return res.status(200).send({ status: true, message: "Item updated to cart", data: addNewProductInItems, });

            }

        }
    }

    catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}



const getCart = async function (req, res) {
    try {

        const userId = req.params.userId


        const isCartIdPresent = await cartModel.findOne({ userId: userId });

        return res.status(400).send({ status: false, message: 'User,s cart', Data: isCartIdPresent })



    }

    catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}




const deleteCart = async function (req, res) {
    try {
       // const data = req.body
        const userId = req.params.userId
      //  let { removeProduct, productId, cartId } = data


        // if (!isValid(userId)) {
        // res.status(400).send({ status: false, message: 'please provide userId' })
        // return
        //  }

      //  const userByuserId = await userModel.findById(userId);

       // if (!userByuserId) {
           // return res.status(404).send({ status: false, message: 'user not found.' });
      //  }

        //  if(userIdbyParams!==data.userId){
        //    res.status(400).send({status:false, message:"Plz Provide Similar UserId's in params and body"})
        //     return  
        //  }
        // if (!isValidObjId.test(productId)) {
        // return res.status(400).send({ status: false, message: "productId  is not valid" });
        // }




        
                const DelCart = await cartModel.findOneAndUpdate(
                    { userId:userId },
                    {
                       $set: { totalPrice: 0,items: [],totalItems:0 }
                    },
                    { new: true }
                );

                return res.status(200).send({ status: true, message: "Item and Products delete in cart", data: DelCart});

            }

        
    

    catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}


module.exports.createCart = createCart

module.exports.updateCart = updateCart

module.exports.getCart = getCart

module.exports.deleteCart = deleteCart