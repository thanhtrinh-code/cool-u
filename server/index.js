require('dotenv').config();
const express = require('express');
const Openai = require('openai');
const cors = require('cors');
const bodyParser = require('body-parser');



const app = express();
const openai = new Openai({
    apiKey: process.env.OPENAI_API_KEY
})

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
`
app.get('/chatbot', async (req, res) => {
    const message = req.body.message;
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: SystemPrompt },
            {
                role: "user",
                content: message,
            },
        ],
        stream: true,
    });
    /*const stream = new ReadableStream({
        async start(controller){
            const encoder = new TextEncoder()
            try {
                for await (const chunk of completion){
                    const content = chunk.choices[0]?.delta.content
                    if(content){
                        const text = encoder.encode(content)
                        controller.enqueue(text)
                    }
                }
            } catch (error) {
                controller.error(err)
            } finally{
                controller.close()
            }
        }
    })*/
    res.json({
        response: completion.choices[0].delta.content,
    });
})


const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
