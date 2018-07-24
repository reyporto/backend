const fs = require('fs');
const file = 'src/handler/data.json';
var data = null;

exports.read = (next) => {
    if (data === null) {
        fs.exists(file, (exists) => {
            if (exists) {
                fs.readFile(file, 'utf8', (err, fileData) => {
                    if (err) {
                        console.log('Error:', err);
                    } else {
                        data = JSON.parse(fileData);
                        console.log('Reading data.json file was successful');
                    }
            
                    next();
                });
            } else {
                console.log(file + ' no exists');
                next();
            }
        });
    } else {
        next();
    }
}

exports.getAllData = (res) => {
    if (data !== null) {
        res.send(resultData(data));
    } else {
        res.send(noResult());
    }
}

exports.filterData = (req, res) => {
    if (req.body) {
        if (data !== null) {
            var items = [];
            var city = req.body.city;
            var type = req.body.type;
            var prices = req.body.price.split(';');
            var price1 = parseInt(prices[0]);
            var price2 = parseInt(prices[1]);

            for (let item of data) {
                var price = item.Precio.replace('$', '').replace(',', '');
                price = parseInt(price);

                if (city !== '' && type !== '') {
                    if (item.Ciudad === city && item.Tipo === type && (price >= price1 && price <= price2)) {
                        items.push(item);
                        continue;
                    }
                } else if (city !== '' && type === '') {
                    if (item.Ciudad === city && (price >= price1 && price <= price2)) {
                        items.push(item);
                        continue;
                    }
                } else if (city === '' && type !== '') {
                    if (item.Tipo === type && (price >= price1 && price <= price2)) {
                        items.push(item);
                        continue;
                    }
                } else {
                    if (price >= price1 && price <= price2) {
                        items.push(item);
                        continue;
                    }
                }
            }

            if (items.length > 0) {
                res.send(resultData(items));
            } else {
                res.send(noResult());
            }
        } else {
            res.send(noResult());
        }
    } else {
        res.send(noResult());
    }
}

exports.getCitiesOrTypes = (res, get) => {
    if (data !== null) {
        var citiesOrTypes = [];
        var prop = get === 'cities' ? 'Ciudad' : 'Tipo';

        for (let item of data) {
            if (citiesOrTypes.indexOf(item[prop]) === -1) {
                citiesOrTypes.push(item[prop]);
            }
        }

        res.send(resultData(citiesOrTypes));
    } else {
        res.send(noResult());
    }
}

var resultData = (data) => {
    var response = new Object();
    response.code = '1';
    response.data = data;

    return {
        response: response
    };
}

var noResult = () => {
    var response = new Object();
    response.code = '0';
    response.data = 'No se encontraron resultados.';

    return {
        response: response
    };
}