DROP TEMPORARY TABLE IF EXISTS tmp;
                CREATE TEMPORARY TABLE tmp (
                    product_id INT(11),
                    grape_id INT(11));
                insert into tmp (product_id, grape_id)
                values (4262,246);
                INSERT INTO product_grapes (product_id, grape_id)
                SELECT * FROM tmp WHERE NOT EXISTS (SELECT 1 FROM product_grapes AS MT WHERE MT.grape_id = tmp.grape_id AND MT.product_id = tmp.product_id);
                DROP TEMPORARY TABLE tmp;
                SELECT * FROM product_grapes * FROM product_grapes * FROM product_grapesduct_grapesuct_grapesrapes product_grapesDROP TEMPORARY TABLE tmp;
                SELECT * FROM product_grapes