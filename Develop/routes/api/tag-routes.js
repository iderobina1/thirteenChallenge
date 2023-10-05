const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint
 // find all tags
  // be sure to include its associated Product data
router.get('/', async (req, res) => {
 try {
  const dbTagData = await Tag.findAll({
    include: [Product],
  });
res.json(dbTagData);
 } catch (err) {
console.log(err);
res.json(500).json(err);
 }

});

  // find a single tag by its `id`
  // be sure to include its associated Product data
router.get('/:id', async (req, res) => {
try {
  const dbTagData = await Tag.findOne({
  where: {id: req.params.id },
  include: [Product],
  });
  if (!dbTagData) {
    res.status(404).json ({ message: "No tag found with this id"});
    return;
  }
  res.json(dbTagData);
} catch (err) {
  console.log(err);
  res.json(500).json(err);
}
});

  // create a new tag
router.post('/', async (req, res) => {
  try {
    const dbTagData = await Tag.create(req.body);
    res.json(dbTagData);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

  // update a tag's name by its `id` value
router.put('/:id', async (req, res) => {
try {
  const affectedRows = await Tag.update(req.body, {
    where: {id: req.params.id },
  });

  if(affectedRows === 0) {
    res.status(404).json ({ message:"No tag found with this ID"});
    return;
  }
  res.json({Message: 'tag updated succesfully'});
} catch (err) {
  console.log(err);
  res.status(500).json(err);
}
});

  // delete on tag by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const affectedRows = await Tag.delete ({
      where: {id:req.params.id},
    });
    if (affectedRows === 0) {
      res.status(404).json({ message: "No tags found with this id"});
      return;
    }
    res.json({ message: 'Tag deleted succesfully'});
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
