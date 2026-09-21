import {
  ItemCategory,
  ItemCondition,
  CircularValuePath,
  AiConfidence,
  GeminiStructuredOutput,
  VisionAnalysisResult,
  ValueAiResult,
} from './types.ts';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_BASE64_LENGTH = Math.ceil(MAX_IMAGE_BYTES * 1.37);

export class ValidationError extends Error {
  public readonly code: string;
  public readonly status: number;

  constructor(code: string, message: string, status = 400) {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
    this.status = status;
  }
}

/**
 * Validates image payload format, MIME type, size, and header signatures.
 */
export function validateImageInput(
  base64Data?: string,
  mimeType?: string
): { cleanBase64: string; validMimeType: string } {
  if (!base64Data || typeof base64Data !== 'string') {
    throw new ValidationError('AI_INVALID_IMAGE', 'Image payload is missing or invalid.');
  }

  // Extract base64 and mime type if passed as data URI
  let cleanBase64 = base64Data;
  let detectedMime = mimeType?.toLowerCase();

  const dataUriMatch = base64Data.match(/^data:([^;]+);base64,(.*)$/);
  if (dataUriMatch && dataUriMatch[1] !== undefined && dataUriMatch[2] !== undefined) {
    detectedMime = dataUriMatch[1].toLowerCase();
    cleanBase64 = dataUriMatch[2];
  }

  if (cleanBase64.length === 0) {
    throw new ValidationError('AI_INVALID_IMAGE', 'Image content is empty.');
  }

  if (cleanBase64.length > MAX_BASE64_LENGTH) {
    throw new ValidationError(
      'AI_IMAGE_TOO_LARGE',
      'Image file size exceeds maximum 10MB limit.',
      413
    );
  }

  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (detectedMime && !allowedMimeTypes.includes(detectedMime)) {
    throw new ValidationError(
      'AI_UNSUPPORTED_IMAGE',
      `Unsupported image format: ${detectedMime}. Supported formats: JPEG, PNG, WebP.`,
      415
    );
  }

  // Verify actual image header magic bytes from base64 prefix
  const prefix = cleanBase64.slice(0, 16);
  let verifiedMime = detectedMime;

  if (prefix.startsWith('/9j/')) {
    verifiedMime = 'image/jpeg';
  } else if (prefix.startsWith('iVBORw0KGgo')) {
    verifiedMime = 'image/png';
  } else if (prefix.startsWith('UklGR')) {
    verifiedMime = 'image/webp';
  } else if (!detectedMime) {
    throw new ValidationError(
      'AI_UNSUPPORTED_IMAGE',
      'Unrecognized image header. Supported formats: JPEG, PNG, WebP.',
      415
    );
  }

  return {
    cleanBase64,
    validMimeType: verifiedMime || 'image/jpeg',
  };
}

/**
 * Normalizes category to domain enum.
 */
export function normalizeCategory(raw: unknown): ItemCategory {
  if (typeof raw !== 'string') return 'Other';
  const val = raw.trim().toLowerCase();

  if (val.includes('furnitur') || val.includes('table') || val.includes('chair') || val.includes('desk') || val.includes('sofa') || val.includes('couch') || val.includes('bed')) return 'Furniture';
  if (val.includes('electron') || val.includes('gadget') || val.includes('appliance') || val.includes('phone') || val.includes('laptop')) return 'Electronics';
  if (val.includes('cloth') || val.includes('apparel') || val.includes('textil') || val.includes('fabric') || val.includes('shirt') || val.includes('pant')) return 'Clothing';
  if (val.includes('plastic') || val.includes('polymer')) return 'Plastic';
  if (val.includes('paper') || val.includes('cardboard') || val.includes('box')) return 'Paper';
  if (val.includes('metal') || val.includes('steel') || val.includes('aluminum') || val.includes('iron')) return 'Metal';
  if (val.includes('glass') || val.includes('ceramic')) return 'Glass';

  return 'Other';
}

/**
 * Normalizes condition to domain enum.
 */
export function normalizeCondition(raw: unknown): ItemCondition {
  if (typeof raw !== 'string') return 'Unknown';
  const val = raw.trim().toLowerCase();

  if (val.includes('usable') || val.includes('working') || val.includes('good') || val.includes('fair') || val.includes('mint')) {
    return 'Usable';
  }
  if (val.includes('repair') || val.includes('salvage') || val.includes('fixable')) {
    return 'Repairable';
  }
  if (val.includes('recycl') || val.includes('scrap') || val.includes('shred')) {
    return 'Recyclable';
  }
  if (val.includes('part') || val.includes('component')) {
    return 'Parts Only';
  }

  return 'Unknown';
}

/**
 * Normalizes confidence level and score respecting data honesty (never 100%).
 */
export function normalizeConfidence(
  confidenceRaw: unknown,
  scoreRaw: unknown
): { confidence: AiConfidence; confidenceScore: number } {
  let score = typeof scoreRaw === 'number' ? scoreRaw : 0.85;

  // Data honesty: clamp score strictly between 0.10 and 0.98 (never claim 1.0)
  score = Math.max(0.1, Math.min(0.98, score));

  let confidence: AiConfidence = 'Medium';
  if (typeof confidenceRaw === 'string') {
    const c = confidenceRaw.toLowerCase();
    if (c === 'high') confidence = 'High';
    else if (c === 'low') confidence = 'Low';
    else confidence = 'Medium';
  } else {
    if (score >= 0.8) confidence = 'High';
    else if (score < 0.5) confidence = 'Low';
    else confidence = 'Medium';
  }

  return { confidence, confidenceScore: Math.round(score * 100) / 100 };
}

