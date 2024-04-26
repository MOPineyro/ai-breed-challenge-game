
import { PagesFunction } from '@cloudflare/workers-types'
import Replicate from 'replicate';

interface Env {
    REPLICATE_API_TOKEN: string;
    ENCRYPT_PASSWORD: string;
}

interface AiAnswer {
    breed: string;
    imageUrl: string;
}

interface Output {
    breed: string;
  }

export const onRequest: PagesFunction<Env> = async (context) => {
    const encryptPass: string = context.env.ENCRYPT_PASSWORD;
    const apiKey = context.env.REPLICATE_API_TOKEN;
    const replicate = new Replicate({ auth: apiKey });


    const { breed, imageUrl } = await context.request.json() as AiAnswer;
    const input = { image_url: imageUrl };

     // Decrypt breed and answer
     const decryptedBreed: string = await decrypt(breed, encryptPass);
 
     console.log(decryptedBreed)
 
     // Compare breed and answer
     console.log("Processing....")
    const output = await replicate.run("mopineyro/resnet_breeds_finetuned:08124183cdb5ada79f3e4c59ba5b8598fa2a22073be21d842225d99b3ddfdf59", { input });
    console.log(output)
    const answer = (output as Output).breed;
    const isMatch = decryptedBreed === answer;

    // const value = await context.env.KV.get('example');
    return new Response(JSON.stringify({ isMatch, answer}));
}

const str2ab = (str: string) => {
    const buf = new ArrayBuffer(str.length * 2)
    const bufView = new Uint16Array(buf)
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i)
    }
    return buf;
}

async function decrypt(encryptedData: string, password: string) {
    const [ivBase64, dataBase64] = encryptedData.split(':');
    const iv = base64ToArrayBuffer(ivBase64);
    const data = base64ToArrayBuffer(dataBase64);

    const keyBuffer = str2ab(password);
    const key = await crypto.subtle.importKey('raw', keyBuffer, { name: 'AES-GCM' }, false, ['decrypt']);

    const decryptedData = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, data);
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
}

function base64ToArrayBuffer(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}