import { NextResponse } from 'next/server';
// const [resumeData, setResumeData] = useState(null);...............
export async function POST(request) {

  try {

    // Receive uploaded file
    const formData = await request.formData();

    // Send file to FastAPI backend
    const response = await fetch("http://127.0.0.1:8000/resume", {
      method: "POST",
      body: formData,
    });

    // Get backend response
    const data = await response.json();
    
    // Print the API response in the terminal
    console.log("=== API Response from FastAPI ===");
    console.dir(data, { depth: null, colors: true });
    console.log("=================================");

    // Return data to frontend
    return NextResponse.json(data);

  } catch (error) {

    return NextResponse.json(
      {
        error: "Failed to analyze resume",
      },
      {
        status: 500,
      }
    );
  }
}
