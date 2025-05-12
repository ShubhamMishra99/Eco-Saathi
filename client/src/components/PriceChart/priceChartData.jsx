import React from 'react';

// Data for the recyclable items
export const priceChartItems = [
  {
    id: 1,
    icon: '📰', // Using emoji as a placeholder for the icon
    name: 'NEWSPAPER',
    price: 'RS 14/KG',
    notes: '**MARKET RATES DROPPED RECENTLY',
  },
  {
    id: 2,
    icon: '👕',
    name: 'CLOTHES',
    price: 'RS 2/KG',
    notes: "(ACCEPTED ONLY WHEN GIVEN WITH OTHER SCRAP ITEMS)\n(WE DON'T ACCEPT UNDERGARMENTS)",
  },
  {
    id: 3,
    icon: '🍾',
    name: 'GLASS BOTTLES',
    price: 'RS 2/KG',
    notes: '(ACCEPTED ONLY WHEN GIVEN WITH OTHER SCRAP ITEMS)',
  },
  {
    id: 4,
    icon: '📄',
    name: 'OFFICE PAPER (A3/A4)',
    price: 'RS 14/KG',
    notes: null,
  },
  {
    id: 5,
    icon: '📚',
    name: 'COPIES/BOOKS',
    price: 'RS 12/KG',
    notes: null,
  },
  {
    id: 6,
    icon: '📦',
    name: 'CARDBOARD',
    price: 'RS 8/KG',
    notes: '**TO GET QUOTE FOR BULK QTY, CALL AT +91-8595358613',
  },
  {
    id: 7,
    icon: '🧴',
    name: 'PET BOTTLES/ OTHER PLASTIC',
    price: 'RS 8/KG',
    notes: null,
  },
  {
    id: 8,
    icon: '🔩',
    name: 'IRON',
    price: 'RS 26/KG',
    notes: '**TO GET QUOTE FOR BULK QTY, CALL AT +91-8595358613',
  },
  {
    id: 9,
    icon: '🥄',
    name: 'STEEL UTENSILS',
    price: 'RS 40/KG',
    notes: null,
  },
  {
    id: 10,
    icon: '🥫',
    name: 'ALUMINIUM',
    price: 'RS 105/KG',
    notes: null,
  },
  {
    id: 11,
    icon: '🔗',
    name: 'BRASS',
    price: 'RS 305/KG',
    notes: null,
  },
  {
    id: 12,
    icon: '🧵',
    name: 'COPPER',
    price: 'RS 425/KG',
    notes: null,
  },
  // New Recyclable Items
  {
    id: 13,
    icon: '💻',
    name: 'E-WASTE (LAPTOPS, PHONES)',
    price: 'RS 50/KG',
    notes: '**DATA WILL BE SECURELY ERASED BEFORE RECYCLING',
  },
  {
    id: 14,
    icon: '🔋',
    name: 'BATTERIES',
    price: 'RS 10/KG',
    notes: '(ONLY NON-LEAKING BATTERIES ACCEPTED)',
  },
  {
    id: 15,
    icon: '🖥️',
    name: 'MONITORS',
    price: 'RS 100/UNIT',
    notes: '**TO GET QUOTE FOR BULK QTY, CALL AT +91-8595358613',
  },
  {
    id: 16,
    icon: '🛢️',
    name: 'USED OIL CANS',
    price: 'RS 5/KG',
    notes: '(ONLY CLEANED CANS ACCEPTED)',
  },
  {
    id: 17,
    icon: '🪑',
    name: 'WOODEN FURNITURE',
    price: 'RS 15/KG',
    notes: '(ONLY DAMAGED OR BROKEN FURNITURE ACCEPTED)',
  },
  {
    id: 18,
    icon: '🧹',
    name: 'BROOMS',
    price: 'RS 3/KG',
    notes: '(ONLY PLASTIC OR METAL BROOMS ACCEPTED)',
  },
  {
    id: 19,
    icon: '🪞',
    name: 'MIRRORS',
    price: 'RS 10/KG',
    notes: '(BROKEN MIRRORS ACCEPTED)',
  },
  {
    id: 20,
    icon: '🛠️',
    name: 'TOOLS',
    price: 'RS 20/KG',
    notes: '(DAMAGED OR RUSTED TOOLS ACCEPTED)',
  },
];

export const formatNote = (note) => {
  if (!note) return null;
  if (note.startsWith('**')) {
    // For notes starting with **, make the whole note bold
    return <strong>{note.substring(2)}</strong>;
  }
  // For other notes, preserve line breaks
  return note.split('\n').map((line, index, arr) => (
    <React.Fragment key={index}>
      {line}
      {index < arr.length - 1 && <br />}
    </React.Fragment>
  ));
};