import type { ModelClassificationResponse } from "./model"
import type { ClassificationResult } from "@/lib/types/classification"

/**
 * Default fallback for unknown subjects
 */
const DEFAULT_CATEGORY = {
  name: "Khác",
  color: "#9CA3AF", // neutral gray
}

/**
 * Map by SUBJECT CODE (language-agnostic, stable)
 */
const CATEGORY_MAP: Record<
  string,
  { name: string; color: string }
> = {
  BIOLOGY: {
    name: "Khoa học tự nhiên",
    color: "#45B7D1",
  },
  PHYSICS: {
    name: "Khoa học tự nhiên",
    color: "#4ECDC4",
  },
  GEOGRAPHY: {
    name: "Khoa học xã hội",
    color: "#FFA07A",
  },
  HISTORY: {
    name: "Khoa học xã hội",
    color: "#F4A261",
  },
}

/**
 * Mapper from backend → UI model
 */
export function mapModelToClassificationResult(
  data: ModelClassificationResponse
): ClassificationResult {
  const categoryInfo =
    CATEGORY_MAP[data.subject_code] ?? DEFAULT_CATEGORY

  return {
    // display text
    subject: data.subject,

    confidence: data.confidence,
    category: categoryInfo.name,
    categoryColor: categoryInfo.color,

    classId: data.grade,
    processingTime: data.processing_time_ms ?? 0,
    modelVersion: "v1",

    topPredictions: data.top_predictions.slice(0, 3).map((p) => {
      const topCategory =
        CATEGORY_MAP[p.subject_code] ?? DEFAULT_CATEGORY

      return {
        subject: p.subject,
        classId: p.grade,
        category: topCategory.name,
        confidence: p.confidence,
        categoryColor: topCategory.color,
      }
    }),

    analysisMetrics: {
      accuracy: data.confidence,
      precision: data.confidence,
      recall: data.confidence,
      inferenceSpeed: 0,
    },

    technicalDetails: {
      imageSize: "N/A",
      dimensions: "N/A",
      format: "N/A",
      graphNodes: 0,
      graphEdges: 0,
    },
  }
}
