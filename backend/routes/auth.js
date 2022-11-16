const ExpressBrute = require('express-brute')

const verify = require ('../middlewares/middleware_auth/modules')
const controller = require('../controllers/auth.controller')

const store = new ExpressBrute.MemoryStore()
const bruteForce = new ExpressBrute(store)

module.exports = (app) => {

    app.post('/user/signup',
    [
        verify.verifySignUp.checkDuplicateUsernameOrEmail,
        verify.verifySignUp.checkPlanExisted
    ],
    controller.userSignUp
    )

    app.post('/corporate/signup', verify.verifySignUp.checkDuplicateCorporate, controller.corporateSignUp)

    app.post('/user/login', bruteForce.prevent, controller.userSignIn)
    app.post('/corporate/login', bruteForce.prevent, controller.corporateSignIn)

    app.post('/logout', verify.authJwt.verifyToken, controller.signOut)
    app.delete('/delete_account', controller.deleteAccount)
    app.patch('/update-user', controller.updateAccount)
}