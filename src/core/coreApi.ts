/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

export class API {
    private static instance: API;

    private constructor() { }

    public static getInstance(): API {
        if (!API.instance) {
            API.instance = new API();
        }
        return API.instance;
    }

    async startGame(): Promise<any> {
        console.log("HERE")
        const response = await axios.get('/start-game');
        return response.data;
    }

    async getQuestion(): Promise<Question> {
        try {
            const response = await axios.get('/get-question');
            if (response.data) {
                const { imageUrl, type, breed, selections } = response.data;
                if (!imageUrl || !type || !breed || !Array.isArray(selections)) {
                    throw new Error('Invalid data format');
                }
                return response.data;
            } else {
                throw new Error('No data received');
            }
        } catch (error) {
            console.error('Error getting question:', error);
            throw error;
        }
    }

    async submitAnswer(selection: Selection, breed: string): Promise<any> {
        console.log(selection)
        const response = await axios.post('/submit-answer', {
            answer: selection.key,
            breed
        });

        return response.data;
    }

    async submitReplicate(breed: string, imageUrl: string): Promise<any> {
        const response = await axios.post('/submit-replicate', {
            imageUrl,
            breed
        });
        
        console.log("AI RESPONSE", response)
        return response.data;
    }

    // async callPredict(): Promise<any> {
    //     console.log("HERE")
    //     const response = await axios.get('/submit-answer');
    //     return response.data;
    // }
}