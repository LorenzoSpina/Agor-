const express = require("express");
const RequiredServices = require("../models/required.service");
const User = require("../models/user.model");
const authJwt = require("../middlewares/middleware_auth/authJwt");
const getId = require("../config/getId");
const rateLimit = require('express-rate-limit')

const recordRoutesForRequiredServices = express.Router();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const ObjectId = require("mongodb").ObjectId;

function handleErr(err,res) {
  console.log(err);
  return res.status(500).send('Error');
}

recordRoutesForRequiredServices.route("/listings-required-services").get(apiLimiter, async (req, res) => {
    await RequiredServices
    .getRequiredServices()
    .find()
    .toArray(async (err, result) => {
      if (err) handleErr(err,res);
      const _result = await result;
      res.status(200).send(_result);
    });
})

recordRoutesForRequiredServices.route("/required-services").get(apiLimiter, async (req,res) => {
  const _search = req.query.search;
  await RequiredServices
    .getRequiredServices()
    .createIndex({
      title: "text",
      place: "text"
    })
  await RequiredServices
    .getRequiredServices()
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

recordRoutesForRequiredServices.route("/listings-required-services-user").get(authJwt.verifyToken, apiLimiter, async (req,res) => {
  const id = await getId.getId(req);
  await User.getUser().findOne({ _id: ObjectId(id) }, async (err,user) => {
    if (err) handleErr(err,res);
    const _user = await user;
    if (!_user) return res.status(404).send('User not found');
    const idServices = await _user.requiredServices;
    await RequiredServices.getRequiredServices().find({ _id: { $in: idServices } }).toArray(async (err,result) => {
      if (err) handleErr(err,res);
      const _result = await result;
      res.status(200).send(_result);
    })
  })
})

recordRoutesForRequiredServices.route("/add-required-service").post(authJwt.verifyToken, apiLimiter, async (req, res) => {
  const id = await getId.getId(req);
  await User.getUser().findOne({ _id: ObjectId(id)}, async (err,user) => {
    if (err) handleErr(err,res);
    const _user = await user;
    if (!_user) return res.status(404).send('User not found');
    const creationDate = new Date();
    const _creationDate = creationDate.getTime();
    const requiredDate = new Date(req.body.dataRequired);
    const _requiredDate = requiredDate.getTime();
    if (_requiredDate < _creationDate) return res.status(400).send('Data required not valid!');
    const matchDocument = {
      title: req.body.title,
      description: req.body.description,
      place: req.body.place,
      picture: req.body.picture,
      dataRequired: requiredDate,
      dataCreation: creationDate,
      lastUpdate: new Date(),
      user: _user.username
    };
    await RequiredServices.getRequiredServices().insertOne(matchDocument, async (err,result) => {
      if (err) handleErr(err,res);
      const _result = await result;
      await User.getUser().updateOne({ _id: _user._id}, { $push: { requiredServices: _result.insertedId }})
    })
    return res.status(201).send('Post correctly inserted');
  })
});

recordRoutesForRequiredServices.route("/service-required/:service_id").get(async (req, res) => {
  let query = req.params.service_id;
  await RequiredServices
  .getRequiredServices()
  .findOne({ _id: ObjectId(query) }, async (err, result) => {
      if(err) handleErr(err,res);
      const _result = await result;
      res.status(200).send(_result);
  });
})


recordRoutesForRequiredServices.route("/update-required-service").patch(apiLimiter, async function(req, res) {
  const idUser = await getId.getId(req);
  let idPost = req.query.idPost;
  await User.getUser().findOne({ _id: ObjectId(idUser) }, async (err,user) => {
    if (err) handleErr(err,res);
    const _user = await user;
    if (!_user) return res.status(404).send('User not found');
    const services = await _user.requiredServices.map(x => x.toString());
    if (!services.includes(idPost)) return res.status(404).send('Post not found')
    await RequiredServices.getRequiredServices().findOne({ _id: ObjectId(idPost) }, async (err,post) => {
      if (err) handleErr(err,res);
      const _post = await post;
      if (!_post) return res.status(404).send('Post not found');
      let newService = null;
      if (req.body.dataRequired) {
        const requiredData = new Date(req.body.dataRequired).getTime();
        const creationDate = _post.dataCreation.getTime();
        if (requiredData < creationDate) return res.status(400).send('Required data is not valid');
        newService = {
          $set: { picture: req.body.picture,
                  title: req.body.title,
                  description: req.body.description,
                  place: req.body.place,
                  dataRequired: new Date(req.body.dataRequired) },
          $currentDate: { lastUpdate: true }
        }
        await RequiredServices.getRequiredServices().updateOne({ _id: _post._id }, newService, async(err) => {
          if (err) handleErr(err,res);
          return res.status(200).send('Post correctly updated');
        })
      } else {
        newService = {
          $set: req.body,
          $currentDate: { lastUpdate: true }
        }
        await RequiredServices.getRequiredServices().updateOne({ _id: _post._id }, newService, async (err) => {
          if (err) handleErr(err,res);
          return res.status(200).send('Post correctly updated');
        })
      }
    })
  })
});   



recordRoutesForRequiredServices.route("/delete-required-service").delete(authJwt.verifyToken, apiLimiter, async (req, res) => {
  const idUser = await getId.getId(req);
  let idPost = req.query.idPost;
  await User.getUser().findOne({ _id: ObjectId(idUser) }, async (err,user) => {
    if (err) handleErr(err);
    const _user = await user;
    if (!_user) return res.status(404).send('User not found');
    const services = await _user.requiredServices.map(x => x.toString());
    if (!services.includes(idPost)) return res.status(404).send('Post not found');
    await RequiredServices.getRequiredServices().deleteOne({ _id: ObjectId(idPost) }, async (err,result) => {
      if (err) handleErr(err,res);
      const _result = await result;
      if (_result.deletedCount !== 1) return res.status(404).send('Post not found');
      await User.getUser().updateOne({ _id: _user._id }, { $pull: { requiredServices: ObjectId(idPost)  } }, async (err) => {
        if (err) handleErr(err,res);
      })
      return res.status(200).send('Post correctly deleted');
    })
  })
})

  module.exports=recordRoutesForRequiredServices; 