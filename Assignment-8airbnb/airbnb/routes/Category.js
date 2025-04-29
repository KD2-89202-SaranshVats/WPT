const express = require('express')
const pool = require('../db/Mysql')
const cryptoJs = require('crypto-js')
const jwt = require('jsonwebtoken')
const result = require('../utils/result')
const Config = require('../Config/Config')
const multer = require('multer')
const router = express.Router()

//upload here is a middleware
const upload = multer({dest: 'images'})

router.post('/',upload.single('icon'),(req,res)=>{
    const {title , details} = req.body
    const fileName = req.file.filename

    const sql = `Insert into category (title,details,image) values (?,?,?)`
    pool.query(sql,[title,details,fileName],(error,data)=>{
            res.send(result.createResult(error,data))
    })
})

router.get('/',(req,res)=>{
    const sql = `select id,title,details,image from category`
    pool.query(sql,(error,data)=>{
        res.send(result.createResult(error,data))
    })
})

module.exports = router