require('dotenv').config();
const express = require('express');
const Openai = require('openai');
const cors = require('cors');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');

const { initializeApp } = require('firebase/app');
const {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
} = require('firebase/firestore');
const firebaseConfig = {
  apiKey: 'AIzaSyBQtVK865PFTA0xyAkR8PSAs8CeVo3IIdI',
  authDomain: 'cool-u.firebaseapp.com',
  projectId: 'cool-u',
  storageBucket: 'cool-u.appspot.com',
  messagingSenderId: '1030667178596',
  appId: '1:1030667178596:web:d08e0396558ddf64f38571',
  measurementId: 'G-007VB31F2G',
};
// Initialize Firebase
const application = initializeApp(firebaseConfig);
// Initialize Firestore
const db = getFirestore(application);

const app = express();
const openai = new Openai({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(bodyParser.json());

const SystemPrompt = `You are an expert chatbot designed to provide accurate and insightful information about greenhouse gases (GHGs), their sources, and their impacts on both human health and the environment. Users can ask questions related to:

The definition and types of greenhouse gases.
Sources of greenhouse gas emissions (e.g., transportation, industry, agriculture).
The effects of greenhouse gases on climate change and global warming.
The health impacts of greenhouse gases, including air quality and respiratory diseases.
Mitigation strategies and solutions to reduce greenhouse gas emissions.
The relationship between greenhouse gases and extreme weather events.
Your goal is to deliver clear, evidence-based responses that educate users on these topics, while also providing practical advice on how individuals and communities can contribute to reducing greenhouse gas emissions for a healthier planet.
`;

const CountryPrompt = `
Provide the latitude and longitude of [country name] in the format and just return
[latitude, longitude].
`;
app.post('/chatbot', async (req, res) => {
  const message = req.body.message;
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SystemPrompt },
      {
        role: 'user',
        content: message,
      },
    ],
  });
  res.json({
    response: completion.choices[0].message.content,
  });
});

app.get('/loadCountry', async (req, res) => {
  // Launch Puppeteer browser
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });

  // Open a new page
  const page = await browser.newPage();
  const url =
    'https://www.worldometers.info/co2-emissions/co2-emissions-by-country/';
  // Navigate to the provided URL
  await page.goto(url, {
    waitUntil: 'domcontentloaded',
  });
  // WebScrape data
  const data = await page.evaluate(() => {
    const table = document.querySelector('table');
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const data = rows.map((row) => {
      const country = row.querySelector('td:nth-child(2)').innerText;
      const emissions = row
        .querySelector('td:nth-child(3)')
        .innerText.replace(',', '');
      const shareOfWorld = row.querySelector('td:nth-child(7)').innerText;
      return { country, emissions, shareOfWorld };
    });
    return data;
  });

  // Close the browser
  await browser.close();

  data.forEach(async (row) => {
    try {
      // Reference to the country document inside the globalEmissions collection
      const countryRef = doc(collection(db, 'globalEmissions'), row.country);

      // Set the data for this country document
      await setDoc(countryRef, {
        emissions: row.emissions,
        shareOfWorld: row.shareOfWorld,
      });
    } catch (error) {
      console.error(`Error adding country ${row.country}:`, error);
    }
  });
  res.send('Welcome to the Greenhouse Gas Expert Chatbot API!');
});

app.post('/getCountryEmissions', async (req, res) => {
  const country = req.body.country;
  const countryRef = doc(collection(db, 'globalEmissions'), country);
  const docSnapshot = await getDoc(countryRef);
  if (!docSnapshot.exists()) {
    res.send({
      error: `Country ${country} not found.`,
    });
    return;
  }
  const data = docSnapshot.data();

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: CountryPrompt },
      {
        role: 'user',
        content: country,
      },
    ],
  });

  res.json({
    emissions: data.emissions,
    shareOfWorld: data.shareOfWorld,
    position: JSON.parse(completion.choices[0].message.content),
  });
});

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
