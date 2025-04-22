export default function Error({ message }) {
    return (
      <div className="p-8 text-center text-red-600 text-lg font-medium">
        ⚠️ {message || 'Something went wrong.'}
      </div>
    )
  }
  