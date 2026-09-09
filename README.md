# Learning Projects — ArpitaBuilds
A collection of projects built while working toward full-stack development and data science / ML readiness — spanning backend APIs, data analysis, and machine learning foundations.
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=flat&logo=scikitlearn&logoColor=white)
## Projects in this Repo
| Project | Week | Type | Stack |
|---------|------|------|-------|
| [Todo List REST API](#todo-list-rest-api) | Week 1-2 | Backend / REST API | Node.js (native `http` module) |
| [E-Commerce Sales Analysis](#e-commerce-sales-analysis) | Week 2-4 | Data Analysis | Python, Pandas, Matplotlib, Seaborn |
| [Math for ML — Interactive Intuition](#math-for-ml--interactive-intuition) | Week 5-6 | ML Foundations | Python, NumPy, SymPy, Matplotlib |
| [Regression & Classification Basics](#regression--classification-basics) | Week 7-8 | ML Foundations | Python, scikit-learn |
| [Feature Engineering & Model Evaluation](#feature-engineering-scaling--model-evaluation) | Week 9 | ML Foundations | Python, scikit-learn |
| [Pipelines & Clustering](#scikit-learn-pipelines--clustering) | Week 10 | ML Foundations | Python, scikit-learn, SciPy |
## Repository Structure
```
learning-projects/
│
├── todo-list-api/
│   └── server.js
│
├── ecommerce-analysis/
│   └── Project01_Ecommerce_Analysis.ipynb
│
├── ml-foundations/
│   ├── Math_for_ML_Week5-6.ipynb
│   ├── Regression_Classification_Basics.ipynb
│   ├── Model_Evaluation_Feature_Engineering.ipynb
│   └── Pipelines_and_Clustering.ipynb
│
└── README.md
```
---
# Todo List REST API
A simple and clean Todo List REST API built with pure Node.js (`http` module — no Express) featuring a live, responsive dashboard UI. Supports full CRUD operations, search, filtering, and completion tracking.
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![REST API](https://img.shields.io/badge/REST-API-blue?style=flat)
## Features
- Add, edit, and delete todos
- Mark todos as complete / pending
- Search todos by task name
- Filter by status (All / Completed / Pending)
- Live summary dashboard (Total, Completed, Pending counts)
- Fully responsive UI — works on mobile and desktop
- Zero external dependencies — built using only Node's native `http` module
## Tech Stack
- **Backend:** Node.js (native `http` module)
- **Frontend:** HTML, CSS, JavaScript (Vanilla, embedded in the same server file)
- **Data Storage:** In-memory (resets on server restart)
## Project Structure
```
todo-list-api/
│
├── server.js        # Backend API + Frontend UI (single file)
└── README.md         # Documentation
```
## Getting Started
### Prerequisites
- [Node.js](https://nodejs.org) installed on your machine
### Installation & Run
```bash
# Move into the project folder
cd todo-list-api
# Run the server
node server.js
```
The server will start at:
```
http://localhost:3000
```
Open this URL in your browser to use the dashboard.
## API Endpoints
| Method   | Endpoint              | Description                                  |
|----------|------------------------|-----------------------------------------------|
| `GET`    | `/api/todos`           | Get all todos (supports `?search=` & `?filter=`) |
| `GET`    | `/api/todos/summary`   | Get total / completed / pending counts        |
| `GET`    | `/api/todos/:id`       | Get a single todo by ID                       |
| `POST`   | `/api/todos`           | Create a new todo                             |
| `PUT`    | `/api/todos/:id`       | Update a todo's task or status                |
| `PATCH`  | `/api/todos/:id/toggle`| Toggle a todo between complete / pending      |
| `DELETE` | `/api/todos/:id`       | Delete a todo                                 |
### Example Requests
**Create a todo**
```http
POST /api/todos
Content-Type: application/json
{
  "task": "Learn REST APIs"
}
```
**Update a todo**
```http
PUT /api/todos/1
Content-Type: application/json
{
  "task": "Learn REST APIs in depth"
}
```
**Toggle complete/pending**
```http
PATCH /api/todos/1/toggle
```
**Delete a todo**
```http
DELETE /api/todos/1
```
**Search & filter**
```http
GET /api/todos?search=learn&filter=pending
```
## What I Learned
Building this project helped me understand:
- How REST APIs work under the hood using Node's native `http` module (without frameworks like Express)
- Handling different HTTP methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) and routing logic manually
- Parsing request bodies and URL query parameters
- Connecting a frontend UI to a backend API using `fetch()`
- Structuring in-memory data operations (CRUD)
## Future Improvements
- Add a database (MongoDB) for persistent storage
- Add user authentication (JWT)
- Add due dates and priority levels
- Add pagination for large todo lists
---
# E-Commerce Sales Analysis
An end-to-end data cleaning and exploratory analysis project on an e-commerce sales dataset — covers the full pipeline from raw, messy data to a summary dashboard of business insights.
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?style=flat&logo=pandas&logoColor=white)
![Matplotlib](https://img.shields.io/badge/Matplotlib-11557C?style=flat&logo=plotly&logoColor=white)
![Seaborn](https://img.shields.io/badge/Seaborn-4C72B0?style=flat)
![Jupyter](https://img.shields.io/badge/Jupyter-F37626?style=flat&logo=jupyter&logoColor=white)
## Features
- Full data inspection: shape, dtypes, missing values, duplicates, unique category values
- Data cleaning: missing numeric values filled with median, category text standardized, date columns fixed, duplicate rows removed
- Documented data cleaning log for traceability
- Revenue analysis by product category, with percentage contribution
- Regional analysis: average order value and total orders per region
- Monthly revenue trend, with top/bottom performing months highlighted
- Final multi-panel KPI dashboard: total revenue, top category, best-performing region
## Tech Stack
- **Language:** Python
- **Data Handling:** Pandas
- **Visualization:** Matplotlib, Seaborn
- **Environment:** Google Colab / Jupyter Notebook
## Project Structure
```
ecommerce-analysis/
│
└── Project01_Ecommerce_Analysis.ipynb   # Full cleaning + analysis pipeline
```
## Getting Started
### Prerequisites
- [Jupyter](https://jupyter.org) or [Google Colab](https://colab.research.google.com) access
- A CSV dataset with columns like `Product Category`, `Total Revenue`, `Region`, `Date`/`Month`
### Running It
```bash
# Open the notebook
jupyter notebook Project01_Ecommerce_Analysis.ipynb
```
Run all cells top to bottom. When prompted, upload your e-commerce CSV file.
## What I Learned
Building this project helped me understand:
- Structuring a real data cleaning workflow (inspect → clean → document → analyze)
- Groupby aggregations for business metrics (revenue by category/region, monthly trends)
- Turning raw analysis into a presentable KPI-style dashboard
## Future Improvements
- Automate the cleaning pipeline as reusable functions
- Add year-over-year comparison if multi-year data becomes available
- Deploy the dashboard as an interactive web app (e.g. Streamlit)
---
# Math for ML — Interactive Intuition
An intuition-first walkthrough of the linear algebra and calculus concepts that power machine learning models, with runnable code and visualizations for every concept.
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![NumPy](https://img.shields.io/badge/NumPy-013243?style=flat&logo=numpy&logoColor=white)
![SymPy](https://img.shields.io/badge/SymPy-3B5526?style=flat)
![Matplotlib](https://img.shields.io/badge/Matplotlib-11557C?style=flat&logo=plotly&logoColor=white)
## Features
- Vectors: magnitude, addition, geometric intuition
- Dot product: alignment between vectors, cosine similarity
- Matrices as transformations of space
- Eigenvalues & eigenvectors (intuition-level, connected to PCA)
- Derivatives: rate of change / slope, with symbolic differentiation (SymPy)
- Gradients & gradient descent: minimizing a loss function step by step, visualized
- Chain rule: manual derivation plus a worked 1-neuron forward + backward pass (the core mechanism behind backpropagation)
## Tech Stack
- **Language:** Python
- **Math & Arrays:** NumPy, SymPy
- **Visualization:** Matplotlib
## Project Structure
```
ml-foundations/
│
└── Math_for_ML_Week5-6.ipynb   # Linear algebra + calculus intuition, section by section
```
## Getting Started
### Prerequisites
- [Jupyter](https://jupyter.org) installed, or any notebook environment
### Running It
```bash
jupyter notebook Math_for_ML_Week5-6.ipynb
```
Run all cells top to bottom — every section is self-contained with its own code and visualization.
## What I Learned
Building this notebook helped me understand:
- Connecting abstract math (vectors, derivatives) to what's actually happening inside ML models
- How gradient descent is the shared mechanism behind training neural networks and gradient-boosted trees like XGBoost
- How the chain rule scales up into backpropagation
---
# Regression & Classification Basics
A hands-on comparison of core regression and classification algorithms, focused on when and why each one is used, including the underfitting/overfitting tradeoff and regularization.
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=flat&logo=scikitlearn&logoColor=white)
![NumPy](https://img.shields.io/badge/NumPy-013243?style=flat&logo=numpy&logoColor=white)
![Matplotlib](https://img.shields.io/badge/Matplotlib-11557C?style=flat&logo=plotly&logoColor=white)
## Features
- Linear Regression: fitting a best-fit line
- Polynomial Regression: capturing curved relationships, with a visual underfit vs. overfit comparison (degree 1 vs. 3 vs. 15)
- Ridge (L2) & Lasso (L1) regularization: how each shrinks model weights differently, with Lasso zeroing out irrelevant features
- Logistic Regression: classification via a sigmoid-squashed linear model, with a probability heatmap and decision boundary
- K-Nearest Neighbors (KNN): a training-free, distance-based classifier, with the effect of `k` on the decision boundary
## Tech Stack
- **Language:** Python
- **ML Library:** scikit-learn
- **Math & Arrays:** NumPy
- **Visualization:** Matplotlib
## Project Structure
```
ml-foundations/
│
└── Regression_Classification_Basics.ipynb   # All algorithms, section by section
```
## Getting Started
### Prerequisites
- [Jupyter](https://jupyter.org) installed, or any notebook environment
### Running It
```bash
jupyter notebook Regression_Classification_Basics.ipynb
```
Run all cells top to bottom — all data is synthetically generated in-notebook, so no external dataset is required.
## What I Learned
Building this notebook helped me understand:
- The practical difference between regression (predicting a number) and classification (predicting a category)
- How regularization (Ridge/Lasso) controls overfitting, and how that idea carries over into gradient-boosted models
- Why simple models like Logistic Regression and KNN are useful baselines before reaching for more complex models
---
# Feature Engineering, Scaling & Model Evaluation
A hands-on walkthrough of the checklist every model needs before and after training — handling missing data, engineering features, scaling, and properly evaluating a classifier on real medical data.
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=flat&logo=scikitlearn&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?style=flat&logo=pandas&logoColor=white)
![Matplotlib](https://img.shields.io/badge/Matplotlib-11557C?style=flat&logo=plotly&logoColor=white)
## Features
- Handling missing data with `SimpleImputer` (median strategy), on a real medical dataset with simulated missing values
- Feature engineering: ratio features and binning a continuous column into categories
- Feature scaling with `StandardScaler`, with a before/after distribution comparison
- Stratified train/test split for imbalanced medical data
- 5-fold cross-validation for a reliable performance estimate
- Confusion matrix, precision, recall, and F1-score, with medical-context interpretation (false negatives vs. false positives)
- ROC curve and AUC score
## Tech Stack
- **Language:** Python
- **ML Library:** scikit-learn
- **Data Handling:** Pandas
- **Visualization:** Matplotlib
## Project Structure
```
ml-foundations/
│
└── Model_Evaluation_Feature_Engineering.ipynb   # Full evaluation checklist, section by section
```
## Getting Started
### Prerequisites
- [Jupyter](https://jupyter.org) installed, or any notebook environment
### Running It
```bash
jupyter notebook Model_Evaluation_Feature_Engineering.ipynb
```
Run all cells top to bottom. Uses scikit-learn's built-in Breast Cancer Wisconsin dataset by default — swap in any CSV with a binary target column using the snippet provided in the notebook's intro cell.
## What I Learned
Building this notebook helped me understand:
- Why `stratify=y` matters for imbalanced medical classification data
- Why accuracy alone is misleading, and why recall matters more than precision when missing a positive case is costly
- How cross-validation gives a more trustworthy performance estimate than a single train/test split
- How ROC-AUC compares models independently of the classification threshold
---
# scikit-learn Pipelines & Clustering
A practical look at production-style scikit-learn workflows using `Pipeline`, followed by three unsupervised clustering methods and when each one is the right tool.
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=flat&logo=scikitlearn&logoColor=white)
![SciPy](https://img.shields.io/badge/SciPy-8CAAE6?style=flat&logo=scipy&logoColor=white)
![Matplotlib](https://img.shields.io/badge/Matplotlib-11557C?style=flat&logo=plotly&logoColor=white)
## Features
- Bundling `SimpleImputer` + `StandardScaler` + `LogisticRegression` into a single `Pipeline`, and why that prevents data leakage
- Cross-validation with a pipeline, so every fold gets its own correctly-fit preprocessing
- K-Means clustering with the elbow method for choosing `k`
- Hierarchical (Agglomerative) clustering with a dendrogram visualization
- DBSCAN density-based clustering, including a side-by-side comparison showing where K-Means fails on non-round clusters
- Outlier/noise detection as a natural byproduct of DBSCAN
## Tech Stack
- **Language:** Python
- **ML Library:** scikit-learn
- **Scientific Computing:** SciPy (dendrograms)
- **Visualization:** Matplotlib
## Project Structure
```
ml-foundations/
│
└── Pipelines_and_Clustering.ipynb   # Pipelines section, then all three clustering methods
```
## Getting Started
### Prerequisites
- [Jupyter](https://jupyter.org) installed, or any notebook environment
### Running It
```bash
jupyter notebook Pipelines_and_Clustering.ipynb
```
Run all cells top to bottom — uses the same built-in Breast Cancer dataset for the pipeline section, and synthetic blob/moon data for the clustering section.
## What I Learned
Building this notebook helped me understand:
- What data leakage is, and how `Pipeline` prevents it automatically during cross-validation
- The difference between choosing `k` upfront (K-Means) vs. deciding cluster count after seeing the structure (dendrogram)
- Why density-based clustering (DBSCAN) can succeed where centroid-based clustering (K-Means) fails, and how it naturally flags outliers
---
## Author
**Arpita** — ArpitaBuilds
Built as part of my journey toward full-stack development and internship readiness.
## License
This repository is open source and available under the MIT License.
