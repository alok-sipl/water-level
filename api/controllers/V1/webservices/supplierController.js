/**
 * V1/webservices/supplierController
 *
 * @description :: Server-side logic for managing v1/webservices/suppliers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var db = sails.config.globals.firebasedb();

module.exports = {
    /*
     * Name: supplierListing
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: add new supplier
     * @param  req
     */
    supplierListing: function (req, res) {
        console.log('Supplier Post param-->', req.body);
        if (req.body != undefined && req.body.userId != '' && req.body.userId != undefined && req.body.tankCity != '' && req.body.tankCity != undefined && req.body.tankArea != '' && req.body.tankArea != undefined) {

            console.log('111');var userId = req.body.userId;
            var latitude = req.body.tankCity;
            var longitude = req.body.tankArea;
            var tankCapacity = (req.body.tankCapacity && req.body.tankCapacity != undefined) ? req.body.tankCapacity : 0;
            var jsonData = [];
            var favouritesSuppliresId = [];
            var array = [];
            var favouritesSupplires = "";
            var reflikedSuppliers = db.ref("likes");
            reflikedSuppliers.orderByChild('user_id').equalTo(userId).once("value",
                function (snapshot) {
                    console.log('2222');
                    favouritesSupplires = snapshot.val();
                    for (key in favouritesSupplires) {
                        if (favouritesSuppliresId.indexOf(favouritesSupplires[key].supplier_id) === -1) {
                            favouritesSuppliresId.push(favouritesSupplires[key].supplier_id);
                        }
                    }
                }, function (errorObject) {
                    console.log('aaaaa');
                    return res.serverError(errorObject.code);
                });
            var refSuppliers = db.ref("suppliers").orderByChild("area_id").equalTo(req.body.tankArea);
            refSuppliers.once("value", function (snapshot) {
                console.log('333');
                if(snapshot.numChildren()> 0){
                    console.log('444');
                    var suppliers = snapshot.val();
                    for (key in suppliers) {
                        if (suppliers[key].is_deleted == false && suppliers[key].tank_size != undefined && ((tankCapacity[0] == true && tankCapacity[1] == true && tankCapacity[2] == true && tankCapacity[3] == true) || ((tankCapacity[0] == true && suppliers[key].tank_size.indexOf('1') > 0) || (tankCapacity[1] == true && suppliers[key].tank_size.indexOf('2') > 0) || (tankCapacity[2] == true && suppliers[key].tank_size.indexOf('3') > 0) || (tankCapacity[3] == true && suppliers[key].tank_size.indexOf('4') > 0)))) {
                            var supplierList = {};
                            supplierList = suppliers[key];
                            supplierList["supplier_id"] = key;
                            if (favouritesSuppliresId.indexOf(key) >= 0) {
                                supplierList["is_fav"] = 1;
                            } else {
                                supplierList["is_fav"] = 0;
                            }
                            jsonData.push(supplierList);
                        }
                    }
                }else{
                    console.log('55555');
                    var refSuppliers = db.ref("suppliers").orderByChild("city_id").equalTo(req.body.tankCity);
                    refSuppliers.once("value", function (snapshot) {
                        var suppliers = snapshot.val();
                        //console.log(suppliers);
                        for (key in suppliers) {
                            if (suppliers[key].is_deleted == false && suppliers[key].tank_size != undefined && ((tankCapacity[0] == true && tankCapacity[1] == true && tankCapacity[2] == true && tankCapacity[3] == true) || ((tankCapacity[0] == true && suppliers[key].tank_size.indexOf('1') > 0) || (tankCapacity[1] == true && suppliers[key].tank_size.indexOf('2') > 0) || (tankCapacity[2] == true && suppliers[key].tank_size.indexOf('3') > 0) || (tankCapacity[3] == true && suppliers[key].tank_size.indexOf('4') > 0)))) {
                                var supplierList = {};
                                supplierList = suppliers[key];
                                supplierList["supplier_id"] = key;
                                if (favouritesSuppliresId.indexOf(key) >= 0) {
                                    supplierList["is_fav"] = 1;
                                } else {
                                    supplierList["is_fav"] = 0;
                                }
                                jsonData.push(supplierList);
                            }
                        }
                    }, function (errorObject) {
                        return res.serverError(errorObject.code);
                    });
                }
                console.log('6666');
                array.push(jsonData);
                array[0].sort(function (x, y) {
                    return y.is_fav - x.is_fav;
                });
                console.log(array[0]);
                return res.json(array[0]);
                console.log('7777777');
            }, function (errorObject) {
                return res.serverError(errorObject.code);
            });
        } else {
            res.status(422);
            res.send(sails.config.flash.paramter_missing);
        }
    },
};
