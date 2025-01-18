import { useState } from 'react'
// import { Button } from "@/components/ui/button";
// import { input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from 'lucide-react'

interface FormData {
  name: string
  email: string
  message: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Replace with your deployed Google Apps Script URL
  const SCRIPT_URL =
    'https://script.google.com/macros/s/AKfycbzOgfr5oevc2RLuiHLHMKP4yC8uRL0nnpCR8lzNl03rz0ffo71l8ZnO2XfHhOwhQ6kFdA/exec'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Chuyển data thành URL params
      const formDataParams = new URLSearchParams()
      Object.entries(formData).forEach(([key, value]) => {
        formDataParams.append(key, value)
      })

      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Thêm mode no-cors
        redirect: 'follow',
        body: formDataParams,
      })

      // Vì mode no-cors, ta không thể đọc response
      // Nếu không có lỗi, coi như thành công
      setSuccess(true)
      setFormData({ name: '', email: '', message: '' })
    } catch (err) {
      setError('An error occurred while submitting the form. Please try again.')
      console.error('Form submission error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 p-4">
      <div>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full"
        />
      </div>

      <div>
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full"
        />
      </div>

      <div>
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full min-h-[100px]"
        />
      </div>

      <button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          'Submit'
        )}
      </button>

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

      {success && (
        <div className="text-green-500 text-sm mt-2">
          Form submitted successfully!
        </div>
      )}
    </form>
  )
}
