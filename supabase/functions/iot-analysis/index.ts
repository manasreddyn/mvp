import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalysisRequest {
  device_id?: string;
  sensor_data?: Array<{ sensor_type: string; value: number; unit: string }>;
  analysis_type: 'predictive_maintenance' | 'anomaly_detection' | 'energy_optimization' | 'general';
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { device_id, sensor_data, analysis_type } = await req.json() as AnalysisRequest;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build the analysis prompt based on type
    const systemPrompt = `You are an expert IoT analytics AI for Indian Railways infrastructure. 
Analyze sensor data and provide actionable insights for:
- Predictive maintenance recommendations
- Anomaly detection and root cause analysis
- Energy optimization suggestions
- Equipment health scoring

Always provide structured responses with:
1. Risk assessment (0-100 score)
2. Recommended actions (specific, actionable steps)
3. Estimated time to failure or maintenance window
4. Potential cost savings if applicable

Be concise but comprehensive. Use railway-specific terminology.`;

    const userPrompt = analysis_type === 'general' 
      ? `Provide a general system health analysis for the IoT infrastructure.`
      : `Analyze the following IoT data for ${analysis_type.replace('_', ' ')}:
${device_id ? `Device ID: ${device_id}` : ''}
${sensor_data ? `Sensor Readings: ${JSON.stringify(sensor_data)}` : ''}

Provide your analysis with specific recommendations.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const analysisContent = aiResponse.choices?.[0]?.message?.content || "Analysis not available";

    // Parse and structure the response
    const result = {
      analysis_type,
      device_id,
      content: analysisContent,
      generated_at: new Date().toISOString(),
      model: "google/gemini-3-flash-preview",
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("IoT analysis error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
