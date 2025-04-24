const BASE_API = import.meta.env.VITE_API_BASE || ''

export async function initializeSession({ o, i, c, uuid }) {
    if (Number(o) == -1 && Number(i) == -1) {
        return mockSession()
    }
    const res = await fetch(`${BASE_API}/api/interview-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ o, i, c, uuid })
    })

    if (!res.ok) throw new Error('Session init failed')

    return await res.json()
}

function mockSession() {
    return {
        complete: true,
        description: "Answer a few short questions. All you need is a mic.",
        displayName: "Get started with your voice interview",
        language: "en",
        thankYouMessage: "Thank you so much!",
        thankYouUrl: null,
        video: true
    }
}