'use strict';

const Controller = require('egg').Controller;
const axios = require('axios');
const CircularJSON = require('circular-json');

const WechatWebHook = '填写你的webhook地址';

class SentryController extends Controller {
    /**
     * 接收Sentry发送过来的Webhook
     */
    async recvSentryWebhook() {
        const { ctx } = this;
        const { request: { body } } = ctx;
        // const error = body.data && body.data.error;
        ctx.logger.info(body);
        if (!body.project || !body.message) {
            ctx.body = {
                status: 'error',
                msg: '参数为空',
            };    
            return;
        }

        const robotData = {
            msgtype: 'markdown',
            markdown: {
                content: `<font color=\"warning\">${body.project_name}</font>发生错误:
                    > 错误原因: <font color=\"info\">${body.message}</font>
                    > 错误时间: <font color=\"info\">${this.fmtDateTime()}</font>
                    > 错误级别: <font color=\"${body.level === 'fatal' ? '#FF0000' : '#008000'}\">${body.level}</font>
                    > 错误链接: [查看日志](${body.url})`,
            },
        };

        const result = await axios({
            url: WechatWebHook,
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            data: JSON.stringify(robotData),
        });

        ctx.body = {
            status: 'success',
            data: CircularJSON.stringify(result),
            msg: '提醒成功',
        };
    }

    /**
    * 对当前时间进行格式化
    */
    fmtDateTime() {
        const date = new Date();
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        let hour = date.getHours();
        let min = date.getMinutes();

        month = month < 10 ? `0${month}` : month;
        hour = hour < 10 ? `0${hour}` : hour;
        min = min < 10 ? `0${min}` : min;

        return `${year}-${month}-${date.getDate()} ${hour}:${min}`;
    };

}

module.exports = SentryController;

