/**
 *  File Name   : mongo.js
 *  Author      : Binit Rai <binitcse@gmail.com>
 *  Description : Schema definition of mongo db
 *  Version     : 1.0
 *  Packege     : backend-assignment
 *  Last update : 18 Dec 2016
 */

const dbUrl = "mongodb://localhost:27017/assDb"
var mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence');

mongoose.connect(dbUrl);

var custSchema =   mongoose.Schema({
    "customer_id"    : { type : Number },
    "email"          : { type : String, required : true, unique : true },
    "referral_id"    : { type : Number, default : null },
    "payback"        : { type : Number, default : 0 },
    "is_ambassador"  : { type : Boolean, default : false },
    "joining_date"   : { type : Date },
    "last_updated"   : { type : Date }
});

custSchema.pre('save', function (next) {
  let currentDate = new Date();
  this.last_updated = currentDate;

  if (!this.joining_date) {
  	this.joining_date = currentDate;
  }
  next();
});

custSchema.pre('findOneAndUpdate', function (next) {
  let currentDate = new Date();
  this.last_updated = currentDate;
  next();
});

var custModal = mongoose.model('custModal', custSchema);

custSchema.plugin(AutoIncrement, {inc_field: 'customer_id'});

module.exports = custModal;