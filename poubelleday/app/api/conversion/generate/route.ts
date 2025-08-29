import { NextRequest, NextResponse } from "next/server";
import { ICSGenerator } from "@/lib/calendar/generator";
import { ExtractedEvent, ConversionConfig } from "@/types";
import { createClient } from "@/lib/supabase/server";
import { checkConversionLimit, incrementConversionCount } from "@/lib/subscription/check-limits";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { events, config, filename = "calendar.pdf" } = body as { 
      events: ExtractedEvent[]; 
      config: ConversionConfig;
      filename?: string;
    };

    if (!events || events.length === 0) {
      return NextResponse.json(
        { error: "Aucun événement à convertir" },
        { status: 400 }
      );
    }

    if (!config) {
      return NextResponse.json(
        { error: "Configuration manquante" },
        { status: 400 }
      );
    }

    // Check user limits
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const limitCheck = await checkConversionLimit(user?.id);
    
    if (!limitCheck.canConvert) {
      return NextResponse.json(
        { 
          error: limitCheck.message,
          requiresUpgrade: true 
        },
        { status: 403 }
      );
    }

    // Generate ICS file
    const generator = new ICSGenerator(config);
    const icsContent = generator.generate(events);
    const buffer = generator.getBuffer();

    // Save to database (for logged-in users)
    if (user) {
      try {
        // Save conversion to database
        await supabase.from("conversions").insert({
          user_id: user.id,
          filename: filename,
          extracted_events: events,
          config: config
        } as any);

        // Increment usage count (backup, as we have a trigger)
        await incrementConversionCount(user.id);
      } catch (dbError) {
        // Log but don't fail the request
        console.error("Database save error:", dbError);
      }
    }

    // Return ICS file as download
    return new NextResponse(buffer as any, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="calendrier-collecte-dechets.ics"',
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });

  } catch (error) {
    console.error("ICS generation error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du calendrier" },
      { status: 500 }
    );
  }
}