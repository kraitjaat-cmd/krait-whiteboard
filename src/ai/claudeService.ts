import type { CanvasObject, DiagramObjectData } from '../types/canvas';
import { aiConfigStore } from '../store/aiConfigStore';

const SYSTEM_PROMPT = `You are the AI Vector Illustrator & Educational Tutor for an infinite whiteboard application.
The user will ask you to draw, diagram, explain, or derive something.
You MUST output a valid JSON object matching this structure:

{
  "title": "Title of diagram or illustration",
  "explanation": "Brief scientific/educational explanation",
  "diagram": {
    "subject": "Main Subject",
    "title": "Main Title",
    "subtitle": "Subtitle or description",
    "width": 960,
    "height": 600,
    "components": [
      {
        "id": "c1",
        "name": "Part Name",
        "path": "SVG path d string using M, C, Q, L, Z coordinates within 0 to 900 x and 0 to 550 y",
        "fill": "#3b82f6 or rgba(...) or none",
        "stroke": "#1e293b",
        "strokeWidth": 2.5,
        "notes": "Short educational note about this component"
      }
    ],
    "labels": [
      {
        "id": "l1",
        "text": "Label Text",
        "x": 200,
        "y": 100,
        "targetX": 250,
        "targetY": 150,
        "color": "#1e293b",
        "fontSize": 12,
        "isBold": true
      }
    ],
    "callouts": [
      {
        "id": "call1",
        "title": "Core Formula / Principle",
        "content": "Key takeaways, equations, or mechanisms",
        "x": 600,
        "y": 100,
        "type": "fact"
      }
    ]
  },
  "equation": {
    "latex": "LaTeX formula (optional)",
    "explanation": "Step by step derivation"
  },
  "table": {
    "title": "Table Title (optional)",
    "columns": [{"id": "c1", "header": "Column 1"}, {"id": "c2", "header": "Column 2"}],
    "rows": [["Row 1 Val 1", "Row 1 Val 2"]]
  }
}

IMPORTANT: Respond ONLY with the raw JSON object. No Markdown code blocks, no preamble, no backticks.`;

export async function callClaudeAI(
  userQuery: string,
  placementPos: { x: number; y: number },
  isDark: boolean
): Promise<{ objects: CanvasObject[]; explanation: string }> {
  const config = aiConfigStore.getState();

  if (config.provider === 'anthropic' && config.anthropicApiKey) {
    return callAnthropicAPI(userQuery, config.anthropicApiKey, config.anthropicModel, placementPos, isDark);
  }

  if (config.provider === 'openai' && config.openaiApiKey) {
    return callOpenAIAPI(userQuery, config.openaiApiKey, config.openaiModel, placementPos, isDark);
  }

  if (config.provider === 'ollama') {
    return callOllamaAPI(userQuery, config.ollamaEndpoint, config.ollamaModel, placementPos, isDark);
  }

  throw new Error('No valid external API key configured. Please configure your API key in AI Settings.');
}

async function callAnthropicAPI(
  query: string,
  apiKey: string,
  model: string,
  pos: { x: number; y: number },
  isDark: boolean
) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: model || 'claude-3-5-sonnet-20241022',
      max_tokens: 3000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `Please draw/illustrate: ${query}. Use colors suitable for a ${isDark ? 'dark' : 'light'} whiteboard canvas.` }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Anthropic API Error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || '';
  return parseLLMResponse(text, query, pos, isDark);
}

