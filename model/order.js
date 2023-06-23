import { Schema, model, models } from "mongoose"

const OrderSchema = new Schema({
  products : Object,
  paid : {type: Number,defaultValue: 0}
},{timesStamp: true})

const Order = models?.Order || model('Order',OrderSchema)
export default Order;