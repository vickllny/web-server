var express = require('express');

//本地开发使用
const { HttpsProxyAgent } = require('https-proxy-agent')
const httpAgent = new HttpsProxyAgent('http://127.0.0.1:7890')

var OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: "",
  httpAgent
});


var router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "gpt-3.5-turbo",
  });
  
  console.log(completion.choices[0]);
  res.send(completion.choices[0]);
});

module.exports = router;
