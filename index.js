var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');


const API_BASE_URL = "http://20.244.56.144/evaluation-service/stocks";
const TOKEN = process.env.STOCKS_API_TOKEN;

router.get('/stocks', async (req, res) => {
  try {
    const apiRes = await fetch(API_BASE_URL, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    if (!apiRes.ok) {
      return res.status(apiRes.status).json({ error: "Failed to fetch stocks" });
    }
    const data = await apiRes.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stocks/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    const { minutes } = req.query;

    let url = `${API_BASE_URL}/${ticker}`;
    if (minutes) url += `?minutes=${minutes}`;

    const apiRes = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    if (!apiRes.ok) {
      return res.status(apiRes.status).json({ error: "Failed to fetch stock data" });
    }
    const data = await apiRes.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
