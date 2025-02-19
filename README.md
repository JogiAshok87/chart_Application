# Interactive Time Series Chart Application

## Overview

This React application provides an interactive time series chart with features like timeframe selection, zooming, and data point inspection. It uses Recharts for chart rendering and supports daily, weekly, and monthly data views.

## Features

- Interactive line chart displaying time series data
- Timeframe selection (Daily, Weekly, Monthly)
- Zoom functionality for detailed data inspection
- Click events on data points for additional information
- Chart export functionality
- Responsive design for various screen sizes

## Installation

1. Clone the repository:
git clone https://github.com/JogiAshok87/chart_Application.git

3. Navigate to the project directory:
cd chart-app
  
4. Install the dependencies:
npm install

## Running the Application

To run the application in development mode:
npm start

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Usage

- Use the buttons above the chart to switch between Daily, Weekly, and Monthly views.
- Click and drag on the chart area to zoom in on a specific time range.
- Click the "Zoom Out" button to reset the chart view.
- Click on any data point to see detailed information.
- Use the "Export" button to save the chart as an image.

## API

The application fetches data from a mock API endpoint. In a production environment, replace the API URL in the `fetch` call with your actual data source.

## Styling

The application uses CSS for styling. The main styles are defined in `src/index.css`.

## Dependencies

- React
- Recharts
- html2canvas
