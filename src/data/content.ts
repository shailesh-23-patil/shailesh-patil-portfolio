// ─── All site content lives here. Edit text without touching components. ───

export interface Project {
  id: string;
  title: string;
  summary: string;
  description: string;
  approach: string;
  results: string;
  learned: string;
  stack: string[];
  stats: { label: string; value: string }[];
  repoUrl: string;
  liveUrl?: string;
  featured: boolean;
  category: ('ML' | 'Deep Learning' | 'Data Analysis' | 'AI/RAG' | 'Web')[];
  visualType: string;
}

export interface Skill {
  name: string;
  group: string;
}

export interface Education {
  degree: string;
  institution: string;
  detail: string;
  year: string;
}

export const siteConfig = {
  title: 'Shailesh Patil — Data Science & ML Portfolio',
  description:
    'Portfolio of Shailesh Patil, a Data Science and ML intern candidate specializing in Python, SQL, EDA, and building end-to-end machine learning projects.',
  url: 'https://shaileshpatil.dev',
  ogImage: '/assets/og-image.png',
};

export const personal = {
  name: 'Shailesh Patil',
  title: 'Data Science and ML Intern Candidate | Python | SQL | EDA',
  location: 'Pune, Maharashtra, India',
  statusBadge: 'Open to internships, full-time roles, remote or on-site, anywhere',
  email: 'shaileshpatil230904@gmail.com',
  phone: '+91 9529746938',
  github: 'https://github.com/shailesh-23-patil',
  linkedin: 'https://www.linkedin.com/in/shailesh-patil-675aa8329',
  instagram: 'https://www.instagram.com/shailesh.patil_23',
  resumeUrl: '/assets/Shailesh_Patil_Resume.pdf',
  photoUrl: '/assets/photo.jpg',
  monogram: 'SP',
};

export const bio = `I'm an MCA student at Vishwakarma University, Pune, who enjoys finding the story hiding inside messy data. I've built end-to-end ML projects, from catching an impossible-zero cholesterol problem in 18.7% of heart-disease records to a RAG-based study assistant that cites answers by file and page. I care about clean data, leak-free evaluation, and models I can explain. I'm looking for a Data Science or ML internship where I can learn fast and ship useful work.`;

export const heroTypingLines = [
  'Turning raw data into real insights.',
  'Building ML models that solve real problems.',
  'Python | SQL | Machine Learning | RAG',
];

export const heroStats = [
  { label: 'Projects', value: 8, suffix: '' },
  { label: 'Best CNN Accuracy', value: 99.12, suffix: '%' },
  { label: 'ROC-AUC', value: 0.93, suffix: '', decimals: 2 },
  { label: 'Rows Cleaned', value: 17966, suffix: '' },
];

export const education: Education[] = [
  {
    degree: 'Master of Computer Applications (MCA)',
    institution: 'Vishwakarma University, Pune',
    detail: 'Pursuing',
    year: '2025–',
  },
  {
    degree: 'B.B.A. (Computer Applications)',
    institution: 'Abhinav College of Computer Science and Management, SPPU',
    detail: 'CGPA 7.83',
    year: '2022–2025',
  },
  {
    degree: 'HSC',
    institution: 'Maharashtra State Board, Pune',
    detail: '',
    year: '2022',
  },
  {
    degree: 'SSC',
    institution: 'Maharashtra State Board, Pune',
    detail: '',
    year: '2020',
  },
];

export const languages = ['English', 'Hindi', 'Marathi'];

export const training = 'Self-paced Python Programming coursework.';

export const currentlyLearning = ['Deep Learning', 'NLP', 'Model Deployment'];

