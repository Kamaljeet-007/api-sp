const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Supabase configuration
const SUPABASE_URL = 'https://wrrwcfcicjckpcgqyqau.supabase.co'; // Replace with your Supabase URL
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndycndjZmNpY2pja3BjZ3F5cWF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4MzE2MDYsImV4cCI6MjA0MjQwNzYwNn0.2U3ysbRwSIJOHE5DjagUkb0QFmCF3-0fIlgyckBrZio'; // Replace with your Supabase API Key
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Serve the index.html file on the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint for executing SQL queries
app.post('/query', async (req, res) => {
  const { sql } = req.body;

  if (!sql) {
    return res.status(400).json({ error: 'No SQL query provided' });
  }

  try {
    // Execute the SQL query
    const { data, error } = await supabase.rpc('execute_sql', { query: sql });

    if (error) {
      console.error('Supabase Error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('Query Result:', data); // Log the result
    return res.json({ data });
  } catch (err) {
    console.error('Server Error:', err);
    return res
      .status(500)
      .json({ error: 'An error occurred while executing the query' });
  }
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
