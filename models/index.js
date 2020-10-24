// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: 'category_id'
})
// Categories have many Products
Category.hasMany(Product, {
  foreignKey: 'category_id'
})
// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag, {
  through: ProductTag,
  //as: '', if there's a new name for attribute
  foreignKey: 'product_id'
})
// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product, {
  through: ProductTag,
  //as:'',
  foreignKey: 'tag_id'
})

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};


// User.belongsToMany(Post, {
//   through: Vote,
//   as: 'voted_posts',
//   foreignKey: 'user_id'
// });

// Post.belongsToMany(User, {
//   through: Vote,
//   as: 'voted_posts',
//   foreignKey: 'post_id'
// });