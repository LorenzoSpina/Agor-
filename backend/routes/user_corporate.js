const User = require('../models/user.model');
const Corporate = require('../models/corporate.model');
const OfferedService = require('../models/offered.service');
const RequiredService = require('../models/required.service');
const express = require('express');
const { ObjectID } = require('bson');

const router = express.Router();

function handelError(err,res) {
    console.log(err);
    return res.status(500).send('Error');
}

router.route('/list-users').get(async (req,res) => {
    await User.getUser().find().toArray(
        async (err,result) => {
            if (err) handelError(err,res);
            const _result = await result;
            res.status(200).json(_result);
        }
    )
})

router.route('/list-corporates').get(async (req,res) => {
    await Corporate.getCorporates().find().toArray(
        async (err,result) => {
            if (err) handelError(err,res);
            const _result = await result;
            res.status(200).json(_result);
        }
    )
})

router.route('/all-users').get(async (req,res) => {
    let _result = [];
    await Corporate.getCorporates().find().toArray(
        async (err,result) => {
            if (err) handelError(err,res);
            const _result_ = await result;
            _result.push(_result_);
        }
    )
    await User.getUser().find().toArray(
        async (err,result) => {
            if (err) handelError(err,res);
            const _result_= await result;
            _result.push(_result_);
            res.status(200).json(_result)
        }
    )
})

router.route('/get-user-id').get(async (req,res) => {
    const idPost = req.query.idPost;
    await OfferedService.getOfferedServices().findOne({ _id: ObjectID(idPost) }, async (err,result) => {
        if (err) handelError(err,res);
        const _result = await result;
        if (!_result) {
            await RequiredService.getRequiredServices().findOne({ _id: ObjectID(idPost) }, async (err,result) => {
                if (err) handelError(err,res);
                const _result_ = await result;
                if (!_result_) return res.status(404).send('Post not found!');
                else {
                    await User.getUser().findOne({ username: _result_.user }, async (err,result) => {
                        if (err) handelError(err,res);
                        const us = await result;
                        return res.status(200).send(us._id);
                    })
                }
            })
        } else {
            await User.getUser().findOne({ username: _result.user }, async (err,result) => {
                if (err) handelError(err,res);
                const us = await result;
                if (!us) {
                    await Corporate.getCorporates().findOne({ name: _result.user }, async (err,result) => {
                        if (err) handelError(err,res);
                        const corp = await result;
                        return res.status(200).send(corp._id);
                    })
                } else {
                    return res.status(200).send(us._id);
                }
            })
        }
    })
})

router.route('/get-user').get(async (req,res) => {
    const idUser = req.query.idUser;
    await User.getUser().findOne({ _id: ObjectID(idUser) }, async (err,result) => {
        if (err) handelError(err,res);
        const user = await result;
        if (!user) {
            await Corporate.getCorporates().findOne({ _id: ObjectID(idUser) }, async (err,result_) => {
                if (err) handelError(err,res);
                const _user = await result_;
                if (!_user) return res.status(404).send('User not found!');
                return res.status(200).json(_user);
            })
        } else {
            return res.status(200).json(user);
        }
    })
})

module.exports = router;