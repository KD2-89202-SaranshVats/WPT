const express = require('express')
const pool = require('../db/Mysql')
const cryptoJs = require('crypto-js')
const jwt = require('jsonwebtoken')
const result = require('../utils/result')
const Config = require('../Config/Config')
const router = express.Router()

router.post('/booking',(req,res)=>{
    const {userId,propertyId,fromDate,toDate,total} = req.body
    const sql = `Insert into bookings (userId,propertyId,fromDate,toDate,total) VALUES (?,?,?,?,?)`
    pool.query(sql,[req.headers.id,propertyId,fromDate,toDate,total],(error,data)=>{
        res.send(result.createResult(error,data))
    })
})

router.get('/booking',(req,res)=>{
    const sql = `select * from bookings where userId = ?`
    pool.query(sql,[req.headers.id],(error,data)=>{
        res.send(result.createResult(error,data))
    })
})

module.exports = router