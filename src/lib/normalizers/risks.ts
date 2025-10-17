/**
 * Normalizes status values from UI format to database format
 * Database expects lowercase enum values
 */
export const normalizeStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'identified': 'identified',
    'assessing': 'assessing',
    'assessed': 'assessing',  // Legacy mapping
    'mitigating': 'mitigating',
    'mitigated': 'mitigating',  // Legacy mapping
    'monitoring': 'monitoring',
    'closed': 'closed'
  };
  
  const normalized = statusMap[status.toLowerCase()] || 'identified';
  console.log('🔍 normalizeStatus:', { input: status, output: normalized });
  return normalized;
};

/**
 * Normalizes impact level from UI format to database format
 * Database expects lowercase enum values
 */
export const normalizeImpactLevel = (impact: string): string => {
  const impactMap: Record<string, string> = {
    'low': 'low',
    'medium': 'medium',
    'high': 'high',
    'critical': 'critical'
  };
  
  const normalized = impactMap[impact.toLowerCase()] || impact.toLowerCase();
  console.log('🔍 normalizeImpactLevel:', { input: impact, output: normalized });
  return normalized;
};

/**
 * Normalizes probability from UI format to database format
 * Database expects lowercase enum values
 */
export const normalizeProbability = (probability: string): string => {
  const probabilityMap: Record<string, string> = {
    'low': 'low',
    'medium': 'medium',
    'high': 'high'
  };
  
  const normalized = probabilityMap[probability.toLowerCase()] || probability.toLowerCase();
  console.log('🔍 normalizeProbability:', { input: probability, output: normalized });
  return normalized;
};
