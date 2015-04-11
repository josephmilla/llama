'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RegisterSchema = new Schema({
  f_id: String,
  nativeLang: String,
  learningLang: String
});

module.exports = mongoose.model('Register', RegisterSchema);