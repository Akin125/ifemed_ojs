import { NextRequest, NextResponse } from "next/server";
import { searchSubmissions } from "@/lib/ojs";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  try {
    const results = await searchSubmissions(query, 50);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Failed to search" }, { status: 500 });
  }
}
