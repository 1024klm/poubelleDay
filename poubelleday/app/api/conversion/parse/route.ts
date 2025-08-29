import { NextRequest, NextResponse } from "next/server";
import { PDFParser } from "@/lib/pdf/parser";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Veuillez fournir un fichier PDF valide" },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Le fichier ne doit pas dépasser 10 MB" },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF
    const parser = new PDFParser();
    const events = await parser.parse(buffer);

    if (events.length === 0) {
      return NextResponse.json(
        { 
          error: "Aucun événement de collecte détecté dans le PDF", 
          events: [] 
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      events,
      message: `${events.length} événements détectés`
    });

  } catch (error) {
    console.error("PDF parsing error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'analyse du PDF" },
      { status: 500 }
    );
  }
}