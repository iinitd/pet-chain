# pet-chain

莱茨狗抢购助手。

支持验证码，提供手动输入和百度ocr自动识别两种方式。

# 首次使用

1. 安装node环境

2. clone项目到本地

3. 修改配置 config.js

4. 运行 node index.js

# 配置说明

- cookie

    在chrome中打开 https://pet-chain.baidu.com/chain/dogMarket 进入调试模式 查看 cookie 并填入

- baidu_ocr

    在 https://ai.baidu.com/tech/ocr/general 注册文字识别应用 填入相关 key

- yzm_method

    manual: 手动输入
    baidu: 百度文字识别

- threshold

    逗号隔开的五个数字，从左到右依次是从低到高稀有度的最高购买阈值。超过阈值的条目均不会显示在命令行中。

# 其他说明

1. 查询超时是百度服务器没有返回相关数据，只需让脚本继续重试即可

2. 在手动验证码模式下，需要手动输入 yzm.png 中的内容，并敲 enter 进入购买环节。

3. 由于验证码的存在，抢狗存在失败几率，请耐心尝试~