export const skillGroups: { group: string; skills: string[] }[] = [
  {
    group: 'Data & Analytics',
    skills: [
      'Python', 'SQL', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Plotly',
      'Jupyter', 'EDA', 'Data Cleaning', 'Feature Engineering',
    ],
  },
  {
    group: 'Machine Learning',
    skills: [
      'scikit-learn', 'Linear Regression', 'Logistic Regression', 'Random Forest',
      'Pipelines', 'Cross-Validation', 'R²', 'ROC-AUC',
      'Pearson & Chi-square Tests', 'TensorFlow/Keras (CNN)',
    ],
  },
  {
    group: 'Databases',
    skills: ['MySQL', 'SQLite', 'Relational DB Design', 'SQL Workbench'],
  },
  {
    group: 'AI & Research',
    skills: ['LLMs', 'NLP', 'Embeddings', 'Semantic Search (FAISS)', 'RAG', 'Google Gemini API'],
  },
  {
    group: 'Backend & Tools',
    skills: ['Flask', 'REST APIs', 'JWT Auth', 'Streamlit', 'Git', 'GitHub', 'VS Code'],
  },
  {
    group: 'Foundations',
    skills: ['DSA', 'OOP', 'Java', 'C', 'C++'],
  },
];

export const projects: Project[] = [
  {
    id: 'heart-disease',
    title: 'Heart Disease Data Analysis & Prediction',
    summary:
      'Uncovered a hidden data quality issue in 18.7% of records and built a leak-free ML pipeline for heart disease prediction.',
    description:
      'Analyzed the UCI heart disease dataset (918 records) and discovered that 172 records (18.7%) had an impossible cholesterol value of 0. Those patients had an 88% heart-disease rate versus 48% for the rest, revealing a major data quality issue.',
    approach:
      'Instead of only mean-filling the zero cholesterol values, added a missing-value indicator flag. Built logistic regression and random forest classifiers inside leak-free pipelines with proper train/test separation.',
    results:
      'Achieved 0.93 ROC-AUC (5-fold cross-validation) and 0.92 recall on the held-out test set. The missing-value flag improved both models.',
    learned:
      'That seemingly valid data can hide systematic bias, and that feature engineering from data quality issues can be more valuable than complex models.',
    stack: ['Python', 'Pandas', 'Seaborn', 'scikit-learn'],
    stats: [
      { label: 'ROC-AUC', value: '0.93' },
      { label: 'Recall', value: '0.92' },
      { label: 'Affected Records', value: '18.7%' },
    ],
    repoUrl: 'https://github.com/shailesh-23-patil/Heart-Disease-Prediction-ML',
    featured: true,
    category: ['ML'],
    visualType: 'ecg',
  },
  {
    id: 'campusgpt',
    title: 'CampusGPT: AI Academic Assistant',
    summary:
      'A RAG pipeline that turns unstructured PDF notes into searchable, citable answers.',
    description:
      'Built a Retrieval-Augmented Generation system that processes academic PDF documents, extracts text, chunks it intelligently, and creates searchable embeddings using the Google Gemini API.',
    approach:
      'PDF extraction with pypdf, intelligent text chunking, embedding generation via Gemini API, and FAISS vector similarity search. Every answer is grounded in retrieved passages and cited to file and page number.',
    results:
      'Answers are grounded in source material with precise citations. Session-based chat history enables follow-up questions that maintain context.',
    learned:
      'How to build production-quality RAG systems, the importance of chunking strategy, and the tradeoffs between retrieval precision and recall.',
    stack: ['Python', 'Flask', 'FAISS', 'NumPy', 'pypdf', 'Google Gemini API'],
    stats: [
      { label: 'Architecture', value: 'RAG' },
      { label: 'Embedding', value: 'Gemini' },
      { label: 'Search', value: 'FAISS' },
    ],
    repoUrl: 'https://github.com/shailesh-23-patil/CampusGPT',
    featured: true,
    category: ['AI/RAG'],
    visualType: 'rag',
  },
  {
    id: 'digit-recognition',
    title: 'AI-Based Handwritten Digit Recognition',
    summary:
      'A CNN achieving 99.12% accuracy on MNIST with a live drawing interface for real-time predictions.',
    description:
      'Designed and trained a Convolutional Neural Network on the MNIST dataset with 225,034 trainable parameters, achieving 99.12% test accuracy.',
    approach:
      'Built a CNN architecture in TensorFlow/Keras, trained on 60,000 MNIST images. Created a Streamlit web app where users can draw or upload digits and see confidence scores for all ten classes.',
    results:
      '99.12% test accuracy (9,912 of 10,000 correct), 99.20% best validation accuracy. The Streamlit app provides real-time predictions with confidence visualization.',
    learned:
      'CNN architecture design, the importance of data augmentation, and how to serve deep learning models through interactive web interfaces.',
    stack: ['Python', 'TensorFlow/Keras', 'Streamlit', 'Pillow', 'NumPy', 'MNIST'],
    stats: [
      { label: 'Test Accuracy', value: '99.12%' },
      { label: 'Parameters', value: '225K' },
      { label: 'Correct', value: '9,912/10K' },
    ],
    repoUrl:
      'https://github.com/shailesh-23-patil/AI-Based-Handwritten-Digit-Recognition-System',
    featured: true,
    category: ['Deep Learning'],
    visualType: 'digit',
  },
  {
    id: 'diabetes-prediction',
    title: 'AI-Based Diabetes Prediction System',
    summary:
      'Random Forest on 100K records with honest reporting on synthetic data limitations.',
    description:
      'Built a diabetes prediction system using Random Forest on a 100,000-record synthetic health dataset with 28 features, excluding leakage columns.',
    approach:
      'Stratified 80/20 train-test split, Random Forest classifier with careful feature selection to exclude leakage columns (like HbA1c and glucose which directly indicate diabetes).',
    results:
      '91.96% accuracy, 94.13% ROC-AUC, 99.94% precision, 86.65% recall. The model leans heavily on HbA1c and glucose; planned improvement is a lifestyle-only variant and better recall.',
    learned:
      'The importance of being honest about model limitations, especially with synthetic data. High metrics don\'t always mean a useful model.',
    stack: ['Python', 'scikit-learn', 'Pandas', 'Streamlit', 'Joblib'],
    stats: [
      { label: 'Accuracy', value: '91.96%' },
      { label: 'ROC-AUC', value: '94.13%' },
      { label: 'Dataset', value: '100K rows' },
    ],
    repoUrl:
      'https://github.com/shailesh-23-patil/AI-Based-Diabetes-Prediction-System',
    featured: true,
    category: ['ML'],
    visualType: 'forest',
  },
  {
    id: 'ford-price',
    title: 'Ford Car Price Prediction',
    summary:
      'Cleaned 17,966 listings and improved R² from 0.85 to 0.92 with random forest.',
    description:
      'Analyzed and cleaned a dataset of 17,966 Ford car listings, handling 154 duplicates, a car dated 2060, and 51 zero engine sizes.',
    approach:
      'Thorough EDA and data cleaning, feature engineering with one-hot encoding (which beat label encoding: 0.85 vs 0.74 R²), and model comparison from linear regression to random forest.',
    results:
      'R² improved from 0.85 (linear regression) to 0.92 (random forest) with 5-fold cross-validation. One-hot encoding outperformed label encoding significantly.',
    learned:
      'That encoding strategy can matter as much as model choice, and that real-world data always has surprises (a car from 2060).',
    stack: ['Python', 'Pandas', 'Seaborn', 'scikit-learn'],
    stats: [
      { label: 'R²', value: '0.92' },
      { label: 'Records', value: '17,966' },
      { label: 'Improvement', value: '+0.07 R²' },
    ],
    repoUrl: 'https://github.com/shailesh-23-patil/Ford-Vehicle-ML-Analysis',
    featured: false,
    category: ['ML'],
    visualType: 'scatter',
  },
  {
    id: 'insurance-cost',
    title: 'Insurance Cost Analysis',
    summary:
      'Smokers pay 3.8× more on average; an interaction feature matched gradient boosting.',
    description:
      'Analyzed medical insurance costs across 1,337 records, discovering that smokers pay 3.8× more on average ($32,050 vs $8,441).',
    approach:
      'Comprehensive EDA with statistical tests, feature engineering with a smoker × obese interaction feature, and model comparison across multiple regressors.',
    results:
      'Cross-validated R² improved from 0.74 to 0.86 with the smoker × obese interaction feature, matching gradient boosting performance with a simpler model.',
    learned:
      'Domain-informed feature engineering can close the gap between simple and complex models.',
    stack: ['Python', 'Pandas', 'scikit-learn', 'SciPy'],
    stats: [
      { label: 'R²', value: '0.86' },
      { label: 'Smoker Premium', value: '3.8×' },
      { label: 'Records', value: '1,337' },
    ],
    repoUrl:
      'https://github.com/shailesh-23-patil/Medical-Insurance-Cost-Prediction',
    featured: false,
    category: ['ML'],
    visualType: 'splitbar',
  },
  {
    id: 'retail-sales',
    title: 'Retail Sales Analytics Dashboard',
    summary:
      'Interactive dashboard with KPIs, trends, and filters over 1,000 transactions.',
    description:
      'Built an interactive analytics dashboard analyzing 1,000 retail transactions with KPI cards, category and monthly trends, gender and age-group analysis.',
    approach:
      'Streamlit-based dashboard with Plotly visualizations, sidebar filters for dynamic data exploration, transaction search, and CSV export functionality.',
    results:
      'Electronics led revenue; May was the peak month. Dashboard provides instant insights through interactive filtering and search.',
    learned:
      'Building user-friendly data products that non-technical stakeholders can use independently.',
    stack: ['Python', 'Pandas', 'Plotly', 'Streamlit'],
    stats: [
      { label: 'Transactions', value: '1,000' },
      { label: 'Top Category', value: 'Electronics' },
      { label: 'Peak Month', value: 'May' },
    ],
    repoUrl:
      'https://github.com/shailesh-23-patil/Retail-Sales-Data-Analysis',
    featured: false,
    category: ['Data Analysis'],
    visualType: 'dashboard',
  },
  {
    id: 'momo-dragon',
    title: 'The Momo Dragon: Restaurant Ordering App',
    summary:
      'Full-stack restaurant ordering system with auth, order tracking, and admin dashboard.',
    description:
      'Built a full-stack web application for a local cafe client with user accounts, ordering, and order history management.',
    approach:
      'Flask REST API backend with SQLite database, JWT authentication, bcrypt password hashing, and an admin dashboard for order management.',
    results:
      'Complete ordering system with user registration, menu browsing, cart management, order placement, and order history. Admin dashboard for the cafe owner.',
    learned:
      'End-to-end web development, API design, authentication patterns, and working with a real client.',
    stack: ['Python', 'Flask', 'SQLite', 'JWT', 'bcrypt', 'HTML', 'CSS', 'JavaScript'],
    stats: [
      { label: 'Type', value: 'Freelance' },
      { label: 'Auth', value: 'JWT + bcrypt' },
      { label: 'DB', value: 'SQLite' },
    ],
    repoUrl: 'https://github.com/shailesh-23-patil/Cafe_Frontend',
    featured: false,
    category: ['Web'],
    visualType: 'menu',
  },
];

export const filterCategories = [
  'All',
  'ML',
  'Deep Learning',
  'Data Analysis',
  'AI/RAG',
  'Web',
] as const;

export const dataDetective = {
  totalDots: 918,
  affectedDots: 172,
  percentage: '18.7%',
  affectedRate: '88%',
  normalRate: '48%',
  caption:
    '172 of 918 heart-disease records had an impossible cholesterol value of 0. Those patients had an 88% heart-disease rate versus 48% for the rest — a hidden data quality signal most analyses would miss.',
};
