type NotificationProps = {
  message: string
  type?: 'success' | 'error' | 'warning'
  top?: string
}

export default function Notification({
  message,
  type = 'success',
  top = 'top-5',
}: NotificationProps) {
  if (!message) return null

  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-yellow-500',
  }

  return (
    <div className={`fixed ${top} right-5 z-50`}>
      <div
        className={`${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg min-w-[250px]`}
      >
        <p className="text-sm font-medium">
          {message}
        </p>
      </div>
    </div>
  )
}