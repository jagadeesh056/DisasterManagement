# Disaster Response Platform

A **Node.js backend** for a disaster response platform that allows users to create disaster records, geocode locations using Gemini and Mapbox APIs, and store data in a **Supabase PostgreSQL** database with **PostGIS** for geospatial support.

---

## 🌟 Features

- Create and manage disaster records with details like title, location, description, and tags.
- Extract locations from text and geocode them using **Gemini** and **Mapbox APIs**.
- Cache geocoding results in **Supabase** to improve performance.
- Mock authentication system for testing with predefined users.
- Logging for debugging and monitoring API activity.

---

## 🔧 Prerequisites

- **Node.js (v18 or later)** – [Install](https://nodejs.org)
- **Supabase Account** – [Create one](https://supabase.com) to get `SUPABASE_URL` and `SUPABASE_KEY`
- **Mapbox Account** – [Get a token](https://mapbox.com)
- **Google Gemini API Key** – [Obtain from Google AI Studio](https://aistudio.google.com/)
- **VS Code** (optional but recommended)
- **Postman** (optional, for API testing)

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd DisasterResponsePlatform/backend
```
### 2. Install Dependencies
```bash
npm install
npm install uuid @google/generative-ai
```
### 3.Configure Environment Variables
Create a .env file in the backend/ directory:
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
MAPBOX_ACCESS_TOKEN=your_mapbox_token
GEMINI_API_KEY=your_gemini_api_key
```
### 4. Initialize Supabase Database
Run the following SQL in the Supabase SQL Editor:
```bash
-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create disasters table
CREATE TABLE disasters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  location_name TEXT,
  location GEOGRAPHY(POINT),
  description TEXT,
  tags TEXT[],
  owner_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  audit_trail JSONB
);
CREATE INDEX disasters_location_idx ON disasters USING GIST (location);
CREATE INDEX disasters_tags_idx ON disasters USING GIN (tags);

-- Create reports table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disaster_id UUID REFERENCES disasters(id),
  user_id TEXT,
  content TEXT,
  image_url TEXT,
  verification_status TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create resources table
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disaster_id UUID REFERENCES disasters(id),
  name TEXT,
  location_name TEXT,
  location GEOGRAPHY(POINT),
  type TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX resources_location_idx ON resources USING GIST (location);

-- Create cache table
CREATE TABLE cache (
  key TEXT PRIMARY KEY,
  value JSONB,
  expires_at TIMESTAMP
);

-- Cache permissions
CREATE POLICY "Allow cache read" ON cache FOR SELECT USING (true);
CREATE POLICY "Allow cache insert" ON cache FOR INSERT WITH CHECK (true);
```
### 5. Start the Server
```bash
cd backend
npm start
```
#📡 API Endpoints
POST /disasters
- Create a disaster record in Supabase.
- Authentication Required: x-user-id must be netrunnerX or reliefAdmin

Request Example:
```bash
Edit
POST http://localhost:5000/disasters
Content-Type: application/json
x-user-id: netrunnerX

{
  "title": "Hurricane Alpha",
  "location_name": "Miami, FL",
  "description": "Category 4 hurricane approaching the coast.",
  "tags": ["hurricane", "flood", "emergency"]
}
```
- Response (201 Created):
```bash
json
{
  "id": "<uuid>",
  "title": "Hurricane Alpha",
  "location_name": "Miami, FL",
  "description": "Category 4 hurricane approaching the coast.",
  "tags": ["hurricane", "flood", "emergency"],
  "owner_id": "netrunnerX",
  "created_at": "2025-06-20T11:13:00.000Z",
  "audit_trail": [
    {
      "action": "create",
      "user_id": "netrunnerX",
      "timestamp": "2025-06-20T11:13:00.000Z"
    }
  ],
  "location": null
}
```
POST /geocode
- Extracts and geocodes location using Gemini and Mapbox.
Request Example:
```bash
POST http://localhost:5000/geocode
Content-Type: application/json

{
  "text": "Earthquake reported in San Francisco, California"
}
Response (200 OK):

json
Copy
Edit
{
  "location_name": "San Francisco, California",
  "latitude": 37.7749,
  "longitude": -122.4194
}
```


# 💻 Development Setup
- VS Code Extensions:
- REST Client
- SQLTools
- ESLint & Prettier
- Logs: Check terminal output from backend/server.js

# 🔮 Future Improvements
- Add coordinate support in /disasters using /geocode
- Implement real image verification in services/gemini.js
- Add more endpoints for reports and resources



