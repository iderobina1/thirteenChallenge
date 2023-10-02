const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
try {
  const dbProductData = await Product.findAll ({
    inlude: [
    {model: Category, attributes: ['id', 'category_name']},
    {model: Tag, attributes: ['id', 'tag_name']},
    ]
  });
  res.json(dbProductData);

} catch (err) {
  console.log(err);
  res.status(500).json(err);
}

});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data

try {
  const dbProductData = await Product.findOne ({
    where: {id: req.params.id},
    include: [
      {model: Category, attributes: ['id', 'category_name']},
      {model: Tag, attributes: ['id', 'tag_name']},
    ],
  });

  if (!dbProductData) {
    res.status(404).json({message: 'Product not found with this id'});
    return;
  }

  res.json(dbProductData);
} catch (err) {
  console.error(err);
  res.status(500).json(err);
}

});

// create new product
// The `/api/products` endpoint

router.post('/', async (req, res) => {
  try {
    // Create the product
    const createdProduct = await Product.create(req.body);

    // If there are product tags, create pairings in the ProductTag model
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => ({
        product_id: createdProduct.id,
        tag_id,
      }));
      await ProductTag.bulkCreate(productTagIdArr);

      // Respond with the created product and productTagIds
      const productTagIds = productTagIdArr.map((pairing) => pairing.tag_id);
      res.status(201).json({ product: createdProduct, productTagIds });
    } else {
      // If no product tags, just respond with the created product
      res.status(201).json(createdProduct);
    }
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

module.exports = router;


// // update product
// router.put('/:id', (req, res) => {
//   // update product data
//   Product.update(req.body, {
//     where: {
//       id: req.params.id,
//     },
//   })
//     .then((product) => {
//       if (req.body.tagIds && req.body.tagIds.length) {
        
//         ProductTag.findAll({
//           where: { product_id: req.params.id }
//         }).then((productTags) => {
//           // create filtered list of new tag_ids
//           const productTagIds = productTags.map(({ tag_id }) => tag_id);
//           const newProductTags = req.body.tagIds
//           .filter((tag_id) => !productTagIds.includes(tag_id))
//           .map((tag_id) => {
//             return {
//               product_id: req.params.id,
//               tag_id,
//             };
//           });

//             // figure out which ones to remove
//           const productTagsToRemove = productTags
//           .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
//           .map(({ id }) => id);
//                   // run both actions
//           return Promise.all([
//             ProductTag.destroy({ where: { id: productTagsToRemove } }),
//             ProductTag.bulkCreate(newProductTags),
//           ]);
//         });
//       }

//       return res.json(product);
//     })
//     .catch((err) => {
//       // console.log(err);
//       res.status(400).json(err);
//     });
// });

// router.delete('/:id', (req, res) => {
//   // delete one product by its `id` value
// });

// module.exports = router;
