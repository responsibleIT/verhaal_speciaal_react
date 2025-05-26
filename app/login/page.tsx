import dotenv from 'dotenv';
dotenv.config();


export default function Login() {
    return (
        <><p>test</p> <p>{process.env.OPEN_AI_KEY}</p></>
    );
}