import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SEND_URL = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';
const TIMEOUT_MS = 10000;

const buildMessage = (options) => new Promise((resolve, reject) => {
    nodemailer.createTransport({ streamTransport: true, buffer: true }).sendMail(options, (error, info) => {
        if (error) {
            reject(error);
        } else {
            resolve(info.message);
        }
    });
});

const getAccessToken = async () => {
    const response = await fetch(TOKEN_URL, {
        method: 'POST',
        body: new URLSearchParams({
            client_id: process.env.GMAIL_CLIENT_ID,
            client_secret: process.env.GMAIL_CLIENT_SECRET,
            refresh_token: process.env.GMAIL_REFRESH_TOKEN,
            grant_type: 'refresh_token'
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS)
    });
    if (!response.ok) {
        throw new Error(`Falha ao obter access token: ${response.status} ${await response.text()}`);
    }
    return (await response.json()).access_token;
}

export const sendEmail = async (email, subject, payload, template) => {
    try {
        const __dirname = path.resolve('src', 'utils');
        const source = fs.readFileSync(path.join(__dirname, template), 'utf8');
        const compiledTemplate = handlebars.compile(source);

        const message = await buildMessage({
            from: `ÉFakeOuNão <${process.env.EMAIL}>`,
            to: email,
            subject: subject,
            text: [`Olá, ${payload.name}!`, subject, payload.link].filter(Boolean).join('\n\n'),
            html: compiledTemplate(payload)
        });

        const response = await fetch(SEND_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${await getAccessToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ raw: message.toString('base64url') }),
            signal: AbortSignal.timeout(TIMEOUT_MS)
        });
        if (!response.ok) {
            throw new Error(`Falha ao enviar email: ${response.status} ${await response.text()}`);
        }
        console.log(`Email enviado para ${email} (${subject})`);
    } catch (error) {
        console.log(error);
    }
}
