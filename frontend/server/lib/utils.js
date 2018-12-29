
module.exports = {
    rmEmptyProp(obj) {
        let newObj = {}
        for (let key in obj) {
            if (obj[key]) {
                newObj[key] = obj[key]
            }
        }

        return newObj
    }
}