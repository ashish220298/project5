const mongoose = require('mongoose');
const userModel = require("../model/userModel")
const productModel = require("../model/productModel")
const cartModel = require("../model/cartModel")
const orderModel = require("../model/orderModel")



const createOrder = async function (req, res) {
    try {
        const data = req.body
        const userId = req.params.userId
        let { cartId, cancellable, status } = data


        // if (!isValid(userId)) {
        // res.status(400).send({ status: false, message: 'please provide userId' })
        // return
        //  }

        const userByuserId = await userModel.findById(userId);

        if (!userByuserId) {
            return res.status(404).send({ status: false, message: 'user not found.' });
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
            let totalQuantity = isCartIdPresent.items.map((x) => x.quantity)

            console.log(totalQuantity)


            const initialValue = 0;
            const Quantity = totalQuantity.reduce(
                (previousValue, currentValue) => previousValue + currentValue,
                initialValue
            );

            console.log(Quantity);

            const OrderData = {
                userId: userId,
                items: isCartIdPresent.items,
                totalPrice: isCartIdPresent.totalPrice,
                totalItems: isCartIdPresent.totalItems,
                totalQuantity: Quantity,
                cancellable: cancellable,
                status: status
            };

            const Order = await orderModel.create(OrderData);

            const UpdateCart = await cartModel.findOneAndUpdate(
                { userId: userId, _id: cartId },
                {
                    $set: { totalPrice: 0, items: [], totalItems: 0 }
                },
                { new: true }
            );

            let fname = userByuserId.fname
            let lname = userByuserId.lname


            return res.status(200).send({ status: true, message: `Order placed Congratulations, Thank You  ${fname} ${lname}`, data: UpdateCart });


        }
    }

    catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}




const updateStatusOrder = async function (req, res) {
    try {
        const data = req.body
        const userId = req.params.userId
        let { orderId, status } = data


      

        const userByuserId = await userModel.findById(userId);

        if (!userByuserId) {
            return res.status(404).send({ status: false, message: 'user not found.' });
        }



        if (data.hasOwnProperty("orderId")) {

          
            const isOrderPresent = await orderModel.findOne({ _id: orderId, userId: userId, isDeleted: false });
            console.log(isOrderPresent)
              if (!isOrderPresent) {
             return res.status(404).send({ status: false, message: `Order not found by this user ${userId}` });
              }

            // const cartIdForUser = await cartModel.findOne({ userId: userId });
            console.log(isOrderPresent.cancellable)
            if (isOrderPresent.cancellable == true) {

                console.log(isOrderPresent.cancellable)
                if (status == "cancled") {

                    const Updateorder = await orderModel.findOneAndUpdate(
                        { userId: userId, _id: orderId },
                        {
                            $set: { status: status }
                        },
                        { new: true }
                    );


                    return res.status(403).send({
                        status: false,
                        message: `User is not allowed to update this cart`, Data: Updateorder
                    });

                } else {

                    const Updateorder = await orderModel.findOneAndUpdate(
                        { userId: userId, _id: orderId },
                        {
                            $set: { status: status }
                        },
                        { new: true }
                    );


                    return res.status(403).send({
                        status: false,
                        message: `User is not allowed to update this cart`, data: Updateorder,
                    });
                }


            }
            if (isOrderPresent.cancellable == false && status !== "cancled") {

                const Updateorder = await orderModel.findOneAndUpdate(
                    { userId: userId, _id: orderId },
                    {
                        $set: { status: status }
                    },
                    { new: true }
                );


                return res.status(403).send({
                    status: false,
                    message: `User is not allowed to update this cart`, data: Updateorder,
                });
            } else {

                return res.status(403).send({
                    status: false,
                    message: `Order is not canceble`
                });
            }



        }
    }

    catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}





module.exports.createOrder = createOrder

module.exports.updateStatusOrder = updateStatusOrder


