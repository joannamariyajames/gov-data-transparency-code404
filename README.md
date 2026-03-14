# gov-data-transparency-platform
# CivicLens — Government Data Transparency Platform

CivicLens is a web platform designed to make **government spending data easier to explore, understand, and analyze**.

Government datasets are often publicly available but difficult for everyday citizens to interpret. CivicLens transforms raw public data into **interactive visualizations and AI-generated insights**, helping users explore trends across sectors and states.

The platform aims to make public spending more **transparent, accessible, and easier to analyze** for journalists, researchers, students, and citizens.

---

## Features

### Interactive Data Dashboard
Visualize government spending across different sectors using dynamic charts and filters.

### AI-Powered Insights
Generate automated explanations and insights from the data using natural language queries.

### Smart Query Interface
Users can ask questions like:

- Compare education budgets of Karnataka and Kerala  
- Which state spent the most on healthcare in 2023?  
- Show infrastructure spending trends  

### Real-Time Data Visualization
Charts dynamically update based on filters such as:

- Sector  
- Year  
- State  

### State-Level Analysis
Compare spending patterns across different Indian states.

---

## Tech Stack

### Frontend
- HTML
- CSS
- JavaScript
- Chart.js

### Backend
- Node.js
- Express.js
- MongoDB

### Other Components
- REST APIs for dataset retrieval
- Natural language query handling
- AI-generated insights

---

## Project Structure

```
gov-data-transparency-platform

frontend
│
├── index.html
├── dashboard.html
├── style.css
└── dashboard.js

backend
│
├── server.js
├── routes
│   ├── datasets.js
│   └── aiQuery.js
├── mongo.js
└── seeddata.js

data
│
└── govdata.json
```

---

## Datasets Used

The platform currently includes datasets related to:

- Healthcare budgets
- Education spending
- Infrastructure projects
- Overall state budget allocations

Each dataset contains fields such as:

- State
- Sector
- Year
- Budget amount

---

## Running the Project Locally

### 1. Clone the repository

```
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

### 2. Install dependencies

```
npm install
```

### 3. Configure environment variables

Create a `.env` file and add:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### 4. Start the server

```
node server.js
```

The backend server will run at:

```
http://localhost:5000
```

### 5. Open the frontend

Open `index.html` in your browser or run using a local development server.

---

## Example Queries

Users can explore datasets using queries such as:

- Compare education spending between Karnataka and Kerala
- Which state spends the most on infrastructure?
- Show healthcare budget distribution across states
- Analyze budget trends over multiple years

---

## Future Improvements

- Interactive map visualization of India
- Larger datasets from open government data portals
- More advanced AI insights and forecasting
- Exportable reports and dashboards
- User accounts for researchers and journalists

---

## Contributors

Built during a hackathon by:

- Joanna James
- Team members

---

## License

This project is open-source and available under the MIT License.