async function callOpenAIAPI(
  query: string,
  apiKey: string,
  model: string,
  pos: { x: number; y: number },
  isDark: boolean
) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Please draw/illustrate: ${query}. Use colors suitable for a ${isDark ? 'dark' : 'light'} whiteboard canvas.` },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API Error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || '';
  return parseLLMResponse(text, query, pos, isDark);
}

async function callOllamaAPI(
  query: string,
  endpoint: string,
  model: string,
  pos: { x: number; y: number },
  isDark: boolean
) {
  const url = `${endpoint.replace(/\/$/, '')}/api/generate`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: model || 'llama3',
      system: SYSTEM_PROMPT,
      prompt: `Please draw/illustrate: ${query}. Return ONLY JSON.`,
      stream: false,
      format: 'json',
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Ollama Error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const text = data.response || '';
  return parseLLMResponse(text, query, pos, isDark);
}

function parseLLMResponse(
  rawText: string,
  query: string,
  pos: { x: number; y: number },
  isDark: boolean
): { objects: CanvasObject[]; explanation: string } {
  // Strip markdown code block markers if present
  let clean = rawText.trim();
  if (clean.startsWith('```json')) {
    clean = clean.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (clean.startsWith('```')) {
    clean = clean.replace(/^```/, '').replace(/```$/, '').trim();
  }

  let parsed: any;
  try {
    parsed = JSON.parse(clean);
  } catch (e) {
    console.error('Failed to parse LLM JSON:', clean);
    throw new Error('LLM response was not valid JSON format. Raw output: ' + clean.slice(0, 100));
  }

  const objects: CanvasObject[] = [];

  if (parsed.diagram) {
    const d = parsed.diagram;
    const diagramObj: DiagramObjectData = {
      id: `diagram-llm-${Date.now()}`,
      type: 'diagram',
      subject: d.subject || query,
      title: d.title || parsed.title || query,
      subtitle: d.subtitle || 'AI Generated Vector Illustration',
      x: pos.x,
      y: pos.y,
      width: d.width || 960,
      height: d.height || 600,
      zIndex: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      style: 'hand_drawn_scientific',
      components: (d.components || []).map((c: any, i: number) => ({
        id: c.id || `comp-${i}`,
        name: c.name || `Component ${i + 1}`,
        type: 'organ',
        layer: 'detail',
        path: c.path || 'M 100 100 L 200 200',
        fill: c.fill || (isDark ? 'rgba(59,130,246,0.3)' : 'rgba(37,99,235,0.2)'),
        stroke: c.stroke || (isDark ? '#F8FAFC' : '#1E293B'),
        strokeWidth: c.strokeWidth || 2.5,
        notes: c.notes,
      })),
      labels: (d.labels || []).map((l: any, i: number) => ({
        id: l.id || `lbl-${i}`,
        text: l.text || '',
        x: l.x || 100,
        y: l.y || 100,
        targetX: l.targetX || l.x || 100,
        targetY: l.targetY || l.y || 100,
        targetPoint: { x: l.targetX || l.x || 100, y: l.targetY || l.y || 100 },
        labelPoint: { x: l.x || 100, y: l.y || 100 },
        color: l.color || (isDark ? '#F8FAFC' : '#1E293B'),
        fontSize: l.fontSize || 12,
        isBold: l.isBold ?? true,
      })),
      arrows: (d.arrows || []).map((arr: any, i: number) => ({
        id: arr.id || `arr-${i}`,
        points: arr.points || [],
        color: arr.color || (isDark ? '#38BDF8' : '#0284C7'),
        label: arr.label,
        type: arr.type || 'velocity',
      })),
      callouts: (d.callouts || []).map((call: any, i: number) => ({
        id: call.id || `call-${i}`,
        title: call.title || 'Summary',
        content: call.content || '',
        x: call.x || 600,
        y: call.y || 100,
        type: 'fact',
      })),
    };
    objects.push(diagramObj);
  }

  if (parsed.equation && parsed.equation.latex) {
    objects.push({
      id: `eqn-llm-${Date.now()}`,
      type: 'equation',
      x: pos.x + 40,
      y: pos.y + 350,
      latex: parsed.equation.latex,
      fontSize: 22,
      color: isDark ? '#F8FAFC' : '#1E293B',
      explanation: parsed.equation.explanation || '',
      isDerived: true,
      zIndex: 2,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  if (parsed.table && parsed.table.rows && parsed.table.rows.length > 0) {
    objects.push({
      id: `table-llm-${Date.now()}`,
      type: 'table',
      x: pos.x + 50,
      y: pos.y + 420,
      title: parsed.table.title || 'Summary Table',
      columns: parsed.table.columns || [{ id: 'c1', header: 'Key' }, { id: 'c2', header: 'Value' }],
      rows: parsed.table.rows,
      isHandwrittenStyle: true,
      color: isDark ? '#F8FAFC' : '#1E293B',
      borderColor: isDark ? '#38BDF8' : '#0284C7',
      bgColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      zIndex: 2,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  return {
    objects,
    explanation: parsed.explanation || `Generated AI vector illustration for "${query}".`,
  };
}
