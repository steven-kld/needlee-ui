export default function Complete({ message }) {
    return <div className="p-8 text-center">{message || 'Thank you for completing the interview!'}</div>
}