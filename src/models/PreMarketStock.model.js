const mongoose = require('mongoose');

const preMarketStockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: [true, 'Symbol is required'],
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  change: {
    type: Number,
    default: 0
  },
  changePercent: {
    type: Number,
    default: 0
  },
  volume: {
    type: mongoose.Schema.Types.Mixed,
    default: 0
  },
  source: {
    type: String,
    enum: ['benzinga', 'investing'],
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

preMarketStockSchema.index({ symbol: 1, source: 1 }, { unique: true });
preMarketStockSchema.index({ lastUpdated: -1 });
preMarketStockSchema.index({ changePercent: -1 });

module.exports = mongoose.model('PreMarketStock', preMarketStockSchema);

