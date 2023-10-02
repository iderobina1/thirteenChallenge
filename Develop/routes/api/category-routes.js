const router = require('express').Router();
const { Category, Product } = require('../../models');


router.get('/', async (req, res) => {
try {
  const dbCategoryData = await Category.findAll({
    include: [Product]
  });
res.json(dbCategoryData);

} catch (err) {
  console.log(err);
  res.status(500).json(err);
}

});

router.get('/:id', async (req, res) => {
  try {
    const dbCategoryData = await Category.findOne({
      where: { id: req.params.id },
      include: [Product],
    });

   
    if (!dbCategoryData) {
      res.status(404).json({ message: "No category found with this id." });
      return; 
    }

    res.json(dbCategoryData);

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});


router.post('/', async (req, res) => {
try {
  // create a new category
  const dbCategoryData = await Category.create(req.body);
  res.json(dbCategoryData);
}

catch (err) {
  console.log(err);
  res.status(500).json(err)
}
});

  // update a category by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const [updateRows] = await Category.update(req.body, {
      where: {id: req.params.id}}
      );
  if (updateRows === 0) {
    res.json({message: 'No Category found with this ID'});
    return;
  
  } 
  res.json({message: "Category updated succesfully"});
  }

  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
try {
const [deleteRows] = await Category.delete(req.body, {
  where: {id: req.params.id}}
  );

if (deleteRows === 0) {
  res.json({message: "No categories found with this Id"});
  return;
}
res.json({message: "Row deleted succesfully"});
}

catch (err) {
console.log(err);
res.status(500).json(err);
}
});

module.exports = router;
