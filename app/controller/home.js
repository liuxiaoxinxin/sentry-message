'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, sentry-message server is working!';
  }
}

module.exports = HomeController;
