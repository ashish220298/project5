const userModel = require("../model/userModel")




const createuser = async(req, res) => {
    try {
        let data = req.body
            //  data validation

        let { phone, name, title, email, password, address } = data


        if (data === undefined || Object.keys(data).length === 0) return res.status(400).send({ status: false, msg: "plz enter some data" })

        // name validation
        console.log(typeof name)
        if (name === undefined) return res.status(400).send({ status: false, msg: "first name must be present" });
        if (typeof name !== "string" || name.trim().length === 0) return res.status(400).send({ status: false, msg: "fname should be string" });

        let nname = /^[a-zA-z ]{2,30}$/.test(name.trim())
        if (!nname) return res.status(400).send({ status: false, msg: "enter valid  name" })

        data.name = data.name.trim()


        // title validation
        if (!title.trim()) return res.status(400).send({ status: false, msg: "title must be present" });
        if (typeof title !== "string") return res.status(400).send({ status: false, msg: "title should be string" });
        if (!(["Mr", "Mrs", "Miss"].includes(data.title.trim()))) return res.status(400).send({ status: false, msg: "plz write valid title" })
        data.title = data.title.trim()
            // email validation
        if (!email.trim()) {
            return res.status(400).send({ status: false, msg: "email must be present" });
        }

        let regx = /^([a-zA-Z0-9\._]+)@([a-zA-Z])+\.([a-z]+)(.[a-z])?$/

        let x = regx.test(email.trim())
        if (!x) {
            return res.status(400).send({ status: false, msg: "write the correct format for email" })
        }
        let mail = await userModel.findOne({ email: email.trim().toLowerCase() })

        if (mail) return res.status(400).send({ status: false, msg: "this email is already present" })
        data.email = data.email.trim().toLowerCase()

        // password validation
        if (!password.trim()) return res.status(400).send({ status: false, msg: "plz write the password" });
        if (typeof password !== "string" || password.trim().length === 0) return res.status(400).send({ status: false, msg: "enter valid password" });

        let pass = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#\$%\^&\*])(?=.*[A-Z]).{8,16}$/.test(password.trim())

        if (!pass) return res.status(400).send({ status: false, msg: "1.At least one digit, 2.At least one lowercase character,3.At least one uppercase character,4.At least one special character, 5. At least 8 characters in length, but no more than 16" })
        data.password = data.password.trim()
            // Phone va
        let mob = /^[0-9]{10}$/
        if (!mob.test(phone.trim())) {
            return res.status(400).send({ status: false, msg: " phone number should have 10 digits only" });
        }

        if (Object.values(phone.trim()).length < 10 || Object.values(phone.trim()).length > 10) {
            return res.status(400).send({ status: false, msg: "Enter the vailid mobile number" });
        }
        let call = await userModel.findOne({ phone: phone.trim() })

        if (call) return res.status(400).send({ status: false, msg: "this phone is already present" })
        data.phone = data.phone.trim()
            // address validation 
        if (address) {
            if (!address.street || !address.street.trim().toLowerCase()) return res.status(400).send({ status: false, msg: "in address street must be present" })
            address.street = address.street.trim().toLowerCase()
            if (!address.street || !address.city.trim().toLowerCase()) return res.status(400).send({ status: false, msg: "in address city must be present" })
            address.city = address.city.trim().toLowerCase()
            if (!address.pincode || !address.pincode.trim()) return res.status(400).send({ status: false, msg: "in address pincode must be present present" })
            let pin = /^[0-9]{6}$/.test(address.pincode.trim())
            if (!pin) return res.status(400).send({ status: false, msg: " Address pincode Only have Number and 6 number only " })
            address.pincode = address.pincode.trim()
        }
        let user = await userModel.create(data)

        return res.status(201).send({ status: true, data: user })
    } catch (err) {
        res.status(500).send({ status: "error", msg: err.message })
    }
}




module.exports.createuser = createuser