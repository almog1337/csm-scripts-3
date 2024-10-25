import { Script } from '../types';

export const scripts: Script[] = [
  {
    id: '1',
    name: 'סקריפט דוגמה מקיף',
    description: 'סקריפט זה מדגים את כל סוגי הקלט האפשריים במערכת',
    type: 'דוגמה',
    tags: ['דוגמה', 'כללי', 'מקיף'],
    sections: [
      {
        id: 'basic_inputs',
        title: 'קלטים בסיסיים',
        inputs: [
          {
            name: 'text_input',
            type: 'text',
            required: true,
            label: 'קלט טקסט',
          },
          {
            name: 'number_input',
            type: 'number',
            required: true,
            label: 'קלט מספרי',
          },
          {
            name: 'date_input',
            type: 'date',
            required: false,
            label: 'קלט תאריך',
          },
          {
            name: 'select_input',
            type: 'select',
            required: true,
            label: 'קלט בחירה',
            options: ['אפשרות 1', 'אפשרות 2', 'אפשרות 3'],
          },
        ],
      },
      {
        id: 'advanced_inputs',
        title: 'קלטים מתקדמים',
        inputs: [
          {
            name: 'array_input',
            type: 'text',
            required: true,
            label: 'קלט מערך מחרוזות',
            isArray: true,
          },
          {
            name: 'table_input',
            type: 'table',
            required: false,
            label: 'קלט טבלה',
            isTable: true,
            columns: [
              { key: 'name', label: 'שם', type: 'text' },
              { key: 'age', label: 'גיל', type: 'number' },
              { key: 'role', label: 'תפקיד', type: 'select', options: ['מנהל', 'עובד', 'לקוח'] },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'ניהול משימות פרויקט',
    description: 'סקריפט לניהול משימות בפרויקט עם אפשרויות מתקדמות',
    type: 'ניהול פרויקטים',
    tags: ['פרויקטים', 'משימות', 'ניהול'],
    sections: [
      {
        id: 'project_details',
        title: 'פרטי הפרויקט',
        inputs: [
          {
            name: 'project_name',
            type: 'text',
            required: true,
            label: 'שם הפרויקט',
          },
          {
            name: 'project_description',
            type: 'text',
            required: false,
            label: 'תיאור הפרויקט',
          },
          {
            name: 'start_date',
            type: 'date',
            required: true,
            label: 'תאריך התחלה',
          },
          {
            name: 'end_date',
            type: 'date',
            required: true,
            label: 'תאריך סיום',
          },
        ],
        validate: (inputs) => {
          const startDate = new Date(inputs.start_date);
          const endDate = new Date(inputs.end_date);
          return startDate < endDate ? null : 'תאריך הסיום חייב להיות אחרי תאריך ההתחלה';
        },
      },
      {
        id: 'team_members',
        title: 'חברי צוות',
        inputs: [
          {
            name: 'team_members',
            type: 'text',
            required: true,
            label: 'חברי צוות',
            isArray: true,
          },
        ],
      },
      {
        id: 'tasks',
        title: 'משימות',
        inputs: [
          {
            name: 'tasks',
            type: 'table',
            required: true,
            label: 'רשימת משימות',
            isTable: true,
            columns: [
              { key: 'task_name', label: 'שם המשימה', type: 'text' },
              { key: 'assignee', label: 'אחראי', type: 'text' },
              { key: 'start_date', label: 'תאריך התחלה', type: 'date' },
              { key: 'end_date', label: 'תאריך סיום', type: 'date' },
              { key: 'status', label: 'סטטוס', type: 'select', options: ['טרם התחיל', 'בתהליך', 'הושלם'] },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'ניתוח נתוני מכירות',
    description: 'סקריפט לניתוח נתוני מכירות וחישוב סטטיסטיקות',
    type: 'ניתוח נתונים',
    tags: ['מכירות', 'ניתוח', 'סטטיסטיקה'],
    sections: [
      {
        id: 'date_range',
        title: 'טווח תאריכים',
        inputs: [
          {
            name: 'start_date',
            type: 'date',
            required: true,
            label: 'תאריך התחלה',
          },
          {
            name: 'end_date',
            type: 'date',
            required: true,
            label: 'תאריך סיום',
          },
        ],
        validate: (inputs) => {
          const startDate = new Date(inputs.start_date);
          const endDate = new Date(inputs.end_date);
          return startDate < endDate ? null : 'תאריך הסיום חייב להיות אחרי תאריך ההתחלה';
        },
      },
      {
        id: 'product_categories',
        title: 'קטגוריות מוצרים',
        inputs: [
          {
            name: 'categories',
            type: 'text',
            required: true,
            label: 'קטגוריות לניתוח',
            isArray: true,
          },
        ],
      },
      {
        id: 'sales_data',
        title: 'נתוני מכירות',
        inputs: [
          {
            name: 'sales',
            type: 'table',
            required: true,
            label: 'טבלת מכירות',
            isTable: true,
            columns: [
              { key: 'date', label: 'תאריך', type: 'date' },
              { key: 'product', label: 'מוצר', type: 'text' },
              { key: 'category', label: 'קטגוריה', type: 'text' },
              { key: 'quantity', label: 'כמות', type: 'number' },
              { key: 'price', label: 'מחיר', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'analysis_options',
        title: 'אפשרויות ניתוח',
        inputs: [
          {
            name: 'group_by',
            type: 'select',
            required: true,
            label: 'קיבוץ לפי',
            options: ['יום', 'שבוע', 'חודש'],
          },
          {
            name: 'metrics',
            type: 'text',
            required: true,
            label: 'מדדים לחישוב',
            isArray: true,
          },
        ],
      },
    ],
  },
  {
    id: '4',
    name: 'ניהול מלאי מוצרים',
    description: 'סקריפט לניהול ועדכון מלאי מוצרים עם וולידציה מתקדמת',
    type: 'ניהול מלאי',
    tags: ['מלאי', 'מוצרים', 'וולידציה'],
    sections: [
      {
        id: 'inventory_update',
        title: 'עדכון מלאי',
        inputs: [
          {
            name: 'inventory_items',
            type: 'table',
            required: true,
            label: 'פריטי מלאי',
            isTable: true,
            columns: [
              { key: 'sku', label: 'מק"ט', type: 'text', required: true },
              { key: 'name', label: 'שם המוצר', type: 'text', required: true },
              { key: 'quantity', label: 'כמות', type: 'number', required: true },
              { key: 'min_quantity', label: 'כמות מינימום', type: 'number', required: true },
              { key: 'price', label: 'מחיר', type: 'number', required: true },
              { key: 'location', label: 'מיקום', type: 'select', options: ['מחסן ראשי', 'מחסן משני', 'חנות'], required: true }
            ],
            validateRow: (row) => {
              if (!row.sku || !row.sku.match(/^[A-Z0-9]{6,}$/)) {
                return 'מק"ט חייב להכיל לפחות 6 תווים של אותיות גדולות ומספרים';
              }
              if (!row.name || row.name.length < 3) {
                return 'שם המוצר חייב להכיל לפחות 3 תווים';
              }
              if (isNaN(row.quantity) || Number(row.quantity) < 0) {
                return 'כמות חייבת להיות מספר חיובי';
              }
              if (isNaN(row.min_quantity) || Number(row.min_quantity) < 0) {
                return 'כמות מינימום חייבת להיות מספר חיובי';
              }
              if (Number(row.quantity) < Number(row.min_quantity)) {
                return 'כמות נוכחית נמוכה מכמות המינימום';
              }
              if (isNaN(row.price) || Number(row.price) <= 0) {
                return 'מחיר חייב להיות מספר חיובי גדול מ-0';
              }
              if (!row.location) {
                return 'חובה לבחור מיקום';
              }
              return null;
            }
          }
        ]
      }
    ]
  }
];