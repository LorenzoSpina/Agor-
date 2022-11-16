const authJwt = require("../middlewares/middleware_auth/authJwt");
const OfferedService = require('../models/offered.service');
const getId = require('../config/getId');
const User = require('../models/user.model');
const Corporate = require('../models/corporate.model');
const express = require("express");
const rateLimit = require('express-rate-limit')


const recordRoutesforOfferedServices = express.Router();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const ObjectId = require("mongodb").ObjectId;

function handleErr (err,res) {
  console.log(err);
  return res.status(500).send('Error');
}

recordRoutesforOfferedServices.route("/listings-offered-services").get(apiLimiter, async (req, res) => {
  await OfferedService
      .getOfferedServices()
      .find()
      .toArray(async (err, result) => {
        if (err) handleErr(err,res);
        else {
          const _result = await result;
          res.status(200).json(_result);
        }
      });
    })

recordRoutesforOfferedServices.route("/offered-services").get(apiLimiter, async (req,res) => {
  const _search = req.query.search;
  await OfferedService
    .getOfferedServices()
    .createIndex({
      title: "text",
      place: "text"
    })
  await OfferedService
    .getOfferedServices()
    .find({
      $text: {
        $search: _search
      }
    })
    .toArray(async (err,result) => {
      if (err) handleErr(err,res);
      else {
        const _result = await result;
        res.status(200).json(_result);
      }
    })
})

recordRoutesforOfferedServices.route("/listings-offered-services-user").get(authJwt.verifyToken, apiLimiter, async (req,res) => {
  const id = await getId.getId(req);
  await User.getUser().findOne({ _id: ObjectId(id) }, async (err,user) => {
    if (err) handleErr(err,res);
    const us = await user;
    let idServices = [];
    if (us === null) {
      await Corporate.getCorporates().findOne({ _id: ObjectId(id) }, async (err,corporate) => {
        if (err) handleErr(err,res);
        const _corp = await corporate;
        if (_corp === null) return res.status(404).send('User not found');
        idServices = await _corp.offeredServices;    
        OfferedService.getOfferedServices().find({ _id: { $in: idServices } }).toArray(async (err,result) => {
          if (err) handleErr(err,res);
          const _result = await result;
          res.status(200).send(_result);
        })
      })
    } else {
      idServices = await us.offeredServices;    
      OfferedService.getOfferedServices().find({ _id: { $in: idServices } }).toArray(async (err,result) => {
        if (err) handleErr(err,res);
        const _result = await result;
        res.status(200).send(_result);
      })
    }
  })
})



recordRoutesforOfferedServices.route("/add-offered-service").post(authJwt.verifyToken, apiLimiter, async (req, res) => {
  const id = await getId.getId(req);

  await User.getUser().findOne({ _id: ObjectId(id) }, async (err,user) => {
    if (err) handleErr(err,res);
    const _user = await user;
    if (_user === null) {
      await Corporate.getCorporates().findOne({ _id: ObjectId(id) }, async (err,corp) => {
        if (err) handleErr(err,res);
        const _corp = await corp;
        if (_corp === null) return res.status(404).send('User not found');
        const matchDocument = {
          title: req.body.title,
          description: req.body.description,
          price: req.body.price,
          place: req.body.place,
          picture: req.body.picture,
          dataCreation: new Date(),
          lastUpdate: new Date(),
          user: _corp.name
        };
        await OfferedService
        .getOfferedServices()
        .insertOne(matchDocument, async (err, result) => {
          if (err) handleErr(err,res);
          const _result = await result;
          await Corporate.getCorporates().updateOne(
            { _id: ObjectId(id) },
            { $push: { offeredServices: _result.insertedId } })
            return res.status(201).send('Post correctly inserted');
        })
      })
    } else {
      if (_user.plan === 'free' && _user.offeredServices.length === 0 || _user.plan === 'cheap' && _user.offeredServices.length < 3 || _user.plan === 'premium') {
        const matchDocument = {
          title: req.body.title,
          description: req.body.description,
          price: req.body.price,
          place: req.body.place,
          picture: req.body.picture,
          dataCreation: new Date(),
          lastUpdate: new Date(),
          user: _user.username
        };
        OfferedService
        .getOfferedServices()
        .insertOne(matchDocument, async (err, result) => {
          if (err) handleErr(err,res);
          const _result = await result;
          await User.getUser().updateOne(
            { _id: ObjectId(id) },
            { $push: { offeredServices: _result.insertedId } })
        })
        return res.status(201).send('Post correctly inserted');
      } else {
        return res.status(401).send('You do not have the right plan. Remember:\n-free plan => one post\n-cheap plan => three posts\npremium plan => unlimited posts');
      }
    }
  })
})

