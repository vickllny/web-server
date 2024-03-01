var express = require('express');
const { chatWithGPT } = require('../api/openaiService')

var router = express.Router();

router.post('/', async function(req, res, next) {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).send({ error: 'Prompt is required' });
  }
  try {
    const response = await chatWithGPT(prompt);
    res.send({ response });
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

module.exports = router;
