const express = require('express')
const pool = require('../db/Mysql')
const cryptoJs = require('crypto-js')
const jwt = require('jsonwebtoken')
const result = require('../utils/result')
const Config = require('../Config/Config')
const router = express.Router()

router.post('/registration',(req,res)=>{
    const {firstName,lastName,email,password,phoneNumber} = req.body
    const sql = `Insert into user (firstName,lastName,email,password,phoneNumber) VALUES (?,?,?,?,?)`
    const encryptedPassword = cryptoJs.SHA256(password).toString()
    pool.query(sql,[firstName,lastName,email,encryptedPassword,phoneNumber],(error,data)=>{
        res.send(result.createResult(error,data))
    })
})

router.post('/login',(req,res)=>{
    const {email,password} = req.body
    const sql = `select * from user where email = ? and password = ?`
    const encryptedPassword = cryptoJs.SHA256(password).toString()
    pool.query(sql,[email,encryptedPassword],(error,data)=>{
        if(data){
            if(data.length!=0){
                const user = data[0]
                if(user.isDeleted==1){
                    res.send(result.createErrorResult('User Account has been deleted!!!'))
                }
                else{
                    const payload = {
                        id:user.id
                    }
                    const token = jwt.sign(payload,Config.secret)
                    const firstName = user.firstName
                    const lastName = user.lastName
                    const userData = {
                        token : token,
                        name : firstName + " " + lastName    
                    }
                    res.send(result.createSuccessResult(userData))
                }      
            }
            else{
                res.send(result.createErrorResult('Invalid email or password'))
            }
        }
        else{
            res.send(result.createErrorResult(error))
        }
    })
})

router.get('/profile',(req,res)=>{
    const sql = `select * from user where id = ?`
    pool.query(sql,[req.headers.id],(error,data)=>{
        if(data)
            if(data.length!=0){
                const user = data[0]
                if(user.isDeleted==1){
                    res.send(result.createErrorResult('Cannot get the user!!!Something went wrong!!!'))
                }
                else{
                    const userData = {
                        firstName : user.firstName,
                        lastName : user.lastName,
                        phoneNumber : user.phoneNumber,
                        email : user.email
                    }
                    res.send(result.createSuccessResult(userData))
                }
            }
    })
        
    })

router.put('/profile',(req,res)=>{
    const sql = `update user set firstName = ?, lastName = ? , phoneNumber = ? where id = ? and isDeleted=0`
    pool.query(sql,[req.body.firstName,req.body.lastName,req.body.phoneNumber,req.headers.id],(error,data)=>{
        if(data.isDeleted==0){
            res.send(result.createSuccessResult(data))
        }
        else{
            res.send(result.createErrorResult('Cannot modify!!User has been deleted!!'))
        }
        
    })
})

router.delete('/delete',(req,res)=>{
    const sql = 'update user set isDeleted = 1 where id = ?'
    pool.query(sql,[req.headers.id],(error,data)=>{
        res.send(result.createResult(error,data))
    })
})

module.exports = router