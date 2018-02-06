'use strict';

const ocr = require('./baidu_ocr/AipOcr')
const fs = require("fs")
let config;
try{
    config = require("./config.m")
} catch(e){
    config = require("./config") 
}
const prompt = require('prompt')
var Base64 = require('js-base64').Base64;
const axios = require("axios").create({
    headers: { 'Cookie': config.cookie }
});
var apiQueryPetsOnSale = 'https://pet-chain.baidu.com/data/market/queryPetsOnSale';
var apiTxnCreate = 'https://pet-chain.baidu.com/data/txn/create';
const apiGen = 'https://pet-chain.baidu.com/data/captcha/gen'

const time = new Date().getTime()

console.log(config)

const pr = (v) => {
    return new Promise(function(resolve, reject) {
        prompt.get(v, function(err, result) {
            if (err) reject(err)
            resolve(result)
        });
    })
}




const APP_ID = config.baidu_ocr.APP_ID
const API_KEY = config.baidu_ocr.API_KEY
const SECRET_KEY = config.baidu_ocr.SECRET_KEY
const client = new ocr(APP_ID, API_KEY, SECRET_KEY);

function requirements(pet) {
    return pet.amount <= config.threshold[pet.rareDegree]
}


(async function() {
    let cnt = 0

    while (cnt++ < config.query_amount||3000) {

        try {
            console.log(`第${cnt}次查询！`)
            const pets = await axios.post(apiQueryPetsOnSale, {
                "pageNo": 1,
                "pageSize": 20,
                "querySortType": "AMOUNT_ASC",
                "petIds": [],
                "lastAmount": null,
                "lastRareDegree": null,
                "requestId": time,
                "appId": 1,
                "tpl": ""
            })

            for (let i = 0; i < pets.data.data.petsOnSale.length; i++) {

                let pet = pets.data.data.petsOnSale[i]

                if (!requirements(pet)) continue;

                console.log(pet)

                const yzm = await axios.post(apiGen, {
                    "requestId": time,
                    "appId": 1,
                    "tpl": ""
                })

                fs.writeFileSync('yzm.png', yzm.data.data.img, 'base64');
                let yzm_res;
                if (config.yzm_method == "baidu") {
                    var image = fs.readFileSync("yzm.png").toString("base64")
                    const path = __dirname + "/yzm.png"
                    const yzm_baidu = await client.generalBasic(image, { language_type: "ENG" })
                    yzm_res = yzm_baidu.words_result[0].words
                }
                if (config.yzm_method == "manual") {
                    // 
                    prompt.start();
                    const yzm_m = await pr("yzm")
                    yzm_res = yzm_m.yzm
                }

                const res = await axios.post(apiTxnCreate, {
                    "validCode": pet.validCode,
                    "seed": yzm.data.data.seed,
                    "captcha": yzm_res,
                    "petId": pet.petId,
                    "requestId": time,
                    "amount": pet.amount,
                    "appId": 1,
                    "tpl": ""
                })

                console.log(res.data)

            }
        } catch (e) {

            console.log("查询超时...")

        }
    }


})()