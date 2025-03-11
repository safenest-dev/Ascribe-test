import React, { useEffect, useState, useRef } from 'react'
import './form.css'
import { shortenUrl } from '../../services/api'

interface ShortenedUrl {
  shortCode: string
  originalUrl: string
  codeExists?: boolean
  urlExists?: boolean
}

interface FormProps {
  setShortenedUrl: (url: ShortenedUrl | null) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string) => void
  shortenedUrl: ShortenedUrl | null
}

function Form({
  setShortenedUrl,
  setIsLoading,
  setError,
  shortenedUrl,
}: FormProps) {
  const [url, setUrl] = useState<string>('')
   
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!shortenedUrl && inputRef.current) { 
      inputRef.current.focus()
    }
  }, [shortenedUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) {
      setError('Please enter a URL')
      return
    }

    let urlToShorten = url
    if (!/^https?:\/\//i.test(url)) {
      urlToShorten = 'https://' + url
    }

    try {
      setIsLoading(true)
      setError('')
      const data = await shortenUrl(urlToShorten)
      setShortenedUrl({
        shortCode: data.shortCode,
        originalUrl: data.originalUrl,
        codeExists: data.codeExists,
        urlExists: data.urlExists
      })
      console.log(data)
    } catch (err) {
      setError(err.message || 'Failed to shorten URL')
      setShortenedUrl(null)
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 1500)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='url-form'
      aria-label='URL Shortener Form'
    >
      <div className='input-group'>
        <input
          ref={inputRef}  
          type='text'
          placeholder='Paste your long URL here'
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className='url-input'
        />
        <button
          type='submit'
          className='submit-button'
        >
          Shorten
        </button>
      </div>
    </form>
  )
}

export default Form