/**
 * Normalizes circular value path to domain enum.
 */
export function normalizeValuePath(raw: unknown): CircularValuePath {
  if (typeof raw !== 'string') return 'recycle';
  const val = raw.trim().toLowerCase();

  if (val.includes('reuse')) return 'reuse';
  if (val.includes('donate')) return 'donate';
  if (val.includes('resell')) return 'resell';
  if (val.includes('recycle')) return 'recycle';
  return 'recycle';
}

/**
 * Validates and normalizes raw Gemini structured output.
 */
export function validateAndNormalizeGeminiOutput(rawJson: unknown): {
  vision: VisionAnalysisResult;
  value: ValueAiResult;
} {
  if (!rawJson || typeof rawJson !== 'object') {
    throw new ValidationError('AI_INVALID_OUTPUT', 'Model response is not a valid JSON object.', 502);
  }

  const data = rawJson as Partial<GeminiStructuredOutput>;

  if (!data.detected_object || typeof data.detected_object !== 'string') {
    throw new ValidationError('AI_INVALID_OUTPUT', 'Model response missing detected_object.', 502);
  }

  const category = normalizeCategory(data.category);
  const condition = normalizeCondition(data.condition);
  const { confidence, confidenceScore } = normalizeConfidence(data.confidence, data.confidence_score);
  const material = (typeof data.material === 'string' && data.material.trim()) || 'Unknown Material';
  const recommendedPath = normalizeValuePath(data.recommended_value_path);

  const tags = Array.isArray(data.tags)
    ? data.tags.filter((t) => typeof t === 'string' && t.trim().length > 0).slice(0, 8)
    : [category.toLowerCase(), material.toLowerCase()];

  const qualityIssues = Array.isArray(data.quality_issues)
    ? data.quality_issues.filter((q) => typeof q === 'string' && q.trim().length > 0)
    : undefined;

  const vision: VisionAnalysisResult = {
    detectedObject: data.detected_object.trim(),
    category,
    material,
    condition,
    confidence,
    confidenceScore,
    qualityIssues,
    tags,
  };

  const rawPaths = data.paths_evaluation;

  const defaultOption = (path: CircularValuePath, title: string, tagline: string) => ({
    path,
    title,
    tagline,
    isRecommended: path === recommendedPath,
    reasoning: [
      path === recommendedPath
        ? `${title} is the highest utility circular path for ${condition.toLowerCase()} ${category.toLowerCase()}.`
        : `Secondary circular alternative to ${recommendedPath}.`,
    ],
    potentialDemand: (path === recommendedPath ? 'High' : 'Moderate') as 'High' | 'Moderate' | 'Low',
    estimatedEffort: (path === 'reuse' ? 'Low' : 'Moderate') as 'Low' | 'Moderate' | 'High',
    recoveryPotential: path === 'reuse' ? '100% item retention' : 'Material preservation',
  });

  const mapPathOption = (
    path: CircularValuePath,
    title: string,
    defaultTagline: string,
    rawOpt: unknown
  ) => {
    if (!rawOpt || typeof rawOpt !== 'object') {
      return defaultOption(path, title, defaultTagline);
    }
    const opt = rawOpt as Record<string, unknown>;
    return {
      path,
      title: (typeof opt.title === 'string' && opt.title) || title,
      tagline: (typeof opt.tagline === 'string' && opt.tagline) || defaultTagline,
      isRecommended: path === recommendedPath,
      reasoning: Array.isArray(opt.reasoning) && opt.reasoning.length > 0
        ? (opt.reasoning.filter((r) => typeof r === 'string') as string[])
        : defaultOption(path, title, defaultTagline).reasoning,
      potentialDemand: (['High', 'Moderate', 'Low'].includes(String(opt.potential_demand))
        ? String(opt.potential_demand)
        : 'Moderate') as 'High' | 'Moderate' | 'Low',
      estimatedEffort: (['Low', 'Moderate', 'High'].includes(String(opt.estimated_effort))
        ? String(opt.estimated_effort)
        : 'Moderate') as 'Low' | 'Moderate' | 'High',
      recoveryPotential: (typeof opt.recovery_potential === 'string' && opt.recovery_potential) || 'Material recovery',
    };
  };

  const value: ValueAiResult = {
    recommendedPath,
    summaryReasoning:
      (typeof data.summary_reasoning === 'string' && data.summary_reasoning.trim()) ||
      `Based on ${condition.toLowerCase()} condition and ${material} construction, ${recommendedPath} provides the highest circular value.`,
    paths: {
      reuse: mapPathOption('reuse', 'Reuse', 'Keep the item in active service', rawPaths?.reuse),
      donate: mapPathOption('donate', 'Donate', 'Pass to non-profits and shelters in need', rawPaths?.donate),
      resell: mapPathOption('resell', 'Resell', 'Recover direct economic value', rawPaths?.resell),
      recycle: mapPathOption('recycle', 'Recycle', 'Recover raw materials and fibers', rawPaths?.recycle),
    },
  };

  return { vision, value };
}

export const normalizeCircularPath = normalizeValuePath;
export const toDomainResults = validateAndNormalizeGeminiOutput;
