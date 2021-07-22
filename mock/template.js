/*
 * @Author: strick
 * @Date: 2021-02-02 11:41:55
 * @LastEditTime: 2021-07-22 10:42:09
 * @LastEditors: strick
 * @Description: 模板接口
 * @FilePath: /strick/shin-admin/mock/template.js
 */
module.exports = {
  'GET /api/template/query' (req, res) {
    res.json({
      code: 0,
      data: [{
          "id": "123456",
          "url": "//www.pwstrick.com/upload/avatar.png",
          "name": "freedom" + Math.round(Math.random() * 10),
          "status": 0,
          "price": 9.8,
          "date": "2021-01-05T15:19:30.000Z",
          "udate": "2021-01-05T15:19:30.000Z",
          "urls": ["http://www.pwstrick.com", "https://www.cnblogs.com/strick"],
          "icon": [
            '//www.pwstrick.com/upload/avatar.png',
            '//www.pwstrick.com/usr/uploads/2020/02/4250591636.jpg',
          ],
          "csv": [
            {nick: "justify", uid: "1"},
            {nick: "freedom", uid: "2"}
          ],
          "file": [
            '//www.pwstrick.com/upload/avatar.png'
          ]
        }, {
          "id": "234567",
          "url": "//www.pwstrick.com/usr/uploads/2020/02/4250591636.jpg",
          "name": "justify" + Math.round(Math.random() * 10),
          "status": 1,
          "price": 18,
          "date": "2021-01-05T15:19:29.000Z",
          "udate": "2021-01-05T15:19:30.000Z",
          "urls": [],
          "icon": [],
          "csv": [],
        }, {
          "id": "345678",
          "url": "//www.pwstrick.com/upload/avatar.png",
          "name": "盐汽水真好喝",
          "status": 2,
          "price": 12,
          "date": "2021-01-05T15:17:52.000Z",
          "udate": "2021-01-05T15:19:30.000Z",
          "urls": [],
          "icon": [],
          "csv": [],
        }, 
        {
          "id": "4",
          "url": "//www.pwstrick.com/usr/uploads/2020/02/4250591636.jpg",
          "name": "jane",
          "status": 2,
          "price": 12,
          "date": "2021-01-05T15:17:52.000Z",
          "udate": "2021-01-05T15:19:30.000Z",
          "urls": [],
          "icon": [],
          "csv": [],
        }, {
          "id": "5",
          "url": "//www.pwstrick.com/upload/avatar.png",
          "name": "小靖轩",
          "status": 2,
          "price": 12,
          "date": "2021-01-05T15:17:52.000Z",
          "udate": "2021-01-05T15:19:30.000Z",
          "urls": [],
          "icon": [],
          "csv": [],
        }, {
          "id": "6",
          "url": "//www.pwstrick.com/usr/uploads/2020/02/4250591636.jpg",
          "name": "凯文",
          "status": 2,
          "price": 12,
          "date": "2021-01-05T15:17:52.000Z",
          "udate": "2021-01-05T15:19:30.000Z",
          "urls": [],
          "icon": [],
          "csv": [],
        }, {
          "id": "7",
          "url": "//www.pwstrick.com/upload/avatar.png",
          "name": "超级飞侠",
          "status": 2,
          "price": 12,
          "date": "2021-01-05T15:17:52.000Z",
          "udate": "2021-01-05T15:19:30.000Z",
          "urls": [],
          "icon": [],
          "csv": [],
        }, {
          "id": "8",
          "url": "//www.pwstrick.com/usr/uploads/2020/02/4250591636.jpg",
          "name": "乐迪",
          "status": 2,
          "price": 12,
          "date": "2021-01-05T15:17:52.000Z",
          "udate": "2021-01-05T15:19:30.000Z",
          "urls": [],
          "icon": [],
          "csv": [],
        }, {
          "id": "9",
          "url": "//www.pwstrick.com/upload/avatar.png",
          "name": "小爱",
          "status": 2,
          "price": 12,
          "date": "2021-01-05T15:17:52.000Z",
          "udate": "2021-01-05T15:19:30.000Z",
          "urls": [],
          "icon": [],
          "csv": [],
        }
      ],
      count: Math.round(Math.random() * 100),
    });
  },
  'POST /api/get' (req, res) {
    res.json({
      code: 0,
      data: {
        "id": "123456",
      }
    });
  },
  'POST /api/gets' (req, res) {
    res.json({
      code: 0,
      data: [{
          "id": "123456",
        }
      ],
      count: Math.round(Math.random() * 100),
    });
  },
  'POST /api/head' (req, res) {
    res.json({
      code: 0,
      data: 100
    });
  },
  'POST /api/post' (req, res) {
    res.json({
      code: 0,
      data: {
        "id": "123456",
      }
    });
  },
  'POST /api/put' (req, res) {
    res.json({
      code: 0,
    });
  },
  'POST /api/template/create': (req, res) => {
    res.json({
      msg: '信息提示',
      code: 0,
    });
  },
  'POST /api/template/handle': (req, res) => {
    res.json({
      code: 0,
    });
  },
}