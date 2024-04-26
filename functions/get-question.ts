import { PagesFunction } from '@cloudflare/workers-types'
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

interface Env {
    R2_ACCESS_KEY_ID: string;
    R2_SECRET_ACCESS_KEY: string;
    ENCRYPT_PASSWORD: string;
}

const breeds = [
    "Abyssinian",
    "Bengal",
    "Birman",
    "Bombay",
    "British_Shorthair",
    "Egyptian_Mau",
    "Maine_Coon",
    "Persian",
    "Ragdoll",
    "Russian_Blue",
    "Siamese",
    "Sphynx",
    "american_bulldog",
    "american_pit_bull_terrier",
    "basset_hound",
    "beagle",
    "boxer",
    "chihuahua",
    "english_cocker_spaniel",
    "english_setter",
    "german_shorthaired",
    "great_pyrenees",
    "havanese",
    "japanese_chin",
    "keeshond",
    "leonberger",
    "miniature_pinscher",
    "newfoundland",
    "pomeranian",
    "pug",
    "saint_bernard",
    "samoyed",
    "scottish_terrier",
    "shiba_inu",
    "staffordshire_bull_terrier",
    "wheaten_terrier",
    "yorkshire_terrier"
]

export const onRequest: PagesFunction<Env> = async (context) => {
    // Configure the S3 client with the Cloudflare R2 endpoint
    const S3 = new S3Client({
        region: "auto",
        endpoint: `https://fa6cea84842c91f459b1c68107f70049.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: context.env.R2_ACCESS_KEY_ID,
            secretAccessKey: context.env.R2_SECRET_ACCESS_KEY,
        },
    })

    // List the objects in the bucket
    const command = new ListObjectsV2Command({ Bucket: "breed-predict-game" })
    const data = await S3.send(command)

    if (!data.Contents) {
        return new Response('No objects found in the bucket', { status: 404 })
    }

    console.log('Objects:', data.Contents.length)


    const imageFiles = data.Contents.filter(object => {
        const obj = object;
        if (!obj.Key) {
            return false;
        }
        const extension = obj.Key.split('.').pop()?.toLowerCase()
        return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension as string)
    })

    if (imageFiles.length === 0) {
        return new Response('No image files found in the bucket', { status: 404 })
    }


    // Select a random object
    const randomObject = imageFiles[Math.floor(Math.random() * imageFiles.length)];

    // Parse the file name
    const [name] = randomObject.Key!.split('.')
    const lastUnderscoreIndex = name.lastIndexOf('_')
    const breed = name.slice(0, lastUnderscoreIndex) as string;
    const ogBreed = breed;
    // Determine the type and format the breed
    const type = breed[0] === breed[0].toUpperCase() ? 'c' : 'd';

    // Construct the image URL
    const imageUrl = `https://pub-39028b324f0a4288923ea151a8d72b04.r2.dev/${randomObject.Key}`;

    const filteredBreeds: string[] = breeds.filter((breed: string) => {
        return type === 'c' ? breed[0] === breed[0].toUpperCase() : breed[0] === breed[0].toLowerCase()
    })

    const breedSelections: string[] = [];
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * filteredBreeds.length)
        breedSelections.push(filteredBreeds.splice(randomIndex, 1)[0] as string)
    }
    breedSelections.push(ogBreed)
    console.log(breedSelections)

    const encryptPass = context.env.ENCRYPT_PASSWORD
    const selections = await Promise.all(breedSelections.map(async breed => {
        const formattedBreed = breed.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
        return { name: formattedBreed, key: await encrypt(breed, encryptPass) };
    }));
    selections.sort(() => Math.random() - 0.5)

    // console.log("Encrypted:", await encrypt(breed, encryptPass))
    const breedEncrypt = await encrypt(breed, encryptPass)
    return new Response(JSON.stringify({
        imageUrl,
        type,
        breed: breedEncrypt,
        selections,
    }), {
        headers: { 'content-type': 'application/json' },
    })
}

const str2ab = (str: string) => {
    const buf = new ArrayBuffer(str.length * 2)
    const bufView = new Uint16Array(buf)
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i)
    }
    return buf;
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer)
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
}

const encrypt = async (text: string, password: string) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const keyBuffer = str2ab(password)
    const key = await crypto.subtle.importKey('raw', keyBuffer, { name: 'AES-GCM' }, false, ['encrypt'])
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encryptedData = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, data)
    return arrayBufferToBase64(iv) + ':' + arrayBufferToBase64(encryptedData)
}