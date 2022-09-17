const config = require('../config/auth.config')
const User = require('../models/user.model')
const Corporate = require('../models/corporate.model')
const OfferedServices = require('../models/offered.service')
const getId = require('../config/getId')
let jwt = require('jsonwebtoken')
let bcrpyt = require('bcryptjs')
const { ObjectId } = require('mongodb')

function handelError(err,res) {
    console.log(err)
    return res.status('Error');
}

exports.userSignUp = async (req,res) => {
    let _password = req.body.password
    if (!_password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,64}$/)) return res.status(406).send('Password format not correct')
    let _email = req.body.email
    if (!_email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) return res.status(406).send('Email format not correct')
    const _plan = req.body.plan
    let _picture = null;
    if (req.body.picture) _picture = req.body.picture;
    else _picture = 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg';
    const newUser = {
        name: req.body.name,
        lastName: req.body.lastName,
        birthDate: new Date(req.body.birthDate),
        username: req.body.username,
        email: _email,
        password: bcrpyt.hashSync(_password, 12),
        plan: _plan,
        picture: _picture,
        offeredServices: [],
        requiredServices: [],
    }

    await User.getUser().insertOne(newUser, async (err) => {
        if (err) handelError(err,res)
        let chosenPlan = newUser.plan;
        if (chosenPlan === 'free') return res.status(201).send(`User:\n${newUser.name}\n${newUser.lastName}\n${newUser.username}\n${newUser.email}\nwas registered successfully with Free Plan!`)
        if (chosenPlan === 'cheap') return res.status(201).send(`User:\n ${newUser.name}\n${newUser.lastName}\n${newUser.username}\n${newUser.email}\nwas registered successfully with Cheap Plan!`)
        if (chosenPlan === 'premium') return res.status(201).send(`User:\n ${newUser.name}\n${newUser.lastName}\n${newUser.username}\n${newUser.email}\nwas registered successfully with Premium Plan!`)
    })
}

exports.corporateSignUp = async (req,res) => {
    let iva = req.body.iva
    if (!iva.match(/^[A-Z]{2}[0-9]{11}$/)) return res.status(406).send('IVA format not correct')
    let email = req.body.email;
    if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) return res.status(406).send('Email format not correct')
    let password = req.body.password;
    if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,64}$/)) return res.status(406).send('Password format not correct.\nIt is required:\n - minimum length 6 characters;\n - at least 1 capital character\n - at least 1 lower case character\n - at least 1 number\n - at least 1 special character: \|')
    let _picture = null;
    if (req.body.picture) _picture = req.body.picture;
    else _picture = 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg';
    const newCorporate = {
        name: req.body.name,
        countryOfResidence: req.body.residence,
        address: req.body.address,
        iva: iva,
        email: email,
        password: bcrpyt.hashSync(password, 12),
        picture: _picture,
        offeredServices: []
    }

    await Corporate.getCorporates().insertOne(newCorporate, async(err) => {
        if (err) handelError(err,res)
        res.status(201).send('Successful registration!')
    })
}


function userPasswordValidation(req,res,user) {
    let passwordIsValid = bcrpyt.compareSync(
        req.body.password,
        user.password
        )
    if (!passwordIsValid) return res.status(401).send('Invalid password!')
    let token = jwt.sign(
        { id: user._id }, 
        config.secret, {
            expiresIn: 172800 // 48 hours
        })
    req.headers.token = token
    res.status(200).send({
        id: user._id,
        username: user.username,
        plan: user.plan,
}

exports.userSignIn = (req,res) => {
    User.getUser().findOne({ username: req.body.username }, async (err,user) => {
        if (err) handelError(err,res)
        const _user = await user
        if (!_user) {
            if (req.body.email) {
                User.getUser().findOne({ email: req.body.email}, async (err, email) => {
                    if (err) handelError(err,res)
                    const _email = await email
                    if (!_email) return res.status(404).send('Email not found!')
                    userPasswordValidation(req,res,_email)
                })
            } else return res.status(404).send('User not found!')
        } else userPasswordValidation(req,res,_user)
    })
}

function corporatePasswordValidation(req,res,corporate) {
    let passwordIsValid = bcrpyt.compareSync(
        req.body.password,
        corporate.password
        )
    if (!passwordIsValid) return res.status(401).send('Invalid password!');
    let token = jwt.sign(
        { id: corporate._id }, 
        config.secret, {
            expiresIn: 172800 // 48 hours
        })
    req.headers.token = token;
    res.status(200).send({
        id: corporate._id,
        name: corporate.name,
        pic: corporate.picture,
        token
    })
}

exports.corporateSignIn = (req,res) => {
    Corporate.getCorporates().findOne({ name: req.body.name }, async (err,corporate) => {
        if (err) handelError(err,res)
        const _user = await corporate
        if (!_user) {
            if (req.body.email) {
                Corporate.getCorporates().findOne({ email: req.body.email}, async (err, email) => {
                    if (err) handelError(err,res)
                    const _email = await email
                    if (!_email) return res.status(404).send('Email not found!')
                    corporatePasswordValidation(req,res,_email)
                })
            } else return res.status(404).send('User not found!')
        } else corporatePasswordValidation(req,res,_user)
    })
}

exports.signOut = async (req,res) => {
    const id = await getId.getId(req)
    try {
        await User.getUser().findOne({ _id: ObjectId(id) }, async (err,user) => {
            if (err) handelError(err,res)
            const _user = await user
            if (!_user) {
                await Corporate.getCorporates().findOne({ _id: ObjectId(id) }, async (err,corporate) => {
                    if (err) handelError(err,res)
                    const _corporate = await corporate;
                    if (!_corporate) return res.status(404).send('User not found')
                })
            }
            req.headers.token = null
            return res.status(200).send('Logout!')
        })
    } catch (err) {
        this.next(err)
    }
}

exports.deleteAccount = async (req,res) => {
    const id = await getId.getId(req)
    User.getUser().deleteOne({ _id: ObjectId(id) }, async (err,_result) => {
        if (err) handelError(err,res)
        const result = await _result
        if (result.deletedCount !== 1) {
            Corporate.getCorporates().deleteOne({ _id: ObjectId(id) }, async (err,result) => {
                if (err) {
                    console.log(err)
                    res.status(500).send('Error')
                }
                const _result = await result
                if (_result.deletedCount !== 1) return res.status(404).send('User not found')
                else {
                    await OfferedServices.getOfferedServices().deleteMany({ user: id }, async (err) => {
                        if (err) handelError(err,res)
                    })
                    return res.status(200).send('Account correctly deleted')
                }
            })
        } else {
            await OfferedServices.getOfferedServices().deleteMany({ user: id }, async (err) => {
                if (err) handelError(err,res)
            })
            return res.status(200).send('Account correctly deleted')
        }
    })
}