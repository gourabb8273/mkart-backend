import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  name: String,
  price: Number,
  quantity: Number,
  image: String,
  subtotal: Number,
});

const shippingAddressSchema = new mongoose.Schema({
  line1: String,
  line2: String,
  city: String,
  state: String,
  zip: String,
  country: String,
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    products: [productSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMode: {
      type: String,
      enum: ['Card', 'Cash on Delivery', 'UPI'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['placed', 'shipped', 'delivered', 'cancelled'],
      default: 'placed',
    },
    shippingAddress: shippingAddressSchema,
    deliveryDate: Date,
    isDelivered: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
