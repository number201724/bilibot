const http = require('http');
const https = require('https');
const querystring = require("querystring");

const g_headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-Hans-CN, zh-Hans; q=0.5',
    'Content-Type': 'application/x-www-form-urlencoded',
    	//store your cookie
    'Cookie': '',
    'Referer': 'https://live.bilibili.com/1313',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134'
};


async function sendGift(itemObject) {
    let options = {
        host: 'api.live.bilibili.com',
        path: '/gift/v2/live/bag_send',
        method: 'POST',
        headers: g_headers
    };

    let data = querystring.stringify({
        bag_id: itemObject.bag_id,
        biz_id: 793902,
        biz_code: 'live',
        csrf_token: 'eecb53f5f1a609ac039661c84e050c89',
        gift_id: itemObject.gift_id,
        gift_num: itemObject.gift_num,
        metadata: '',
        platform: 'pc',
        price: 0,
        rnd: 1528806822,
        ruid: 1526101,
        storm_beat_id: 0,
        uid: 0,
        visit_id: '54l95ztsmups'
    });

    const req = https.request(options, (res) => {
        if (res.statusCode === 200) {
            res.on('data', (d) => {
                let data = JSON.parse(d);
                if (data.code === 0) {
                    console.log(new Date().toLocaleString() +'    ' + '成功赠送' + itemObject.gift_num.toString() + '个' + itemObject.gift_name);
                }
            });
        }
    });

    req.write(data);
    req.end();
}

setInterval(function () {
    let options = {
        host: 'api.live.bilibili.com',
        path: '/gift/v2/gift/bag_list',
        method: 'GET',
        headers: g_headers
    };

    const req = https.request(options, (res) => {
        if (res.statusCode === 200) {
            res.on('data', (d) => {
                let data = JSON.parse(d);
                if (data.code === 0) {
                    data.data.list.forEach((object) => {
                        sendGift(object);
                    });
                }
            });
        }
    });

    req.on('error', (e) => {
        //console.error(e);
    });
    req.end();
}, 5000);

