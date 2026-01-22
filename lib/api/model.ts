// lib/api/model.ts
export type ModelVariant = "dual" | "single"

export interface ModelClassificationResponse {
  subject: string
  subject_code: string
  confidence: number
  grade: number
  label: string
  processing_time_ms?: number

  top_predictions: Array<{
    subject: string
    subject_code: string
    confidence: number
    grade: number
    label: string
  }>
}

export async function classifyImage(payload: {
  file: File
  model: ModelVariant
}) {
  const token = localStorage.getItem("access_token")

  if (!token) {
    throw new Error("Not authenticated")
  }

  const formData = new FormData()
  formData.append("image", payload.file)

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/model/classification`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // ✅ REQUIRED
        "X-Model-Variant": payload.model,
      },
      body: formData,
    }
  )

  const data = await res.json()

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Session expired. Please log in again.")
    }
    throw new Error(data.error || "Model classification failed")
  }

  return data as ModelClassificationResponse
}
