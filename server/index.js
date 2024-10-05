
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/api', (req, res) => {
    res.json({
        data: 'Hello, World!'
    });
})


const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
