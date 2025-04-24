const BASE_API = import.meta.env.VITE_API_BASE || ''

export default async function closeInterviewService({ org, interview, uuid, attempt }) {
    try {
        const res = await fetch(`${BASE_API}/api/close-interview`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                o: org,
                i: interview,
                uuid: uuid,
                attempt: attempt
            })
        })
    
        const data = await res.json()
    
        if (res.ok && (data.status === 'ok' || data.status === 'ignored')) {
            return data.status // 'ok' or 'ignored'
        }
    
        throw new Error(data.error || 'Unexpected response')

    } catch (err) {
        console.error('❌ closeInterviewService failed:', err)
        return 'error'
    }
}
  