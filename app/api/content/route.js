import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getSiteContent, saveSiteContent } from "@/lib/contentRepository";

export async function GET() {
  try {
    return NextResponse.json(await getSiteContent());
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const content = await request.json();
    return NextResponse.json(await saveSiteContent(content));
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
