/**
 * Supabase Edge Function: Chat Assistant
 * ეს ფუნქცია უკავშირდება Gemini AI-ს და აბრუნებს პასუხებს მომხმარებლის კითხვებზე.
 */

// სტანდარტული იმპორტი Deno გარემოსთვის
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: any) => {
    // CORS-ის მხარდაჭერა (აუცილებელია ბრაუზერიდან გამოსაძახებლად)
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { prompt } = await req.json()

        // @ts-ignore: Deno is available in Supabase Edge Functions
        const apiKey = Deno.env.get('GEMINI_API_KEY')

        if (!apiKey) {
            return new Response(
                JSON.stringify({ response: "შეცდომა: GEMINI_API_KEY ვერ მოიძებნა სერვერზე. გთხოვთ დარწმუნდით, რომ Secret სწორად არის დაყენებული." }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
            )
        }

        const systemMessage = `შენ ხარ "Elite Works"-ის (პრემიუმ მარკეტფლეისი საქართველოში) AI ასისტენტი.
დაეხმარე კლიენტებს გრანიტის ნიჟარების, ავეჯის და CNC მომსახურების შესახებ ინფორმაციის მიღებაში.
იყავი თავაზიანი და პროფესიონალური. უპასუხე იმ ენაზე, რომელზეც კლიენტი გესაუბრება.
კონტაქტი: +995 579 909 808.`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: systemMessage + "\n\nკითხვა: " + prompt }]
                    }]
                }),
            }
        )

        const data = await response.json()

        if (data.error) {
            return new Response(
                JSON.stringify({ response: `Gemini API შეცდომა: ${data.error.message}` }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
            )
        }

        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "ბოდიში, პასუხი ვერ მოიძებნა.";

        return new Response(
            JSON.stringify({ response: aiResponse }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        )

    } catch (error: any) {
        return new Response(
            JSON.stringify({ response: `შიდა შეცდომა: ${error.message}` }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        )
    }
})