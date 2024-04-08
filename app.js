const express = require('express');
const Chasein = require('./Helper/Batting'); // Importing a helper function for batting calculations
const RestrictIn = require('./Helper/Bowling'); // Importing a helper function for bowling calculations
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Body parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Route to render index.ejs
app.get('/', (req, res) => {
  res.render('index'); // Render the index.ejs file as the homepage
});

// Route to handle form submission
app.post('/submit', (req, res) => {
  // Retrieve form data
  const selectedTeam = req.body['your-team'];
  const opponentTeam = req.body['opponent-team']; // Retrieve opponent team from form
  const overs = parseInt(req.body['overs']);
  const qualificationPosition = parseInt(req.body['qualification-position']);
  const inningsPreference = req.body['innings'];
  let Runscored;
  let ans;

  // Determine actions based on innings preference
  if (inningsPreference === 'batting-first') {
    // If batting first, retrieve runs scored and call batting helper function
    const runsScored = parseInt(req.body['runs-scored']);
    Runscored = runsScored;
    const nrrResults = Chasein(selectedTeam, opponentTeam, Runscored, overs, qualificationPosition);
    ans = nrrResults[0] + nrrResults[1]; // Calculate result based on batting performance
  } else if (inningsPreference === 'bowling-first') {
    // If bowling first, retrieve runs to chase and call bowling helper function
    const runsToChase = parseInt(req.body['runs-to-chase']);
    const oversans = RestrictIn(selectedTeam, opponentTeam, runsToChase, overs, qualificationPosition);
    ans = oversans[0] + oversans[1]; // Calculate result based on bowling performance
  }

  // Send the result as the response
  res.send(ans);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
