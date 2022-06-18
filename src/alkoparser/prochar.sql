DROP TEMPORARY TABLE IF EXISTS tmp;
                CREATE TEMPORARY TABLE tmp (
                    product_id INT(11),
                    characterization_id INT(11));
                insert into tmp (product_id, characterization_id)
                values (4263,85),(4263,216),(4263,265),(4263,339),(4263,340);
                INSERT INTO product_characterization (product_id, characterization_id)
                SELECT * FROM tmp WHERE NOT EXISTS (SELECT 1 FROM product_characterization AS MT WHERE MT.characterization_id = tmp.characterization_id AND MT.product_id = tmp.product_id);
                DROP TEMPORARY TABLE tmp;
                SELECT * FROM product_characterizationroduct_characterizationcterizationterizationcterizationonrizationon