recordRoutesforOfferedServices.route("/service-offered/:service_id").get(apiLimiter, async (req, res) => {
  let query = req.params.service_id;
  await OfferedService
  .getOfferedServices()
  .findOne({ _id: ObjectId(query) }, async (err, result) => {
      if(err) throw err;
      const _result = await result;
      if (!_result) return res.status(404).send('Post not found')
      res.json(_result);
  });
})

recordRoutesforOfferedServices.route("/update-offered-service").patch(authJwt.verifyToken, apiLimiter, async (req, res) => {
  const idPost = req.query.idPost;
  let newService = {
      $set: {
        picture: req.body.picture,
        title: req.body.title,
        description: req.body.description,
        place: req.body.place,
        price: req.body.price
      },
      $currentDate: { lastUpdate: true } 
  }
  const idUser = await getId.getId(req);
  await User.getUser().findOne({ _id: ObjectId(idUser) }, async (err,user) => {
    if (err) handleErr(err,res);
    const _user = await user;
    let services = [];
    if (_user === null) {
      await Corporate.getCorporates().findOne({ _id: ObjectId(idUser) }, async (err,corporates) => {
        if (err) handleErr(err,res);
        const _corporate = await corporates;
        if (_corporate === null) return res.status(404).send('User not found!');
        services = await _corporate.offeredServices.map(x => x.toString());
        if (!services.includes(idPost)) return res.status(404).send('Post not found');
        await OfferedService.getOfferedServices().updateOne({ _id: ObjectId(idPost) }, newService, async (err,result) => {
          if (err) handleErr(err,res);
          const _result = await result;
          if (_result.modifiedCount !== 1) return res.status(404).send('Post not found');
          return res.status(200).send('Post updated!');
        })
      })
    } else {
      services = await _user.offeredServices.map(x => x.toString());
      if (!services.includes(idPost)) return res.status(404).send('Post not found');
      await OfferedService.getOfferedServices().updateOne({ _id: ObjectId(idPost) }, newService, async (err,result) => {
        if (err) handleErr(err,res);
        const _result = await result;
        if (_result.modifiedCount !== 1) return res.status(404).send('Post not found');
        return res.status(200).send('Post updated!');
      }) 
    }  
  })
})

recordRoutesforOfferedServices.route('/delete-offered-service').delete(authJwt.verifyToken, apiLimiter, async function(req, res) {
  const idUser = await getId.getId(req);
  let idPost = req.query.idPost;
  await User.getUser().findOne({ _id: ObjectId(idUser) }, async (err,user) => {
    if (err) handleErr(err,res);
    const _user = await user;
    let services = [];
    if (_user === null) {
      await Corporate.getCorporates().findOne({ _id: ObjectId(idUser) }, async (err,corporate) => {
        if (err) handleErr(err,res);
        const _corporate = await corporate;
        if (_corporate === null) return res.status(404).send('User not found');
        services = await _corporate.offeredServices.map(x => x.toString());
        if (!services.includes(idPost)) return res.status(404).send('Post not found!');
        await OfferedService.getOfferedServices().deleteOne({ _id: ObjectId(idPost) }, async (err,result) => {
          if (err) handleErr(err,res);
          const _result = await result;
          if (_result.deletedCount !== 1) return res.status(404).send('Post not found');
          await Corporate.getCorporates().updateOne({ _id: _corporate._id }, { $pull: { offeredServices: ObjectId(idPost)} }, async (err) => {
            if (err) handleErr(err,res);
          })
          return res.status(200).send('Post deleted');
        })
      })
    }
    else {
      services = await _user.offeredServices.map(x => x.toString());
      if (!services.includes(idPost)) return res.status(404).send('Post not found!');
      await OfferedService.getOfferedServices().deleteOne({ _id: ObjectId(idPost) }, async (err,result) => {
        if (err) handleErr(err,res);
        const _result = await result;
        if (_result.deletedCount !== 1) return res.status(404).send('Post not found');
        await User.getUser().updateOne({ _id: _user._id }, { $pull: { offeredServices: ObjectId(idPost) } }, async (err) => {
          if (err) handleErr(err,res);
        })
        return res.status(200).send('Post deleted!');
      })
    }
  })
});

  module.exports = recordRoutesforOfferedServices; 
  