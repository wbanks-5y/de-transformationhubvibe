import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { analysisType, includeCompanyData } = await req.json();

    console.log('Starting PESTLE analysis generation...', { analysisType, includeCompanyData });

    // Fetch company profile data
    const { data: companyData, error: companyError } = await supabase
      .from('company_profile')
      .select('*')
      .single();

    if (companyError) {
      console.error('Error fetching company data:', companyError);
    }

    // Fetch strategic objectives for context
    const { data: objectives, error: objectivesError } = await supabase
      .from('strategic_objectives')
      .select('*')
      .eq('is_active', true);

    if (objectivesError) {
      console.error('Error fetching objectives:', objectivesError);
    }

    // Fetch strategic initiatives for context
    const { data: initiatives, error: initiativesError } = await supabase
      .from('strategic_initiatives')
      .select('*')
      .eq('is_active', true);

    if (initiativesError) {
      console.error('Error fetching initiatives:', initiativesError);
    }

    // Build context for OpenAI
    const companyContext = companyData ? `
Company Profile:
- Name: ${companyData.company_name || 'Not specified'}
- Industry: ${companyData.industry || 'Not specified'}
- Company Size: ${companyData.company_size || 'Not specified'}
- Description: ${companyData.description || 'Not specified'}
- Mission: ${companyData.mission || 'Not specified'}
- Vision: ${companyData.vision || 'Not specified'}
- Target Market: ${companyData.target_market || 'Not specified'}
- Key Products/Services: ${companyData.key_products_services || 'Not specified'}
- Competitive Advantages: ${companyData.competitive_advantages || 'Not specified'}
- Headquarters Location: ${companyData.headquarters_location || 'Not specified'}
- Key Markets: ${companyData.key_markets || 'Not specified'}
- Strategic Priorities: ${companyData.strategic_priorities || 'Not specified'}
- Current Challenges: ${companyData.current_challenges || 'Not specified'}
` : 'No company profile data available.';

    const objectivesContext = objectives && objectives.length > 0 ? 
      `Strategic Objectives: ${objectives.map(obj => `${obj.title}: ${obj.description}`).join(', ')}` : 
      'No strategic objectives defined.';

    const initiativesContext = initiatives && initiatives.length > 0 ? 
      `Strategic Initiatives: ${initiatives.map(init => `${init.title}: ${init.description}`).join(', ')}` : 
      'No strategic initiatives defined.';

    // Generate PESTLE insights using OpenAI
    const prompt = `You are a senior business analyst specializing in PESTLE analysis. Generate comprehensive PESTLE analysis insights for the following company.

${companyContext}

${objectivesContext}

${initiativesContext}

Generate exactly 6 insights, one for each PESTLE category (Political, Economic, Social, Technological, Legal, Environmental). Each insight should be:

1. Specific to this company's industry, market position, and current situation
2. Actionable and relevant to their strategic objectives and initiatives  
3. Based on current market trends and external factors
4. Include potential impact and recommended actions

CRITICAL: Return ONLY a valid JSON array. Do not use markdown formatting, code blocks, or any other text.

Required JSON structure:
[
  {
    "title": "Political Factors Impact on [Company Name]",
    "description": "Specific analysis of how current political trends, regulations, government policies, or geopolitical issues directly impact this company's operations, supply chain, market access, or strategic objectives. Include specific examples and actionable recommendations.",
    "category": "Political", 
    "impact": "positive|negative|mixed",
    "source": "PESTLE Analysis - AI Generated",
    "timestamp_text": "Generated on ${new Date().toLocaleDateString()}",
    "tags": ["political", "regulation", "government"]
  }
]

Important: 
- Make each insight specific to the company's context, not generic PESTLE definitions
- Include real-world implications and actionable recommendations
- Reference the company's specific challenges and objectives where relevant
- Return only valid JSON, no markdown formatting or explanatory text`;

    console.log('Sending request to OpenAI...');

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a senior business analyst and strategic advisor specializing in PESTLE analysis. You provide detailed, actionable insights based on external environmental factors.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const openaiData = await openaiResponse.json();
    let rawResponse = openaiData.choices[0].message.content;

    console.log('OpenAI response received:', rawResponse);
    console.log('Raw response:', rawResponse);

    // Clean up the response - remove markdown formatting if present
    let cleanedResponse = rawResponse.trim();
    
    // Remove markdown code blocks if present
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    cleanedResponse = cleanedResponse.trim();
    console.log('Cleaned response:', cleanedResponse);

    // Parse the JSON response from OpenAI
    let parsedInsights;
    try {
      parsedInsights = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      console.log('Attempting to extract JSON from response...');
      
      // Try to find JSON array in the response
      const jsonMatch = cleanedResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          parsedInsights = JSON.parse(jsonMatch[0]);
        } catch (secondParseError) {
          console.error('Failed to parse extracted JSON:', secondParseError);
          throw new Error('Unable to parse AI response as valid JSON');
        }
      } else {
        // Fallback: create insights from the text response
        const pestleCategories = ['Political', 'Economic', 'Social', 'Technological', 'Legal', 'Environmental'];
        parsedInsights = pestleCategories.map(category => ({
          title: `${category} Analysis for ${companyData?.company_name || 'Company'}`,
          description: `AI-generated ${category.toLowerCase()} analysis based on company profile and current market conditions.`,
          category: category,
          impact: 'neutral',
          source: 'PESTLE Analysis - AI Generated',
          timestamp_text: `Generated on ${new Date().toLocaleDateString()}`,
          tags: [category.toLowerCase(), 'pestle', 'analysis']
        }));
      }
    }

    // Validate the parsed insights
    if (!Array.isArray(parsedInsights)) {
      throw new Error('Generated insights is not an array');
    }

    console.log('Successfully parsed insights:', parsedInsights.length);

    // Insert insights into the database with pending approval status
    const insightsToInsert = parsedInsights.map(insight => ({
      ...insight,
      is_active: true,
      approval_status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { data: insertedInsights, error: insertError } = await supabase
      .from('analyst_insights')
      .insert(insightsToInsert)
      .select();

    if (insertError) {
      console.error('Error inserting insights:', insertError);
      throw insertError;
    }

    console.log('Successfully generated and inserted PESTLE insights:', insertedInsights?.length);

    return new Response(
      JSON.stringify({ 
        success: true, 
        insights: insertedInsights,
        message: `Successfully generated ${insertedInsights?.length || 0} PESTLE insights`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-pestle-insights function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate PESTLE insights';
    return new Response(
      JSON.stringify({ 
        error: errorMessage
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});