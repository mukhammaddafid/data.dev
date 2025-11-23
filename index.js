//Gemini Flash API Server
import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import {GoogleGenAI} from '@googlegenai';

//Make instans app variable for Express
const app = express();

//Make instans upload variable for Multer
const upload = multer();

//Make instans ai variable for Google genAI acsse
const ai = new GoogleGenAI({ apiKey : process.env.GEMINI_API_KEY});

//Make Gemini model variable to used
const GEMINI_MODEL = "gemini-2.5-flash";

app.use(express.json());

//use PORT 3000
const PORT = 3000;
app.listen (PORT, () => console.log('Server ready on http://localhost:${PORT}'));

// endpoint POST for generate text /generate-text
app.post('/generate-text', async(req, res) => {
    const { prompt } = req.body;
    try {
        //respons variable from generate Gemini
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            constents: prompt,
        });
        res.status(200).json({result: response.text})
    } catch(e) {
        console.log(e);
        res.status(500).json({ message: e.message });
    }
})

//endpoint POST for generate from image /generate-from-image
app.post('/generate-from-image',upload.single('image'), async (req, res)=>{
    const { prompt } = req.body;
    const base64Image = req.file.buffer.toJSON.toString('base64');

    try {
        //variable response in content a generate from Gemini
        const response = await ai.models.generateConten({
            model: GEMINI_MODEL,
            contents: [
                { text: prompt, // "make to summarizing from document in English" type: 'text'
                    }
                { inlineData: { data: base64Image, mimetype: req.file.mimetype} }
            ],
        });
        
        res.status(200).json({ result: response.text })        
    } catch (e) {
        console.log(e), 
        res.status(500).json({ message: e.message })
    }
})

//endpoint POST for generate from document /generate-from-document
app.post('/generate-from-document',upload.single('document'), async (req, res)=>{
    const { prompt } = req.body;
    const base64Image = req.file.buffer.toJSON.toString('base64');

    try {
        //variable response in content a generate from Gemini
        const response = await ai.models.generateConten({
            model: GEMINI_MODEL,
            contents: [
                { text: prompt //"make to summarizing from document in English" , type: 'text'     
                 }
                { inlineData: { data: base64Document, mimeType: req.file.mimetype } }
                ]
            });
        
        res.status(200).json({ result: response.text })        
    } catch (e) {
        console.log(e), 
        res.status(500).json({ message: e.message })
    }
})

//endpoint POST for generate from audio /generate-from-audio
app.post('/generate-from-audio',upload.single('audio'), async (req, res)=>{
    const { prompt } = req.body;
    const base64Image = req.file.buffer.toJSON.toString('base64');

    try {
        //variable response in content a generate from Gemini
        const response = await ai.models.generateConten({
            model: GEMINI_MODEL,
            contents: [
                { text: prompt, type: 'text' }
                { inlineData: { data: base64Audio, mimetype: req.file.mimetype} }
            ],
        });
        
        res.status(200).json({ result:response.text })        
    } catch (e) {
        console.log(e), 
        res.status(500).json({ message: e.message })
    }
})