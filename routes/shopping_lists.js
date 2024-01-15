const express = require("express");
const connection = require("../connection");
const router = express.Router();

// Vraća sve šoping liste

router.get("/getAllShoppingLists", (req, res) => {
  const getAllShoppingListsQuery = `
      SELECT sl.id AS listId, sl.list_name, s.shopper_name, si.id AS itemId, si.name AS itemName
      FROM shopping_lists sl
      JOIN shoppers s ON sl.shopper_id = s.id
      LEFT JOIN shopping_list_items sli ON sl.id = sli.shopping_list_id
      LEFT JOIN shopping_items si ON sli.item_id = si.id
    `;

  connection.query(getAllShoppingListsQuery, (err, results) => {
    if (err) {
      console.error("Error retrieving shopping lists details:", err);
      return res
        .status(500)
        .json({ error: "Error retrieving shopping lists details" });
    }

    const shoppingLists = [];

    // Organizuje
    results.forEach((result) => {
      const existingList = shoppingLists.find(
        (list) => list.listId === result.listId
      );

      if (existingList) {
        // Dodaje detalje postojećoj listi
        if (result.itemId !== null) {
          existingList.items.push({
            itemId: result.itemId,
            itemName: result.itemName,
          });
        }
      } else {
        // Kreira novu listu sa detaljima
        const newList = {
          listId: result.listId,
          listName: result.list_name,
          shopperName: result.shopper_name,
          items:
            result.itemId !== null
              ? [{ itemId: result.itemId, itemName: result.itemName }]
              : [],
        };

        shoppingLists.push(newList);
      }
    });

    res.status(200).json(shoppingLists);
  });
});

// Vrati jednu listu (isto kao operacija iznad samo što vrati jednu)

