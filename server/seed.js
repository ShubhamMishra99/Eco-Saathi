const mongoose = require('mongoose');
const PriceItem = require('./models/PriceChart');

const items = [
  {
    icon: '📰',
    name: 'NEWSPAPER',
    price: 'RS 14/KG',
    notes: '**MARKET RATES DROPPED RECENTLY',
  },
  {
    icon: '👕',
    name: 'CLOTHES',
    price: 'RS 2/KG',
    notes: "(ACCEPTED ONLY WHEN GIVEN WITH OTHER SCRAP ITEMS)\n(WE DON'T ACCEPT UNDERGARMENTS)",
  },
  {
    icon: '🍾',
    name: 'GLASS BOTTLES',
    price: 'RS 2/KG',
    notes: '(ACCEPTED ONLY WHEN GIVEN WITH OTHER SCRAP ITEMS)',
  },
  {
    icon: '📄',
    name: 'OFFICE PAPER (A3/A4)',
    price: 'RS 14/KG',
    notes: null,
  },
  {
    icon: '📚',
    name: 'COPIES/BOOKS',
    price: 'RS 12/KG',
    notes: null,
  },
  {
    icon: '📦',
    name: 'CARDBOARD',
    price: 'RS 8/KG',
    notes: '**TO GET QUOTE FOR BULK QTY, CALL AT +91-8595358613',
  },
  {
    icon: '🧴',
    name: 'PET BOTTLES/ OTHER PLASTIC',
    price: 'RS 8/KG',
    notes: null,
  },
  {
    icon: '🔩',
    name: 'IRON',
    price: 'RS 26/KG',
    notes: '**TO GET QUOTE FOR BULK QTY, CALL AT +91-8595358613',
  },
  {
    icon: '🥄',
    name: 'STEEL UTENSILS',
    price: 'RS 40/KG',
    notes: null,
  },
  {
    icon: '🥫',
    name: 'ALUMINIUM',
    price: 'RS 105/KG',
    notes: null,
  },
  {
    icon: '🔗',
    name: 'BRASS',
    price: 'RS 305/KG',
    notes: null,
  },
  {
    icon: '🧵',
    name: 'COPPER',
    price: 'RS 425/KG',
    notes: null,
  },
  {
    icon: '💻',
    name: 'E-WASTE (LAPTOPS, PHONES)',
    price: 'RS 50/KG',
    notes: '**DATA WILL BE SECURELY ERASED BEFORE RECYCLING',
  },
  {
    icon: '🔋',
    name: 'BATTERIES',
    price: 'RS 10/KG',
    notes: '(ONLY NON-LEAKING BATTERIES ACCEPTED)',
  },
  {
    icon: '🖥️',
    name: 'MONITORS',
    price: 'RS 100/UNIT',
    notes: '**TO GET QUOTE FOR BULK QTY, CALL AT +91-8595358613',
  },
  {
    icon: '🛢️',
    name: 'USED OIL CANS',
    price: 'RS 5/KG',
    notes: '(ONLY CLEANED CANS ACCEPTED)',
  },
  {
    icon: '🪑',
    name: 'WOODEN FURNITURE',
    price: 'RS 15/KG',
    notes: '(ONLY DAMAGED OR BROKEN FURNITURE ACCEPTED)',
  },
  {
    icon: '🧹',
    name: 'BROOMS',
    price: 'RS 3/KG',
    notes: '(ONLY PLASTIC OR METAL BROOMS ACCEPTED)',
  },
  {
    icon: '🪞',
    name: 'MIRRORS',
    price: 'RS 10/KG',
    notes: '(BROKEN MIRRORS ACCEPTED)',
  },
  {
    icon: '🛠️',
    name: 'TOOLS',
    price: 'RS 20/KG',
    notes: '(DAMAGED OR RUSTED TOOLS ACCEPTED)',
  },
];

mongoose.connect('mongodb+srv://mishrashubham8932:Shubh9956@ecosaathi.fzht13t.mongodb.net/ecosaathi?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('MongoDB connected. Seeding...');
  await PriceItem.deleteMany({});
  await PriceItem.insertMany(items);
  console.log('Database seeded with price items!');
  mongoose.disconnect();
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});
