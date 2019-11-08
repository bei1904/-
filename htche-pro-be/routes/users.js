var express = require('express');
var router = express.Router();
var userModel = require('../models/userModel');
var bcrypt = require("bcrypt");

var saltRound = 10;

var jwt = require('jsonwebtoken');
var secret = 'ljh';

/* GET users listing. */
router.get('/reg', (req, res) => {
  let {
    userphone,
    psw
  } = req.query;
  userModel.find({
    userphone: userphone
  }).then((result) => {
    if (result.length == 0) {
      bcrypt.hash(psw, saltRound, (err, hashPsw) => {
        if (!err) {
          new userModel({
            userphone: userphone,
            psw: hashPsw,
          }).save().then((result) => {
            res.send({
              code: 1,
              msg: "注册成功！",
            });
          });
        }
      });
    } else {
      res.send({
        code: 0,
        msg: "用户名已存在！",
      });
    }
  });
});

router.get('/login', function (req, res, next) {
  let {
    userphone,
    psw
  } = req.query;
  userModel.find({
    userphone: userphone
  }).then((result) => {
    if (result.length == 0) {
      res.send({
        code: 0,
        msg: "用户名不存在!",
      });
    } else {
      let hashPsw = result[0].psw;
      bcrypt.compare(psw, hashPsw, (err, data) => {
        if (data) {
          let token = jwt.sign({login: true}, secret);
          res.send({
            code: 1,
            msg: "登录成功！",
            data: token,
          });
        } else {
          res.send({
            code: 0,
            mgs: "密码错误！",
          });
        }
      });
    }
  });
});

router.get('/login/verify', (req, res) => {
  let token = req.query.token;
  jwt.verify(token, secret, (err, data) => {
    if (!err) {
      res.send({
        code: 1,
        msg: "验证合法！",
      });
    } else {
      res.send({
        code: 0,
        msg: "验证不合法！",
      })
    }
  });
});

module.exports = router;