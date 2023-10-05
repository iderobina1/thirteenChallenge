const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    const dbProductData = await Product.findAll({
      include: [
        { model: Category, attributes: ['id', 'category_name'] },
        { model: Tag, attributes: ['id', 'tag_name'] },
      ],
    });
    res.json(dbProductData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    const dbProductData = await Product.findOne({
      where: { id: req.params.id },
      include: [
        { model: Category, attributes: ['id', 'category_name'] },
        { model: Tag, attributes: ['id', 'tag_name'] },
      ],
    });

    if (!dbProductData) {
      res.status(404).json({ message: 'Product not found with this id' });
      return;
    }

    res.json(dbProductData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// create new product
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

// update product
router.put('/:id', async (req, res) => {
  try {
    // Find the product by ID
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      res.status(404).json({ message: 'Product not found with this ID' });
      return;
    }

    // Update product data
    await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    // Update associated product tags if necessary

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTags = req.body.tagIds.map((tag_id) => ({
        product_id: req.params.id,
        tag_id,
      }));

      // Remove existing product tags and create new ones
      await ProductTag.destroy({ where: { product_id: req.params.id } });
      await ProductTag.bulkCreate(productTags);
    }

    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

// delete product
router.delete('/:id', async (req, res) => {
  try {
    // Find the product by ID
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      res.status(404).json({ message: 'Product not found with this ID' });
      return;
    }

    // Delete associated product tags first
    await ProductTag.destroy({ where: { product_id: req.params.id } });

    // Then, delete the product itself
    await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
