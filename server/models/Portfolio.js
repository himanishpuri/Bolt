const mongoose = require('mongoose');

const portfolioItemSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  purchasePrice: {
    type: Number,
    required: true,
    min: 0
  },
  purchaseDate: {
    type: Date,
    required: true
  },
  currentPrice: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const portfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  items: [portfolioItemSchema],
  totalValue: {
    type: Number,
    default: 0
  },
  totalInvestment: {
    type: Number,
    default: 0
  },
  totalGainLoss: {
    type: Number,
    default: 0
  },
  totalGainLossPercentage: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
portfolioSchema.index({ user: 1 });
portfolioSchema.index({ user: 1, name: 1 });

// Calculate portfolio totals
portfolioSchema.methods.calculateTotals = function() {
  let totalInvestment = 0;
  let totalValue = 0;

  this.items.forEach(item => {
    const investment = item.quantity * item.purchasePrice;
    const currentValue = item.quantity * item.currentPrice;
    
    totalInvestment += investment;
    totalValue += currentValue;
  });

  this.totalInvestment = totalInvestment;
  this.totalValue = totalValue;
  this.totalGainLoss = totalValue - totalInvestment;
  this.totalGainLossPercentage = totalInvestment > 0 
    ? ((totalValue - totalInvestment) / totalInvestment) * 100 
    : 0;
};

// Update current prices for all items
portfolioSchema.methods.updateCurrentPrices = async function(priceData) {
  this.items.forEach(item => {
    if (priceData[item.symbol]) {
      item.currentPrice = priceData[item.symbol];
      item.lastUpdated = new Date();
    }
  });
  
  this.calculateTotals();
  await this.save();
};

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio; 