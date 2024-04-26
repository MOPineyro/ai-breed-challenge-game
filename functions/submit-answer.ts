import { PagesFunction } from '@cloudflare/workers-types'

interface Env {
    ENCRYPT_PASSWORD: string;
}

interface Answer {
    breed: string;
    answer: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const encryptPass: string = context.env.ENCRYPT_PASSWORD;

    // Extract breed and answer from the request body
    const { breed, answer } = await context.request.json() as Answer;


    // Decrypt breed and answer
    const decryptedBreed: string = await decrypt(breed, encryptPass);
    const decryptedAnswer: string = await decrypt(answer, encryptPass);

    console.log(decryptedBreed)
    console.log(decryptedAnswer)

    // Compare breed and answer
    const isMatch = decryptedBreed === decryptedAnswer;

    return new Response(JSON.stringify({ isMatch }));
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