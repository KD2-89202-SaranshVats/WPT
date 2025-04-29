const express = require('express')
const pool = require('../db/Mysql')
const cryptoJs = require('crypto-js')
const jwt = require('jsonwebtoken')
const result = require('../utils/result')
const Config = require('../Config/Config')
const router = express.Router()

router.post('/',(req,res)=>{
    const {categoryId,title,details,address,contactNo,ownerName,isLakeView,isTV,isAC,isWifi,isMiniBar,isBreakfast,isParking,guests,bedrooms,beds,bathrooms,rent} = req.body
    const sql = `Insert into property (categoryId,title,details,address,contactNo,ownerName,isLakeView,isTV,isAC,isWifi,isMiniBar,isBreakfast,isParking,guests,bedrooms,beds,bathrooms,rent) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    // const encryptedPassword = cryptoJs.SHA256(password).toString()
    pool.query(sql,[categoryId,title,details,address,contactNo,ownerName,isLakeView,isTV,isAC,isWifi,isMiniBar,isBreakfast,isParking,guests,bedrooms,beds,bathrooms,rent],(error,data)=>{
        res.send(result.createResult(error,data))
    })
})

router.get('/',(req,res)=>{
    // const {id,title,details,rent,profileImage} = req.body
    const sql = `select id,title,details,rent,profileImage from property`
    pool.query(sql,(error,data)=>{
        res.send(result.createResult(error,data))
    })
})

router.get('/:id',(req,res)=>{
    // const {id} = req.params.id
    const sql = `select * from property where id = ?`
    pool.query(sql,[req.params.id],(error,data)=>{
        res.send(result.createResult(error,data))
    })
})

module.exports = router