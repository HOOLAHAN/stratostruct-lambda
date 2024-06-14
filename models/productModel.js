const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productSchema = new Schema(
  {
    "component_type": {
      type: String,
      required: true
    },
    "component_name": {
      type: String,
      required: true
    }
  }, { timestamps: true}
)

module.exports = mongoose.model('Product', productSchema)
