const authJwt = require("../middlewares/middleware_auth/authJwt");
const OfferedService = require('../models/offered.service');
const getId = require('../config/getId');
const User = require('../models/user.model');
const Corporate = require('../models/corporate.model');
const express = require("express");

const recordRoutesforOfferedServices = express.Router();

const ObjectId = require("mongodb").ObjectId;

function handleErr (err,res) {
  console.log(err);
  return res.status(500).send('Error');
}

recordRoutesforOfferedServices.route("/listings-offered-services").get(async (req, res) => {
  await OfferedService
      .getOfferedServices()
      .find()
      .toArray(async (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send('Error');
        } else {
          const _result = await result;
          res.status(200).json(_result);
        }
      });
    })

recordRoutesforOfferedServices.route("/listings-offered-services/:id").get(async (req,res) => {
  const _user = req.params.id;
  await User.getUser().findOne({ _id: ObjectId(_user) }, async (err,user) => {
    if (err) handleErr(err,res);
    const us = await user;
    let idServices = [];
    if (us === null) {
      await Corporate.getCorporates().findOne({ _id: ObjectId(_user) }, async (err,corporate) => {
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

recordRoutesforOfferedServices.route("/add-offered-service").post(authJwt.verifyToken, async (req, res) => {
  const id = await getId.getId(req);
  const matchDocument = {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    place: req.body.place,
    dataCreation: new Date(),
    lastUpdate: new Date(),
    user: id
  };

  await User.getUser().findOne({ _id: ObjectId(id) }, async (err,user) => {
    if (err) handleErr(err,res);
    const _user = await user;
    if (_user === null) {
      await Corporate.getCorporates().findOne({ _id: ObjectId(id) }, async (err,corp) => {
        if (err) handleErr(err,res);
        const _corp = await corp;
        if (_corp === null) return res.status(404).send('User not found');
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

recordRoutesforOfferedServices.route("/service-offered/:service_id").get(async (req, res) => {
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

recordRoutesforOfferedServices.route("/update-offered-service/:id").patch(authJwt.verifyToken, async (req, res) => {
  let query = req.params.id;
  let newService = {
      $set: req.body,
      $currentDate: { lastUpdate: true } 
  }
  const id = await getId.getId(req);
  await User.getUser().findOne({ _id: ObjectId(id) }, async (err,user) => {
    if (err) handleErr(err,res);
    const _user = await user;
    let services = [];
    if (_user === null) {
      await Corporate.getCorporates().findOne({ _id: ObjectId(id) }, async (err,corporates) => {
        if (err) handleErr(err,res);
        const _corporate = await corporates;
        if (_corporate === null) return res.status(404).send('User not found!');
        services = await _corporate.offeredServices.map(x => x.toString());
        if (!services.includes(query)) return res.status(404).send('Post not found');
        await OfferedService.getOfferedServices().updateOne({ _id: ObjectId(query) }, newService, async (err,result) => {
          if (err) handleErr(err,res);
          const _result = await result;
          if (_result.modifiedCount !== 1) return res.status(404).send('Post not found');
          return res.status(200).send('Post updated!');
        })
      })
    } else {
      services = await _user.offeredServices.map(x => x.toString());
      if (!services.includes(query)) return res.status(404).send('Post not found');
      await OfferedService.getOfferedServices().updateOne({ _id: ObjectId(query) }, newService, async (err,result) => {
        if (err) handleErr(err,res);
        const _result = await result;
        if (_result.modifiedCount !== 1) return res.status(404).send('Post not found');
        return res.status(200).send('Post updated!');
      }) 
    }  
  })
})

recordRoutesforOfferedServices.route('/delete-offered-service/:id').delete(authJwt.verifyToken, async function(req, res) {
  const id = await getId.getId(req);
  let query = req.params.id;
  await User.getUser().findOne({ _id: ObjectId(id) }, async (err,user) => {
    if (err) handleErr(err,res);
    const _user = await user;
    let services = [];
    if (_user === null) {
      await Corporate.getCorporates().findOne({ _id: ObjectId(id) }, async (err,corporate) => {
        if (err) handleErr(err,res);
        const _corporate = await corporate;
        if (_corporate === null) return res.status(404).send('User not found');
        services = await _corporate.offeredServices.map(x => x.toString());
        console.log(services)
        if (!services.includes(query)) return res.status(404).send('Post not found!');
        await OfferedService.getOfferedServices().deleteOne({ _id: ObjectId(query) }, async (err,result) => {
          if (err) handleErr(err,res);
          const _result = await result;
          if (_result.deletedCount !== 1) return res.status(404).send('Post not found');
          await Corporate.getCorporates().updateOne({ _id: _corporate._id }, { $pull: { offeredServices: ObjectId(query)} }, async (err) => {
            if (err) handleErr(err,res);
          })
          return res.status(200).send('Post deleted');
        })
      })
    }
    else {
      services = await _user.offeredServices.map(x => x.toString());
      if (!services.includes(query)) return res.status(404).send('Post not found!');
      await OfferedService.getOfferedServices().deleteOne({ _id: ObjectId(query) }, async (err,result) => {
        if (err) handleErr(err,res);
        const _result = await result;
        if (_result.deletedCount !== 1) return res.status(404).send('Post not found');
        await User.getUser().updateOne({ _id: _user._id }, { $pull: { offeredServices: ObjectId(query) } }, async (err) => {
          if (err) handleErr(err,res);
        })
        return res.status(200).send('Post deleted!');
      })
    }
  })
});

  module.exports = recordRoutesforOfferedServices; 
  