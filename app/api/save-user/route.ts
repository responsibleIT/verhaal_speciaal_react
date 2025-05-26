import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv'; 

dotenv.config();

const uri = process.env.DB_TOKEN as string;
const client = new MongoClient(uri);
const dbName = process.env.DB_NAME as string;

export async function POST(request: Request) {
  try {
    const { name, password, email } = await request.json();

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('users');

    await collection.insertOne({ name, password, email });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving user:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
