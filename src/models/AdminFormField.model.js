const mongoose = require('mongoose');

/**
 * AdminFormField Model
 * Stores dynamic form field configuration
 */
const adminFormFieldSchema = new mongoose.Schema({
  fields: [{
    id: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['text', 'number', 'email', 'password', 'select', 'textarea'],
      required: true
    },
    required: {
      type: Boolean,
      default: false
    },
    placeholder: String,
    validation: {
      minLength: Number,
      maxLength: Number,
      min: Number,
      max: Number,
      step: Number
    },
    options: [{
      value: String,
      label: String
    }],
    value: mongoose.Schema.Types.Mixed,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

// Ensure only one document exists
adminFormFieldSchema.statics.getFormData = async function() {
  let formData = await this.findOne();
  
  if (!formData) {
    // Create default form data
    formData = await this.create({
      fields: [
        {
          id: 'symbol',
          label: 'Stock Symbol',
          type: 'text',
          required: true,
          placeholder: 'e.g., AAPL',
          validation: { minLength: 1, maxLength: 10 }
        },
        {
          id: 'name',
          label: 'Company Name',
          type: 'text',
          required: true,
          placeholder: 'e.g., Apple Inc.',
          validation: { minLength: 1, maxLength: 100 }
        },
        {
          id: 'price',
          label: 'Price',
          type: 'number',
          required: true,
          placeholder: '0.00',
          validation: { min: 0, step: 0.01 }
        },
        {
          id: 'change',
          label: 'Change',
          type: 'number',
          required: false,
          placeholder: '0.00',
          validation: { step: 0.01 }
        },
        {
          id: 'percentChange',
          label: 'Percent Change',
          type: 'number',
          required: false,
          placeholder: '0.00',
          validation: { min: -100, max: 100, step: 0.01 }
        },
        {
          id: 'volume',
          label: 'Volume',
          type: 'number',
          required: false,
          placeholder: '0',
          validation: { min: 0 }
        },
        {
          id: 'category',
          label: 'Category',
          type: 'select',
          required: true,
          options: [
            { value: 'gainer', label: 'Gainer' },
            { value: 'loser', label: 'Loser' },
            { value: 'neutral', label: 'Neutral' }
          ]
        }
      ]
    });
  }
  
  return formData;
};

module.exports = mongoose.model('AdminFormField', adminFormFieldSchema);

