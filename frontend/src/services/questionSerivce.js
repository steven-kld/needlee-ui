const BASE_API = import.meta.env.VITE_API_BASE || ''

export async function fetchQuestions({ o, i, uuid }) {
    if (Number(o) == -1 && Number(i) == -1) {
        return mockQuestions()
    }
    const res = await fetch(`${BASE_API}/api/get-questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ o, i, uuid })
    })

    if (!res.ok) throw new Error("Questions fetch failed")

    return await res.json()
}

function mockQuestions() {
    return {
        attempt: 1,
        ready: true,
        questions: ['What is your name?', 'What motivates you?'],
        urls: [
            "https://test1.com",
            "https://test2.com"
        ]
    }
}