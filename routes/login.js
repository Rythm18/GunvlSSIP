const express = require('express')

const router = express.Router()

// error router
router.get('/temp', (req, res) => {
  res.render('log.ejs')
})

module.exports = router
