const moment = require('moment');

module.exports = {
  formatDate: (date, format = 'YYYY-MM-DD HH:mm:ss') => {
    return moment(date).format(format);
  },

  maskString: (str, visibleChars = 4, maskChar = '*') => {
    if (!str) return '';
    if (str.length <= visibleChars * 2) return str;
    return str.substring(0, visibleChars) + 
           maskChar.repeat(str.length - visibleChars * 2) + 
           str.substring(str.length - visibleChars);
  },

  generateRandomString: (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  calculatePromotion: (product, quantity) => {
    if (!product.promotion) return { finalPrice: product.price * quantity, discount: 0 };
    
    switch (product.promotion.type) {
      case '3x1':
        if (quantity >= 3) {
          const discountedItems = Math.floor(quantity / 3);
          return {
            finalPrice: (quantity - discountedItems) * product.price,
            discount: discountedItems * product.price
          };
        }
        break;
        
      case '3x2':
        if (quantity >= 3) {
          const discountedItems = Math.floor(quantity / 3);
          return {
            finalPrice: (quantity - discountedItems) * product.price,
            discount: discountedItems * product.price
          };
        }
        break;
        
      case 'nxm':
        if (quantity >= product.promotion.n) {
          const discountedSets = Math.floor(quantity / product.promotion.n);
          return {
            finalPrice: discountedSets * product.promotion.m + (quantity % product.promotion.n) * product.price,
            discount: (quantity - (quantity % product.promotion.n)) * product.price - discountedSets * product.promotion.m
          };
        }
        break;
    }
    
    return { finalPrice: product.price * quantity, discount: 0 };
  }
};