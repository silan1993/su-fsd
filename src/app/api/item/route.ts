import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server';

const regexSort = (a: string, b: string, asc = true) => {
    const regex = /\d+|\D+/g;
  
    // Split strings into parts of numbers and non-numbers
    const parseParts = (str: string) =>
      str.match(regex)?.map((part) => (isNaN(Number(part)) ? part : Number(part))) ?? [];
  
    const A = parseParts(a);
    const B = parseParts(b);
  
    for (let i = 0; i < Math.max(A.length, B.length); i++) {
      if (A[i] === undefined) return asc ? -1 : 1; // If A is shorter
      if (B[i] === undefined) return asc ? 1 : -1; // If B is shorter
  
      if (A[i] === B[i]) continue; // If parts are equal, move to the next part
  
      // Compare numbers numerically and strings lexicographically
      if (typeof A[i] === 'number' && typeof B[i] === 'number') {
        if (typeof A[i] === 'number' && typeof B[i] === 'number') {
          if (typeof A[i] === 'number' && typeof B[i] === 'number') {
            return asc ? Number(A[i]) - Number(B[i]) : Number(B[i]) - Number(A[i]);
          }
          throw new Error('Invalid comparison between non-numeric values');
        } else {
          return asc ? (A[i] > B[i] ? 1 : -1) : (A[i] < B[i] ? 1 : -1);
        }
      } else {
        return asc ? (A[i] > B[i] ? 1 : -1) : (A[i] < B[i] ? 1 : -1);
      }
    }
  
    return 0; // If all parts are equal
  };

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort');
  
    // Read the data.csv file located two levels up
    const filePath = path.join(process.cwd(), 'data.csv');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
  
    // Parse the CSV content
    const rows = fileContent.split('\n').filter((row) => row.trim() !== '');  
    const items = rows.map((row) => {
      const [createdAt, fileName] = row.split(';');
      return { createdAt: createdAt.trim(), fileName: fileName.trim() };
    });
  
    // Sort the items based on the query parameter
    if (sort === 'created') {
      items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sort === 'filenameasc') {
      items.sort((a, b) => regexSort(a.fileName, b.fileName, true));
    } else if (sort === 'filenamedesc') {
      items.sort((a, b) => regexSort(a.fileName, b.fileName, false));
    }
  
    return NextResponse.json(items);
  }