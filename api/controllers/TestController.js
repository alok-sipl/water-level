/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    /*
     * Name: index
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: sjpw grid page
     * @param  req
     */
    index: function (req, res) {
        return res.view('demo');
    },
};


