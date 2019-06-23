const express = require('express'),
  router = express.Router(),
  fs = require('fs')

router.get('/login', function (req, res) {
  const code = req.query.code;
  res.render('login',{
    code:code
  });
})

router.get('/index', function (req, res) {
  fs.readFile(
    `${process.cwd()}/static/build/index.html`, (err, _html) => {
      if (err) {
        console.log(err)
        res.writeHead(404, {
          'Content-Type': 'text/html; charset=utf-8'
        })
      } else {
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8'
        })
        res.write(_html.toString())
      }
      res.end()
    })
})

module.exports = router
