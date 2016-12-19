/**
 *  File Name   : server.js
 *  Author      : Binit Rai <binitcse@gmail.com>
 *  Description : Node API functions
 *  Version     : 1.0
 *  Packege     : backend-assignment
 *  Last update : 18 Dec 2016
 */


/**
 * API List :
 * 1. addCustomer (Post): Done
 * 2. getCustomerById (Get): Done
 * 3. addReferral (Post): Done
 * 4. fetchAllChildren (Get) : Done
 * 5. fetchAllCustomersWithReferralCount(Get) : Done
 * 6. addAmbassador (Get): Done
 * 7. convertCustomerToAmbassador (Get) : Done
 * 8. fetchAllAmbassadorChildren (Get): Done
 * 9. fetchChildrenAtNthLEvel (Get): Done
 */

// require modules
var express    = require("express");
var bodyParser = require("body-parser");
var mongoOp    = require("./models/mongo");

var app    = express();
var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));


// Define payback ammount and percentage
const PAYBACK = {
    normal     : 30,
    ambassador : 10,
    fee        : 100
};

// Calculate payBack and other API utility functions
var util = {
    getPayBack : function (isAmbassador = false, payback = 0, second = false) {
        var netPayBack = payback; 

        if (second) {
            netPayBack += (PAYBACK.fee * PAYBACK.ambassador) / 100;
            return netPayBack;
        }

        netPayBack += (PAYBACK.fee * PAYBACK.normal) / 100;
        if (isAmbassador) {
            netPayBack += (PAYBACK.fee * PAYBACK.ambassador) / 100;
        }

        return netPayBack;
    },

    sortArray : function (arr) {
        arr.sort(function(a, b) {
            return parseInt(a.totalReferal) - parseInt(b.totalReferal);
        });
        return arr;
    }
};

// Mongo operation Query wrapper object definition
var dbQuery = {

    // Search by parameter where sQuery is an object.
    getData : function (sQuery, callback) {
        var response = {};
        mongoOp.find(sQuery, function(err, data) {
            if (err) {
                response = {
                    "error" : true, 
                    "message" : err
                };
            } else {
                response = {
                    "error" : false, 
                    "message" : data
                };
            }
            callback(response);
        });
    },

    // save Data first time. addCustomer (For Adding A new Customer)
    saveData : function (data, callback) {
        var db = new mongoOp();
        var response = {};

        for (let i in data) {
            db[i] = data[i];
        }

        db.save(function(err){
            if(err) {
                response = {
                    "error" : true, 
                    "message" : err
                };
            } else {
                response = {
                    "error" : false, 
                    "message" : "Customer added"
                };
            }
            callback(response);
        });
    },

    // Find and update data in database
    findOneAndReplace : function (find, replace, callback) {
        var response = {};
        mongoOp.findOneAndUpdate(find, replace, function(err, res) {
            if (err) {
                response = {
                    'error' :  true, 
                    "message" : err
                }
            } else {
                response = {
                    "error" :  false, 
                    "message" : "row updated"
                }
            }
            callback(response);
        });
    }
 
};


// testing without having any parameter
router.get("/", function (req, res) {
    res.json({
        "error" : false, 
        "message" : "Testing on main root"
    });
});


/**
 *  API : addCustomer (post)
 *  body : {email : '<email id>'} (JSON)
 */
router.route("/addCustomer")
    .get(function (req, res) {
        dbQuery.getData({}, function (response) {
            res.json(response);
        });
    })
    .post(function (req, res) {
        let data = {
            email : req.body.email
        };
        dbQuery.saveData(data, function (response) {
            res.json(response);
        });
    });


/**
 *  API : addAmbassador (post)
 *  body : {email : '<email id>'} (JSON)
 */
router.route("/addAmbassador")
    .post(function (req, res) {
        let data = {
            email : req.body.email, 
            is_ambassador : true
        };
        dbQuery.saveData(data, function (response) {
            res.json(response);
        });
    });

/**
 *  API : addReferral (post)
 *  body : {email : '<email id>', referral_id : '<existing cutumer id>'} (JSON)
 */
router.route("/addReferral")
    .post(function (req, res) {

        let sQuery = {
            customer_id : req.body.referral_id
        };
        dbQuery.getData(sQuery, function (response) {

            if (!response.error) {
                if (response.message.length) {

                    let data = {
                        email : req.body.email, 
                        referral_id : req.body.referral_id
                    };
                    dbQuery.saveData(data, function (sR) {
                        if (!sR.error) {

                            var pCustumer = response.message[0];
                            let {
                                is_ambassador,
                                payback
                            } = pCustumer;

                            let replace = {
                                payback : util.getPayBack(is_ambassador, payback)
                            };
                            let find = {
                                customer_id : req.body.referral_id
                            };
                            dbQuery.findOneAndReplace(find, replace, function (pR) {
                                if (pCustumer.referral_id !== null) {
                                    
                                    let sQuery = {
                                        customer_id : pCustumer.referral_id
                                    };
                                    dbQuery.getData(sQuery, function (aR) {
                                        if (!aR.error) {
                                            let aCust = aR.message[0];
                                            if (aCust.is_ambassador) {
                                                
                                                let {
                                                    is_ambassador,
                                                    payback
                                                } = aCust;

                                                let find = {
                                                    customer_id : aCust.customer_id
                                                };
                                                let replace = {
                                                    payback : util.getPayBack(is_ambassador, payback, true)
                                                };

                                                dbQuery.findOneAndReplace(find, replace, function (apR) {
                                                    res.json(apR);
                                                });

                                            } else {
                                                res.json(aR);
                                            }
                                        } else {
                                            res.json(aR);
                                        }
                                    });

                                } else {
                                    res.json(pR);
                                }
                            })
                        } else {
                            res.json(sR);
                        }
                    });
                } else  {
                    res.json({
                            "error" : true, 
                            "message" : "Referral id is not valid"
                        })
                }
            } else {
                res.json(response);
            }
        });
    });


