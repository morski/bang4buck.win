var mysql = require('mysql');
var fs = require("fs");

const pool = mysql.createPool({
    connectionLimit : 100,
    host: "morski.fi",
    user: "root",
    password: "4H6?c=gaNUj6e!Sj",
    database: "alko",
    port: 3307,
    multipleStatements: true
});

const closePool = () => {
    pool.end(function (err) {
        // all connections in the pool have ended
    });
}

const addOrUpdateCharacterizationsOrGrapes = (list, tableName, columnName) => {
    return new Promise(resolve => {
        const sql = `DROP TEMPORARY TABLE IF EXISTS tmp;
                    CREATE TEMPORARY TABLE tmp (name TEXT);
                    insert into tmp (name) values ("${list.join('"),("')}");
                    INSERT INTO ${tableName} (${columnName}) select * from tmp WHERE NOT EXISTS ( SELECT 1 FROM  ${tableName} AS MT WHERE  MT.${columnName} = tmp.name);
                    DROP TEMPORARY TABLE tmp;
                    SELECT * FROM ${tableName};`
        pool.query(sql, (error, results, fields) => {
            if (error) throw error;
            resolve(results[results.length - 1])
        });
    });
}

const fT = (t) => {
    if (t) return '"'+t.replace(/"/g,"'").replace('˚',"").replace('č','').replace('ł','').replace('М','')+'"';
    return 'null';
}

const fN = (n) => {
    return n || 'null';
}

const updateOrAddProducts = (products) => {
    return new Promise(resolve => {
        const sqlFormatedProducts = products.map(p => `${fN(p.Numero)},${fT(p.Nimi)},${fT(p.Valmistaja)},${fN(p.Pullokoko)},${fN(p.Hinta)},${fN(p.Litrahinta)},${fT(p.Uutuus)},${fT(p["Hinnastojärjestyskoodi"])},${fT(p.Tyyppi)},${fT(p["Erityisryhmä"])},${fT(p.Oluttyyppi)},${fT(p.Valmistusmaa)},${fT(p.Alue)},${fN(p.Vuosikerta)},${fT(p["Etikettimerkintöjä"])},${fT(p.Huomautus)},${fT(p.Pakkaustyyppi)},${fT(p.Suljentatyppi)},${fN(p["Alkoholi-%"])},${fN(p["Hapot g/l"])},${fN(p["Sokeri g/l"])},${fN(p["Kantavierrep-%"])},${fN(p["Väri EBC"])},${fN(p["Katkerot EBU"])},${fN(p["Energia kcal/100 ml"])},${fT(p.Valikoima)}`)
        
        console.log(sqlFormatedProducts[0]);
        const sql = `DROP TEMPORARY TABLE IF EXISTS tmp;
        CREATE TEMPORARY TABLE tmp (
            number INT(22) NOT NULL,
            name TEXT NOT NULL,
            producer TEXT NULL,
            size DOUBLE NULL DEFAULT NULL,
            price DOUBLE NULL DEFAULT NULL,
            liter_price DOUBLE NULL DEFAULT NULL,
            new TEXT NULL,
            price_type TEXT NULL,
            type TEXT NULL,
            special_group TEXT NULL,
            beer_type TEXT NULL,
            country TEXT NULL,
            region TEXT NULL,
            year INT(11) NULL DEFAULT NULL,
            label_note TEXT NULL,
            note TEXT NULL,
            packaging_type TEXT NULL,
            cap_type TEXT NULL,
            alcohol DOUBLE NULL DEFAULT NULL,
            acids_gl DOUBLE NULL DEFAULT NULL,
            sugar_gl DOUBLE NULL DEFAULT NULL,
            gravity DOUBLE NULL DEFAULT NULL,
            ebc DOUBLE NULL DEFAULT NULL,
            ebu DOUBLE NULL DEFAULT NULL,
            energy DOUBLE NULL DEFAULT NULL,
            selection TEXT NULL);
        insert into tmp (number,name,producer,size,price,liter_price,new,price_type,type,special_group,beer_type,country,region,year,label_note,note,packaging_type,cap_type,alcohol,acids_gl,sugar_gl,gravity,ebc,ebu,energy,selection) 
        values (${sqlFormatedProducts.join('),(')});
        INSERT INTO products (number,name,producer,size,price,liter_price,new,price_type,type,special_group,beer_type,country,region,year,label_note,note,packaging_type,cap_type,alcohol,acids_gl,sugar_gl,gravity,ebc,ebu,energy,selection) 
        select * from tmp WHERE NOT EXISTS ( SELECT 1 FROM  products AS MT WHERE  MT.number = tmp.number);
        DROP TEMPORARY TABLE tmp;
        SELECT id, number FROM products`
        pool.query(sql, (error, results, fields) => {
            if (error) throw error;
            console.log(results[results.length - 1]);
            resolve(results[results.length - 1]);
        });
    });
}

const addOrUpdateCharacterizationsOrGrapesForProducts = (product, productIdsAndNumbers) => {
    return new Promise(resolve => {
        
        let done1 = true;
        let done2 = true;
        var prod = productIdsAndNumbers.find(x => x.number == product.Numero);
        console.log(prod.id);
        if (product.characterizationIds) {
            done1 = false;
            const sql = `DROP TEMPORARY TABLE IF EXISTS tmp;
            CREATE TEMPORARY TABLE tmp (
                product_id INT(11),
                characterization_id INT(11));
            insert into tmp (product_id, characterization_id)
            values (${prod.id},${product.characterizationIds.join(`),(${prod.id},`)});
            INSERT INTO product_characterization (product_id, characterization_id)
            SELECT * FROM tmp WHERE NOT EXISTS (SELECT 1 FROM product_characterization AS MT WHERE MT.characterization_id = tmp.characterization_id AND MT.product_id = tmp.product_id);
            DROP TEMPORARY TABLE tmp;
            SELECT * FROM product_characterization`;
            pool.query(sql, (error, results, fields) => {
                if (error) throw error;
                done1 = true;
                if (done1 && done2) resolve ("OK");
            });
        }

        if (product.grapeIds) {
            done2 = false;
            const sql2 = `DROP TEMPORARY TABLE IF EXISTS tmp;
            CREATE TEMPORARY TABLE tmp (
                product_id INT(11),
                grape_id INT(11));
            insert into tmp (product_id, grape_id)
            values (${prod.id},${product.grapeIds.join(`),(${prod.id},`)});
            INSERT INTO product_grapes (product_id, grape_id)
            SELECT * FROM tmp WHERE NOT EXISTS (SELECT 1 FROM product_grapes AS MT WHERE MT.grape_id = tmp.grape_id AND MT.product_id = tmp.product_id);
            DROP TEMPORARY TABLE tmp;
            SELECT * FROM product_grapes`;
            pool.query(sql2, (error, results, fields) => {
                if (error) throw error;
                done2 = true;
                if (done1 && done2) resolve ("OK");
            });
        }
    });
}

  exports.addOrUpdateCharacterizationsOrGrapes = addOrUpdateCharacterizationsOrGrapes;
  exports.closePool = closePool;
  exports.updateOrAddProducts = updateOrAddProducts;
  exports.addOrUpdateCharacterizationsOrGrapesForProducts = addOrUpdateCharacterizationsOrGrapesForProducts;