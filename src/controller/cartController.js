const mongoose = require('mongoose');
const userModel = require("../model/userModel")
const productModel = require("../model/productModel")
const cartModel = require("../model/cartModel")



const createCart = async function (req, res) {
    try {
        const data = req.body
        const userIdbyParams = req.params.userId
        let { userId, productId, cartId } = data


        const userByuserId = await userModel.findById(userIdbyParams);

        if (!userByuserId) {
            return res.status(404).send({ status: false, message: 'user not found.' });
        }

        if (userIdbyParams !== data.userId) {
            res.status(400).send({ status: false, message: "Plz Provide Similar UserId's in params and body" })
            return
        }
       



        const isProductPresent = await productModel.findOne({ _id: productId, isDeleted: false })

        if (!isProductPresent) {
            return res.status(404).send({ status: false, message: `Product not found by this productId ${productId}` })
        }

        if (data.hasOwnProperty("cartId")) {

           
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


        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "userId is not a type of objectId" })
        }

        if (!mongoose.isValidObjectId(cartId)) {
            return res.status(400).send({ status: false, msg: "cartId is not a type of objectId" })
        }
        const userByuserId = await userModel.findById(userId);

        if (!userByuserId) {
            return res.status(404).send({ status: false, message: 'user not found.' });
        }

        if (!productId) return res.status(400).send({ status: false, msg: "ProductId must be Present" })
        if (!removeProduct) return res.status(400).send({ status: false, msg: "removeProduct must be Present" })
        if (!cartId) return res.status(400).send({ status: false, msg: "cartId must be Present" })



        const isProductPresent = await productModel.findOne({ _id: productId, isDeleted: false })

        if (!isProductPresent) {
            return res.status(404).send({ status: false, message: `Product not found by this productId ${productId}` })
        }

        if (data.hasOwnProperty("cartId")) {

           

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



            if (!/^[0,1]{1}$/.test(removeProduct)) {
                return res.status(400)
                    .send({ status: false, msg: "removeProduct should be Present and removeproduct Should be 0 for perticular product Decrease and 1 for perticular product remove" });
            }
            console.log(removeProduct)
            if (removeProduct == 0) {

                if (isProductPresentInCart.includes(productId)) {
                    const updateExistingProductQuantity = await cartModel.findOneAndUpdate({ _id: cartId, "items.productId": productId },
                        {
                            $inc: { totalPrice: -isProductPresent.price, "items.$.quantity": -1, },
                        }, { new: true });

                    return res.status(200).send({ status: true, message: "Product quantity updated to cart", data: updateExistingProductQuantity });
                }
            }

            //  console.log(isCartIdPresent.totalPrice)
            if (removeProduct == 1) {

                let Rproduct = removeProduct
                let removeProductt = Rproduct * (-1)

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

        const userByuserId = await userModel.findById(userId);

        if (!userByuserId) {
            return res.status(404).send({ status: false, message: 'user not found.' });
        }

        const isCartIdPresent = await cartModel.findOne({ userId: userId });

        if (!isCartIdPresent) {
            return res.status(404).send({ status: false, message: 'cret not found.' });
        }


        return res.status(400).send({ status: false, message: 'User,s cart', Data: isCartIdPresent })



    }

    catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}




const deleteCart = async function (req, res) {
    try {

        const userId = req.params.userId

        const userByuserId = await userModel.findById(userId);

        if (!userByuserId) {
            return res.status(404).send({ status: false, message: 'user not found.' });
        }

        const isCartIdPresent = await cartModel.findOne({ userId: userId });

        if (!isCartIdPresent) {
            return res.status(404).send({ status: false, message: 'cret not found.' });
        }

        const DelCart = await cartModel.findOneAndUpdate(
            { userId: userId },
            {
                $set: { totalPrice: 0, items: [], totalItems: 0 }
            },
            { new: true }
        );

        return res.status(200).send({ status: true, message: "Item and Products delete in cart", data: DelCart });

    }




    catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}


module.exports.createCart = createCart

module.exports.updateCart = updateCart

module.exports.getCart = getCart

module.exports.deleteCart = deleteCart