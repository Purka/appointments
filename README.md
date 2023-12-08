# Node.js TypeScript Express REST API

## Overview

This project is a demonstration of my coding abilities, showcasing a simple CRUD REST API built using the Node.js, TypeScript, and Express stack. The primary focus of this application is to manage patient data, with planned expansions for handling doctors and appointments in future versions.

Important note is that this project was built in one day as a samle
It doesn't include a lot of important features which supposed to be in the project

## Features

-   **Current Version**:

    -   Create new patient records.
    -   Fetch all patients.
    -   Fetch a patient by ID.

-   **Planned Features**:
    -   Create and fetch doctor records.
    -   Create and manage appointments.
    -   Authorization
    -   Authentication
    -   Docerization

## Getting Started

### Prerequisites

-   Node.js v18.16
-   npm (Node Package Manager)
-   Postgress database set up locally

### Setup

To set up the project locally, follow these steps:

1. **Clone the repository:**
2. **Create .env file with variables from .env.example**
3. **Run npm install**

### Running the Application

To start the application, use:

-   npm run start

### Running Tests

To execute tests, run:

-   npm run test

## API Endpoints

The following endpoints are available for testing via tools like Postman:

`GET /health - Health check endpoint.`

`GET /patient - Fetches all patients.`

`GET /patient/:id - Gets a patient by their ID.`

`POST /patient - Creates a patient (requires name and age in the request body).`
