var express = require('express');
var path = require('path');
var webpack = require('webpack');
var webpackMiddleware = require("webpack-dev-middleware");
var config = require('./webpack.config');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);