/**
 *  API : getCustomerById (Get)
 *  eg  : getCustomerById/12.
 */
router.route("/getCustomerById/:id")
    .get(function(req, res){
        let sQuery = {
            customer_id : req.params.id
        };
        dbQuery.getData(sQuery, function (response) {
            res.json(response);
        })
    });


/**
 *  API : convertCustomerToAmbassador (put)
 *  eg  : convertCustomerToAmbassador/13
 */
router.route("/convertCustomerToAmbassador/:id")
    .put(function(req, res) {
        var is_ambassador = true;
        let find = {
            customer_id : req.params.id
        };
        if (typeof req.body.is_ambassador !== undefined) {
            is_ambassador = req.body.is_ambassador
        } 
        let replace = {
            is_ambassador : is_ambassador
        };

        dbQuery.findOneAndReplace(find, replace, function (response) {
            res.json(response);
        })
    });


/**
 *  API : fetchAllChildren (Get)
 *  eg  : fetchAllChildren/15
 */
router.route("/fetchAllChildren/:id")
    .get(function(req, res) {
        let sQuery = {
            referral_id : req.params.id
        };
        dbQuery.getData(sQuery, function (response) {
            response.totalChilds = response.message.length;
            res.json(response);
        })
    });


/**
 *  API : fetchAllAmbassadorChildren (Get)
 *  eg  : fetchAllAmbassadorChildren/15
 */
router.route("/fetchAllAmbassadorChildren/:id")
    .get(function(req, res) {
        var childs = [], totalChilds = 0, _i = 0;
        
        let sQuery = {
            referral_id : req.params.id
        };
        dbQuery.getData(sQuery, function (response) {
            if (!response.error) {
                var childrens = response.message;
                totalChilds = childrens.length;
                for (let i in childrens) {
                    let child = childrens[i];
                    childs.push(child);
                    if (child.referral_id !== null) {

                        let sQuery = {
                            referral_id : child.customer_id
                        }
                        dbQuery.getData(sQuery, function (sResponse) {
                            for (let j in sResponse.message) {
                                childs.push(sResponse.message[j]);
                            }
                            _i++;
                            if (totalChilds == _i) {
                                res.json({
                                    "error" : false, 
                                    "message" : childs
                                });
                            }
                        })
                    } else {
                        _i++;
                    }
                    if (totalChilds == _i) {
                        res.json({
                            "error" : false, 
                            "message" : childs
                        });
                    }
                }
            }
        })
    });



/**
 *  API : fetchChildrenAtNthLEvel (Get)
 *  eg  : fetchChildrenAtNthLEvel/id/15/level/1
 */
router.route("/fetchChildrenAtNthLEvel/id/:id/level/:level")
    .get(function(req, res) {
        var childs = []; var totalChilds = 0; var _i = 0;
        let sQuery = {referral_id : req.params.id};
        dbQuery.getData(sQuery, function (response) {
            if (!response.error) {
                var childrens = response.message;
                totalChilds = childrens.length; 
                 if (req.params.level == 1)   {
                    res.json({
                        "totalChilds" : childrens.length, 
                        "error" : false, 
                        "message" : childrens
                    });
                } else {
                    for (let i in childrens) {
                        let child = childrens[i];
                        childs.push(child);
                        if (child.referral_id !== null) {

                            let sQuery = {
                                referral_id : child.customer_id
                            }
                            dbQuery.getData(sQuery, function (sResponse) {
                                for (let j in sResponse.message) {
                                    childs.push(sResponse.message[j]);
                                }
                                _i++;
                                if (totalChilds == _i) {
                                    res.json({
                                        "totalChilds" : childs.length, 
                                        "error" : false, 
                                        "message" : childs
                                    });
                                }
                            })
                        } else {
                            _i++;
                        }
                        if (totalChilds == _i) {
                            res.json({
                                "totalChilds" : childs.length, 
                                "error" : false, 
                                "message" : childs
                            });
                        }
                    }
                }
            } else {
                res.json(response);
            }
        })
    });


/**
 *  API : fetchAllCustomersWithReferralCount (Get)
 *  eg  : /fetchAllCustomersWithReferralCount.
 */
router.route("/fetchAllCustomersWithReferralCount")
    .get(function(req, res){
        var custList = [];
        dbQuery.getData({}, function (response) {
            if (!response.error) {
                var custs = response.message;
                var totalCusts = response.message.length;
                var _i = 0;
                for (let i in custs) {
                    let cust = custs[i];
                    
                    let sQuery = {
                        referral_id : cust.customer_id
                    };
                    dbQuery.getData(sQuery, function (sResponse) {
                        
                        let c = {
                           customer_id  : cust.customer_id,
                           email        : cust.email,
                           totalReferal : sResponse.message.length
                        };

                        custList.push(c);
                        _i++

                        if (_i == totalCusts) {
                            custList = util.sortArray(custList);
                            res.json(custList);
                        }
                    })
                }

            } else {
                res.json(response);
            }
        })
    });


app.use('/',router);
app.listen(3000);

console.log("Listening to PORT 3000");