module.exports = {
    cookie: "",
    baidu_ocr: { // 百度开放平台ocr
        APP_ID: "",
        API_KEY: '',
        SECRET_KEY: ''
    },
    reverse:true, // 从后往前购买
    yzm_method:"manual", // "baidu" || "manual"
    threshold:[1400,1400,1400,1400,1400,1400], // 普通、稀有、卓越、史诗、神话、传说
    query_amount:3000, //查询次数
    show_affordable_message:true //显示是否买得起的信息
}