router.get("/getShoppingList/:listId", (req, res) => {
  const { listId } = req.params;

  const getShoppingListDetailsQuery = `
      SELECT sl.id AS listId, sl.list_name, s.shopper_name, si.id AS itemId, si.name AS itemName
      FROM shopping_lists sl
      JOIN shoppers s ON sl.shopper_id = s.id
      LEFT JOIN shopping_list_items sli ON sl.id = sli.shopping_list_id
      LEFT JOIN shopping_items si ON sli.item_id = si.id
      WHERE sl.id = ?
    `;

  connection.query(getShoppingListDetailsQuery, [listId], (err, results) => {
    if (err) {
      console.error("Error retrieving shopping list details:", err);
      return res
        .status(500)
        .json({ error: "Error retrieving shopping list details" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Shopping list not found" });
    }

    const shoppingListDetails = {
      listId: results[0].listId,
      listName: results[0].list_name,
      shopperName: results[0].shopper_name,
      items: results
        .filter((result) => result.itemId !== null)
        .map((result) => ({
          itemId: result.itemId,
          itemName: result.itemName,
        })),
    };

    res.status(200).json(shoppingListDetails);
  });
});

// Kreiranje liste sa provjerom (da se proizvod ne smije pojaviti u više od 3 lista)

router.post("/createShoppingList", (req, res) => {
  const { shopperId, listName, itemIds } = req.body;

  // Provjerava jel id proslijeđen
  if (!shopperId) {
    return res
      .status(400)
      .json({ error: "Shopper ID is required in the request body" });
  }

  // Provjerava postojanje kupca s danim ID-om
  const checkShopperQuery = "SELECT * FROM shoppers WHERE id = ?";
  connection.query(checkShopperQuery, [shopperId], (err, shopperResult) => {
    if (err) {
      console.error("Error checking shopper existence:", err);
      return res
        .status(500)
        .json({ error: "Error checking shopper existence" });
    }

    if (shopperResult.length === 0) {
      return res.status(400).json({ error: "Id kupca ne postoji." });
    }

    // Provjerava postojanje proizvoda s danim ID-om
    const checkItemQuery = "SELECT * FROM shopping_items WHERE id IN (?)";
    connection.query(checkItemQuery, [itemIds], (err, itemResult) => {
      if (err) {
        console.error("Error checking item existence:", err);
        return res.status(500).json({ error: "Error checking item existence" });
      }

      if (itemResult.length !== itemIds.length) {
        return res.status(400).json({ error: "Id proizvoda ne postoji." });
      }

      // Provjerava broj proizvoda
      const checkItemOccurrencesQuery = `
                SELECT item_id, COUNT(*) AS occurrences
                FROM shopping_list_items
                WHERE item_id IN (?)
                GROUP BY item_id
            `;

      connection.query(
        checkItemOccurrencesQuery,
        [itemIds],
        (err, itemOccurrences) => {
          if (err) {
            console.error("Error checking item occurrences:", err);
            return res
              .status(500)
              .json({ error: "Error checking item occurrences" });
          }

          const exceedsLimit = itemOccurrences.some(
            (occurrence) => occurrence.occurrences >= 3
          );
          if (exceedsLimit) {
            return res
              .status(400)
              .json({
                error:
                  "Proizvod se ne može dodati jer se već nalazi u 3 liste.",
              });
          }

          // Provjerava postojanje šoping liste s Shopper ID-om
          const checkShoppingListQuery =
            "SELECT * FROM shopping_lists WHERE shopper_id = ?";
          connection.query(
            checkShoppingListQuery,
            [shopperId],
            (err, shoppingListResult) => {
              if (err) {
                console.error("Error checking shopping list existence:", err);
                return res
                  .status(500)
                  .json({ error: "Error checking shopping list existence" });
              }

              if (shoppingListResult.length > 0) {
                return res
                  .status(400)
                  .json({ error: "Lista za ovog korisnika već postoji." });
              }

              // Provjerava koliko slova
              if (listName.length < 3 || listName.length > 20) {
                return res
                  .status(400)
                  .json({
                    error: "Naziv liste mora biti između 3 i 20 znakova.",
                  });
              }

              // Ovdje e vrši kreiranje šoping liste
              const createShoppingListQuery =
                "INSERT INTO shopping_lists (shopper_id, list_name) VALUES (?, ?)";
              connection.query(
                createShoppingListQuery,
                [shopperId, listName],
                (err, results) => {
                  if (err) {
                    console.error("Error creating shopping list:", err);
                    return res
                      .status(500)
                      .json({ error: "Error creating shopping list" });
                  }

                  const shoppingListId = results.insertId;

                  // Ovdje se dodaju proizvodi u šoping u listu
                  const addItemsToShoppingListQuery =
                    "INSERT INTO shopping_list_items (shopping_list_id, item_id) VALUES ?";
                  const values = itemIds.map((itemId) => [
                    shoppingListId,
                    itemId,
                  ]);

                  connection.query(
                    addItemsToShoppingListQuery,
                    [values],
                    (err) => {
                      if (err) {
                        console.error(
                          "Error adding items to shopping list:",
                          err
                        );
                        return res
                          .status(500)
                          .json({
                            error: "Error adding items to shopping list",
                          });
                      }

                      res
                        .status(201)
                        .json({ message: "Lista uspješno kreirana." });
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  });
});

// Ovo je updajtovanje cijele liste (NISAM KORISTIO U FRONTENDU!)

router.patch("/updateShoppingListItems", (req, res) => {
  const shoppingListId = req.body.shoppingListId;
  const { itemIds } = req.body;

  // Provjerava jel id liste poslan
  if (!shoppingListId) {
    return res
      .status(400)
      .json({ error: "Shopping list ID is required in the request body" });
  }

  // Provjeri koliko se puta pojave u listi
  const checkItemOccurrencesQuery = `
        SELECT item_id, COUNT(*) AS occurrences
        FROM shopping_list_items
        WHERE item_id IN (?)
        GROUP BY item_id
    `;

  connection.query(
    checkItemOccurrencesQuery,
    [itemIds],
    (err, itemOccurrences) => {
      if (err) {
        console.error("Error checking item occurrences:", err);
        return res
          .status(500)
          .json({ error: "Error checking item occurrences" });
      }

      const exceedsLimit = itemOccurrences.some(
        (occurrence) => occurrence.occurrences >= 3
      );
      if (exceedsLimit) {
        return res
          .status(400)
          .json({
            error:
              "One or more items exceed the limit of 3 occurrences in shopping lists",
          });
      }

      // Brišu se svi elementi liste
      const deleteExistingItemsQuery =
        "DELETE FROM shopping_list_items WHERE shopping_list_id = ?";

      connection.query(deleteExistingItemsQuery, [shoppingListId], (err) => {
        if (err) {
          console.error(
            "Error deleting existing items from shopping list:",
            err
          );
          return res
            .status(500)
            .json({
              error: "Error deleting existing items from shopping list",
            });
        }

        // Dodaju se novi elementi
        const addUpdatedItemsQuery =
          "INSERT INTO shopping_list_items (shopping_list_id, item_id) VALUES ?";
        const values = itemIds.map((itemId) => [shoppingListId, itemId]);

        connection.query(addUpdatedItemsQuery, [values], (err) => {
          if (err) {
            console.error("Error adding updated items to shopping list:", err);
            return res
              .status(500)
              .json({ error: "Error adding updated items to shopping list" });
          }

          res
            .status(200)
            .json({ message: "Shopping list items updated successfully" });
        });
      });
    }
  );
});

// Dodavanje jednog proizvoda u listu

router.patch("/addProductToList", (req, res) => {
  const { shoppingListId, itemId } = req.body;

  const checkItemExistenceQuery = `
        SELECT COUNT(*) AS itemExists
        FROM shopping_items
        WHERE id = ?
    `;

  connection.query(
    checkItemExistenceQuery,
    [itemId],
    (err, itemExistenceResults) => {
      if (err) {
        console.error("Error checking item existence:", err);
        return res.status(500).json({ error: "Error checking item existence" });
      }

      const itemExists = itemExistenceResults[0].itemExists;
      if (itemExists === 0) {
        return res.status(400).json({ error: "Birani id ne postoji." });
      }

      const checkItemOccurrencesQuery = `
            SELECT COUNT(*) AS occurrences
            FROM shopping_list_items
            WHERE item_id = ?
        `;

      connection.query(
        checkItemOccurrencesQuery,
        [itemId],
        (err, occurrencesResults) => {
          if (err) {
            console.error("Error checking item occurrences:", err);
            return res
              .status(500)
              .json({ error: "Error checking item occurrences" });
          }

          const occurrences = occurrencesResults[0].occurrences;
          if (occurrences >= 3) {
            return res
              .status(400)
              .json({
                error: "Proizvod se ne može dodati jer se nalazi u 3 liste.",
              });
          }

          // Gleda da li postoji već ovaj proizvod u listi
          const checkItemInListQuery = `
                SELECT COUNT(*) AS itemInList
                FROM shopping_list_items
                WHERE shopping_list_id = ? AND item_id = ?
            `;

          connection.query(
            checkItemInListQuery,
            [shoppingListId, itemId],
            (err, itemInListResults) => {
              if (err) {
                console.error("Error checking if item already in list:", err);
                return res
                  .status(500)
                  .json({ error: "Error checking if item already in list" });
              }

              const itemInList = itemInListResults[0].itemInList;
              if (itemInList > 0) {
                return res
                  .status(400)
                  .json({ error: "Proizvod je već u listi." });
              }

              // Ubacuje proizvod u listu
              const addProductQuery =
                "INSERT INTO shopping_list_items (shopping_list_id, item_id) VALUES (?, ?)";

              connection.query(
                addProductQuery,
                [shoppingListId, itemId],
                (err) => {
                  if (err) {
                    console.error(
                      "Error adding product to shopping list:",
                      err
                    );
                    return res
                      .status(500)
                      .json({ error: "Error adding product to shopping list" });
                  }

                  res
                    .status(200)
                    .json({
                      message:
                        "Product added to the shopping list successfully",
                    });
                }
              );
            }
          );
        }
      );
    }
  );
});

//------------------------------------------------------------------------------------------------------

// Brisanje jedne liste

router.delete("/deleteShoppingList/:shoppingListId", (req, res) => {
  const shoppingListId = req.params.shoppingListId;

  // Prvo mora obrisat proizvode jer je niz
  const deleteItemsQuery =
    "DELETE FROM shopping_list_items WHERE shopping_list_id = ?";

  connection.query(deleteItemsQuery, [shoppingListId], (err) => {
    if (err) {
      console.error("Error deleting items from shopping list:", err);
      return res
        .status(500)
        .json({ error: "Error deleting items from shopping list" });
    }

    // Onda tek može izbrisati listu
    const deleteShoppingListQuery = "DELETE FROM shopping_lists WHERE id = ?";

    connection.query(deleteShoppingListQuery, [shoppingListId], (err) => {
      if (err) {
        console.error("Error deleting shopping list:", err);
        return res.status(500).json({ error: "Error deleting shopping list" });
      }

      res.status(200).json({ message: "Shopping list deleted successfully" });
    });
  });
});

// Brisanje svake šoping liste

router.delete("/deleteAllShoppingLists", (req, res) => {
  // Prvo briše proizvode

  const deleteAllItemsQuery = "DELETE FROM shopping_list_items";

  connection.query(deleteAllItemsQuery, (err) => {
    if (err) {
      console.error("Error deleting all items from shopping lists:", err);
      return res
        .status(500)
        .json({ error: "Error deleting all items from shopping lists" });
    }

    // Onda briše listu
    const deleteAllShoppingListsQuery = "DELETE FROM shopping_lists";

    connection.query(deleteAllShoppingListsQuery, (err) => {
      if (err) {
        console.error("Error deleting all shopping lists:", err);
        return res
          .status(500)
          .json({ error: "Error deleting all shopping lists" });
      }

      res
        .status(200)
        .json({ message: "All shopping lists deleted successfully" });
    });
  });
});

// Ovdje briše samo jedan proizvod po id-u

router.patch("/deleteProductFromList", (req, res) => {
  const { shoppingListId, itemId } = req.query;

  // Konvertuje parametre ako ima potrebe
  const shoppingListIdNumber = parseInt(shoppingListId, 10);
  const itemIdNumber = parseInt(itemId, 10);

  // Briše proizvod iz liste
  const deleteProductQuery =
    "DELETE FROM shopping_list_items WHERE shopping_list_id = ? AND item_id = ?";

  connection.query(
    deleteProductQuery,
    [shoppingListIdNumber, itemIdNumber],
    (err, results) => {
      if (err) {
        console.error("Error deleting product from shopping list:", err);
        return res
          .status(500)
          .json({ error: "Error deleting product from shopping list" });
      }

      if (results.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "Product not found in the shopping list" });
      }

      res
        .status(200)
        .json({
          message: "Product deleted from the shopping list successfully",
        });
    }
  );
});

module.exports = router;
