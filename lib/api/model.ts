// lib/api/model.ts

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
  }) {
    const formData = new FormData()
    formData.append("image", payload.file)
  
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/model/classification`,
      {
        method: "POST",
        body: formData, // ✅ multipart/form-data automatically
      }
    )
  
    const data = await res.json()
  
    if (!res.ok) {
      throw new Error(data.error || "Model classification failed")
    }
  
    return data as ModelClassificationResponse
  }
  