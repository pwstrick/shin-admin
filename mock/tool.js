/*
 * @Author: strick
 * @Date: 2021-02-02 15:04:44
 * @LastEditTime: 2021-02-02 15:13:47
 * @LastEditors: strick
 * @Description: 通用配置
 * @FilePath: /strick/shin-admin/mock/tool.js
 */
module.exports = {
  'GET /api/tool/short/query' (req, res) {
    res.json({
      code: 0,
      data: [
        {
          "id": 5,
          "short": "fmgAB",
          "url": "http://www.pwstrick.com",
          "ctime": "2021-02-02T06:55:26.000Z",
          "mtime": "2021-02-02T06:55:26.000Z",
          "status": 1
        }, {
          "id": 4,
          "short": "2QJ5Re",
          "url": "https://www.cnblogs.com/strick",
          "ctime": "2021-02-02T06:54:05.000Z",
          "mtime": "2021-02-02T06:54:05.000Z",
          "status": 1
        }, {
          "id": 1,
          "short": "4kVtNe",
          "url": "https://github.com/pwstrick/daily",
          "ctime": "2021-01-26T08:28:26.000Z",
          "mtime": "2021-01-26T08:28:26.000Z",
          "status": 1
        }
      ],
      count: 100,
    });
  },
  'POST /api/tool/short/create': (req, res) => {
    res.json({
      code: 0,
    });
  },
  'POST /api/tool/short/del': (req, res) => {
    res.json({
      code: 0,
    });
  },
  'GET /api/tool/config/query' (req, res) {
    res.json({
      code: 0,
      data: [
        {
          "id": 1,
          "title": "前端程序员面试宝典",
          "content": "{\"a\":1}",
          "key": "db06c78d1e24cf708a14ce81c9b617ec",
          "ctime": "2021-01-29T07:00:21.000Z",
          "mtime": "2021-02-02T07:13:19.000Z",
          "status": 1
        }, {
          "id": 2,
          "title": "前端躬行记",
          "content": "{\"b\":1}",
          "key": "2fdc1497ee00ad036bbd53c83bae603f",
          "ctime": "2021-02-02T07:13:08.000Z",
          "mtime": "2021-02-02T07:13:08.000Z",
          "status": 1
        }
      ],
      count: 100,
    });
  },
  'POST /api/tool/config/create': (req, res) => {
    res.json({
      code: 0,
    });
  },
  'POST /api/tool/config/del': (req, res) => {
    res.json({
      code: 0,
    });
  },
}