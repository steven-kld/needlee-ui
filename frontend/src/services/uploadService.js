const BASE_API = import.meta.env.VITE_API_BASE || ''

export async function uploadChunk({ blob, attempt, questionNum, chunkIndex, uuid, org, interview }) {
    if (!blob || typeof blob !== 'object') {
        console.warn(`⚠️ Skipping upload: no valid blob for Q${questionNum} chunk ${chunkIndex}`)
        return false
    }

    const formData = new FormData()
    formData.append('file', blob, `${questionNum}_${chunkIndex}.webm`)
    formData.append('attempt', attempt)
    formData.append('question_num', questionNum)
    formData.append('chunk_index', chunkIndex)
    formData.append('uuid', uuid)

    try {
        const res = await fetch(`${BASE_API}/api/upload-chunk?o=${org}&i=${interview}`, {
            method: 'POST',
            body: formData
        })

        if (!res.ok) {
            const text = await res.text()
            console.warn(`⚠️ Upload failed for chunk ${chunkIndex}:`, text)
            return false
        }

        console.log(`📤 Uploaded: ${questionNum}_${chunkIndex}.webm`)
        return true
        
    } catch (err) {
        console.warn(`❌ Upload crashed for chunk ${chunkIndex}:`, err)
        return false
    }
}
