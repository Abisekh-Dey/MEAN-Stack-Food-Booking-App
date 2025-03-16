const Cart = require('../models/cart_model');
const MenuItem = require('../models/menuitem_model');

exports.addToCart = async (req, res) => {
  const { userId, menuItemId, quantity } = req.body;

  try {
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) return res.status(404).json({ message: "Menu item not found" });

    let cartItem = await Cart.findOne({ user: userId, menuItem: menuItemId });
    if (cartItem) return res.status(400).json({ message: "Item already available" });

    const cart = new Cart({
      user: userId,
      menuItem: menuItemId,
      quantity: quantity,
      totalPrice: menuItem.price
    });

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.find({ user: req.params.userId })
    .populate({
      path: 'menuItem', // First, populate menuItem
      populate: { path: 'restaurant_id' } // Then, populate restaurant_id inside menuItem
    });
    if (!cart) return res.status(404).json({ message: 'Cart is empty' });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports.getQuantity = async (req, res) => {
//   const { userId, menuItemId } = req.params;
//   try {
//     let cartItem = await Cart.findOne({ user: userId, menuItem: menuItemId });
//     if (!cartItem) return res.status(404).json({ message: "Item not found in cart" });
//     res.status(200).json({ quantity: cartItem.quantity });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

exports.updateCartItem = async (req, res) => {
  const { userId, menuItemId, quantity } = req.body;

  try {
    const cartItem = await Cart.findOne({ user: userId, menuItem: menuItemId });
    if (!cartItem) return res.status(404).json({ message: 'Item not found in cart' });

    if (quantity === 0) {
      await Cart.findByIdAndDelete(cartItem._id);
      return res.status(200).json({ message: 'Item removed from cart' });
    }

    cartItem.quantity = quantity;
    cartItem.totalPrice = cartItem.quantity * cartItem.menuItem.price;
    await cartItem.save();

    res.status(200).json(cartItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({ user: req.params.userId });
    res.status(200).json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.increaseQuantity = async (req, res) => {
  const { userId, menuItemId } = req.body;

  try {
    const cartItem = await Cart.findOne({ user: userId, menuItem: menuItemId }).populate('menuItem');
    if (!cartItem) return res.status(404).json({ message: 'Item not found in cart' });

    cartItem.quantity += 1;
    cartItem.totalPrice = cartItem.quantity * cartItem.menuItem.price;
    await cartItem.save();

    res.status(200).json(cartItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports.decreaseQuantity = async (req, res) => {
//   const { userId, menuItemId } = req.body;

//   try {
//     const cartItem = await Cart.findOne({ user: userId, menuItem: menuItemId }).populate('menuItem');
//     if (!cartItem) return res.status(404).json({ message: 'Item not found in cart' });

//     if (cartItem.quantity > 1) {
//       cartItem.quantity -= 1;
//       cartItem.totalPrice = cartItem.quantity * cartItem.menuItem.price;
//     } else {
//       try{
//         await Cart.findByIdAndDelete(cartItem._id);
//         res.status(200).json({ message: 'Item removed from cart' });
//       } catch (error) {
//         res.status(500).json({ message: "Internal server error", error: error.message });
//       }
//     }

//     await cartItem.save();
//     res.status(200).json(cartItem);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


exports.decreaseQuantity = async (req, res) => {
  const { userId, menuItemId } = req.body;

  try {
    const cartItem = await Cart.findOne({ user: userId, menuItem: menuItemId }).populate('menuItem');
    if (!cartItem) return res.status(404).json({ message: 'Item not found in cart' });

    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      cartItem.totalPrice = cartItem.quantity * cartItem.menuItem.price;
      await cartItem.save();
      return res.status(200).json(cartItem); 
    } 

    try {
      await Cart.findByIdAndDelete(cartItem._id);
      return res.status(200).json({ message: 'Item removed from cart' }); 
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


exports.deleteCartById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCartItem = await Cart.findByIdAndDelete(id);

    if (!deletedCartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({ message: "Cart item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
