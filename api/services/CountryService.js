module.exports = {
    sorting: function (object, index) {
        object.sort(function (a, b) {
            return b.index - a.index;
        })
    },
}
