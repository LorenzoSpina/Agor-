const CryptoJS = require('crypto-js')

module.exports = {
    decrypt: (data) => {
        let result = CryptoJS.AES.decrypt(data, process.env.REACT_APP_SECRET_KEY)
        result = result.toString(CryptoJS.enc.Utf8)
        return result
    }
}