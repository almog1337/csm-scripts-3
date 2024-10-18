import { Script } from '../types';

export const scripts: Script[] = [
  {
    id: '1',
    name: 'דוח משתמשים מורחב',
    description: 'הפקת דוח מפורט של כל המשתמשים עם מידע נוסף',
    type: 'דוח',
    tags: ['משתמשים', 'דוח', 'ניתוח'],
    sections: [
      {
        id: 'user_filters',
        title: 'סינון משתמשים',
        inputs: [
          { name: 'תאריך_הצטרפות_מ', type: 'date', required: true, label: 'תאריך הצטרפות מ-' },
          { name: 'תאריך_הצטרפות_עד', type: 'date', required: true, label: 'תאריך הצטרפות עד-' },
          { name: 'סטטוס_משתמש', type: 'select', required: true, label: 'סטטוס משתמש', options: ['פעיל', 'לא פעיל', 'מושהה', 'הכל'] },
        ],
        validate: (sectionInputs) => {
          const fromDate = new Date(sectionInputs['תאריך_הצטרפות_מ']);
          const toDate = new Date(sectionInputs['תאריך_הצטרפות_עד']);
          return fromDate <= toDate ? null : 'תאריך ההתחלה חייב להיות לפני תאריך הסיום';
        }
      },
      {
        id: 'report_options',
        title: 'אפשרויות דוח',
        inputs: [
          { name: 'כלול_פרטים_אישיים', type: 'select', required: true, label: 'כלול פרטים אישיים', options: ['כן', 'לא'] },
          { name: 'כלול_היסטוריית_פעילות', type: 'select', required: true, label: 'כלול היסטוריית פעילות', options: ['כן', 'לא'] },
          { name: 'פורמט_קובץ', type: 'select', required: true, label: 'פורמט קובץ', options: ['CSV', 'Excel', 'PDF'] },
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'עיבוד נתונים בסיסי',
    description: 'סקריפט לעיבוד נתונים בסיסי לצורך בדיקה',
    type: 'עיבוד נתונים',
    tags: ['נתונים', 'עיבוד', 'בדיקה'],
    sections: [
      {
        id: 'data_source',
        title: 'מקור נתונים',
        inputs: [
          { name: 'סוג_קובץ', type: 'select', required: true, label: 'סוג קובץ', options: ['CSV', 'JSON', 'XML'] },
          { name: 'שם_קובץ', type: 'text', required: true, label: 'שם קובץ' },
          { name: 'מספר_שורות_לעיבוד', type: 'number', required: false, label: 'מספר שורות לעיבוד (ריק לכל השורות)' },
        ]
      },
      {
        id: 'processing_options',
        title: 'אפשרויות עיבוד',
        inputs: [
          { name: 'סוג_עיבוד', type: 'select', required: true, label: 'סוג עיבוד', options: ['ניקוי נתונים', 'טרנספורמציה', 'אגרגציה'] },
          { name: 'שמור_לוג', type: 'select', required: true, label: 'שמור לוג עיבוד', options: ['כן', 'לא'] },
          { name: 'הפעל_בדיקות_תקינות', type: 'select', required: true, label: 'הפעל בדיקות תקינות', options: ['כן', 'לא'] },
        ]
      },
      {
        id: 'output_options',
        title: 'אפשרויות פלט',
        inputs: [
          { name: 'פורמט_פלט', type: 'select', required: true, label: 'פורמט פלט', options: ['CSV', 'JSON', 'XML'] },
          { name: 'שם_קובץ_פלט', type: 'text', required: true, label: 'שם קובץ פלט' },
          { name: 'דחיסת_קובץ', type: 'select', required: true, label: 'דחיסת קובץ', options: ['ללא דחיסה', 'ZIP', 'GZIP'] },
        ]
      }
    ]
  },
  {
    id: '4',
    name: 'סקר שביעות רצון לקוחות',
    description: 'יצירה והפצה של סקר שביעות רצון לקוחות',
    type: 'סקר',
    tags: ['לקוחות', 'שביעות רצון', 'סקר'],
    sections: [
      {
        id: 'survey_details',
        title: 'פרטי הסקר',
        inputs: [
          { name: 'שם_הסקר', type: 'text', required: true, label: 'שם הסקר' },
          { name: 'תיאור_הסקר', type: 'text', required: true, label: 'תיאור הסקר' },
          { name: 'תאריך_תפוגה', type: 'date', required: true, label: 'תאריך תפוגה' },
        ]
      },
      {
        id: 'target_audience',
        title: 'קהל יעד',
        inputs: [
          { name: 'סוג_לקוחות', type: 'select', required: true, label: 'סוג לקוחות', options: ['כל הלקוחות', 'לקוחות חדשים', 'לקוחות ותיקים'] },
          { name: 'אזור_גיאוגרפי', type: 'text', required: false, label: 'אזור גיאוגרפי' },
        ]
      },
      {
        id: 'distribution_method',
        title: 'שיטת הפצה',
        inputs: [
          { name: 'אמצעי_הפצה', type: 'select', required: true, label: 'אמצעי הפצה', options: ['דואר אלקטרוני', 'SMS', 'הודעה באפליקציה'] },
          { name: 'תזכורות', type: 'select', required: true, label: 'לשלוח תזכורות', options: ['כן', 'לא'] },
        ]
      }
    ]
  },
  {
    id: '5',
    name: 'ניהול מלאי אוטומטי',
    description: 'עדכון והזמנה אוטומטית של מלאי על פי כללים מוגדרים',
    type: 'ניהול מלאי',
    tags: ['מלאי', 'אוטומציה', 'הזמנות'],
    sections: [
      {
        id: 'inventory_rules',
        title: 'כללי מלאי',
        inputs: [
          { name: 'סף_מינימום', type: 'number', required: true, label: 'סף מינימום להזמנה' },
          { name: 'כמות_הזמנה', type: 'number', required: true, label: 'כמות להזמנה אוטומטית' },
        ]
      },
      {
        id: 'product_categories',
        title: 'קטגוריות מוצרים',
        inputs: [
          { name: 'קטגוריות_לניהול', type: 'text', required: true, label: 'קטגוריות לניהול (מופרדות בפסיקים)' },
          { name: 'החרגות', type: 'text', required: false, label: 'מוצרים להחרגה (מופרדים בפסיקים)' },
        ]
      },
      {
        id: 'notifications',
        title: 'התראות',
        inputs: [
          { name: 'התראות_מלאי_נמוך', type: 'select', required: true, label: 'התראות מלאי נמוך', options: ['כן', 'לא'] },
          { name: 'דוח_הזמנות', type: 'select', required: true, label: 'דוח הזמנות אוטומטי', options: ['יומי', 'שבועי', 'חודשי', 'ללא'] },
        ]
      }
    ]
  }
];