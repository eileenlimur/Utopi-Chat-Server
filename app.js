const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const app = express();

require('dotenv').config();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.post('/api/translate', function(req, res) {
  const languageTranslator = new LanguageTranslatorV3({
    version: '2018-05-01',
    authenticator: new IamAuthenticator({
      apikey: process.env.TRANSLATOR_API_KEY
    }),
    serviceUrl: process.env.TRANSLATOR_ENDPOINT
  });
  const translateParams = {
    text: req.body.text,
    target: req.body.target_language
  };
  languageTranslator.translate(translateParams)
  .then(translationResult => {
    res.send(JSON.stringify(translationResult, null, 2));
  })
  .catch(err=> {
    res.send(JSON.stringify(err));
  });
});

module.exports = app;