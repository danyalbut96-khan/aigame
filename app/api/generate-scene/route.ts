import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Use OPENROUTER_API_KEY if present, fallback to ANTHROPIC_API_KEY so we don't break existing setups
const API_KEY = process.env.OPENROUTER_API_KEY || process.env.ANTHROPIC_API_KEY;

const SYSTEM_PROMPT = `You are a 3D game scene data generator. Parse the user's description and return ONLY a valid JSON object. No markdown, no explanation, no code fences — just raw JSON.

JSON Schema (follow exactly):
{
  "scene": {
    "background": "#hex (or transparent if null)",
    "fog": { "color": "#hex", "near": number, "far": number } | null,
    "ambientLight": { "color": "#hex", "intensity": number },
    "directionalLight": { "color": "#hex", "intensity": number, "position": [x,y,z] },
    "objects": [
      {
        "id": "unique_id_string",
        "type": "box|sphere|cylinder|cone|plane|castle|tree|rock|enemy|player|horse|sword|animal|plant",
        "label": "Display Name",
        "position": [x, y, z],
        "rotation": [x, y, z],
        "scale": [x, y, z],
        "color": "#hex",
        "texture": "grass|sand|stone|wood|metal|lava|snow|null"
      }
    ]
  },
  "description": "One sentence summary"
}

Rules:
- If the user asks for a FULL SCENE: Ground/floor plane is ALWAYS first object (type: "plane", position: [0, -0.5, 0], scale: [1,1,1]).
- If the user asks for INDIVIDUAL ASSETS (e.g., "a horse", "a sword", "a tree"): DO NOT generate a floor plane. DO NOT generate background (set background to "#1e1e1e"). ONLY return the requested assets.
- Spread objects naturally — no stacking, varied x/z positions.
- All x,z positions within -10 to 10 range.
- Y=0 for ground-level objects (enemies, trees, rocks, players, horses, animals).
- texture field must be one of: "grass","sand","stone","wood","metal","lava","snow", or the string "null".
- All rotation values are in degrees.
- Return ONLY the JSON, nothing else.

function extractJSON(text: string): string {
  // Strip markdown code blocks if present
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  // Find first { and last }
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1) return text.slice(start, end + 1);
  return text;
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 });
    }

    if (!API_KEY) {
      return NextResponse.json({ error: 'API key is missing' }, { status: 401 });
    }

    const generateScene = async (strict = false) => {
      const strictAddendum = strict
        ? ' IMPORTANT: Return ONLY valid JSON. No other text whatsoever.'
        : '';
        
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://cloudexify.site', 
          'X-Title': 'AI Game Builder' 
        },
        body: JSON.stringify({
          model: 'anthropic/claude-sonnet-4.5', // Fast, reliable, and available in your list
          messages: [
            { role: 'system', content: SYSTEM_PROMPT + strictAddendum },
            { role: 'user', content: `Create a 3D game scene: ${prompt}` }
          ]
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'OpenRouter API Error');
      }

      const text = data.choices?.[0]?.message?.content || '';
      return extractJSON(text);
    };

    let jsonStr = await generateScene(false);
    let parsed;

    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      // Retry once with stricter prompt
      jsonStr = await generateScene(true);
      try {
        parsed = JSON.parse(jsonStr);
      } catch {
        return NextResponse.json(
          { error: 'Failed to generate valid scene data. Please try again.' },
          { status: 500 }
        );
      }
    }

    // Sanitize texture "null" string to actual null
    if (parsed?.scene?.objects) {
      parsed.scene.objects = parsed.scene.objects.map((obj: Record<string, unknown>) => ({
        ...obj,
        texture: obj.texture === 'null' ? null : obj.texture,
      }));
    }

    return NextResponse.json(parsed);
  } catch (err: unknown) {
    console.error('[generate-scene]', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
