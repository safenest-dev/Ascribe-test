import React, { useState } from 'react'
import './result.css'

interface ShortenedUrl {
	shortCode: string
	originalUrl: string
	codeExists?: boolean
	urlExists?: boolean
}

interface ResultProps {
	shortenedUrl: ShortenedUrl
	setShortenedUrl: React.Dispatch<React.SetStateAction<ShortenedUrl | null>>
}

function Result({ shortenedUrl, setShortenedUrl }: ResultProps) {
	const [copied, setCopied] = useState(false)

	const baseUrl = window.location.origin
	const fullShortUrl = `${baseUrl}/${shortenedUrl.shortCode}`

	const handleCopy = () => {
		navigator.clipboard.writeText(fullShortUrl)
		setCopied(true)
		setTimeout(() => {
			setCopied(false)
		}, 2000)
	}

	console.log(shortenedUrl)

	return (
		<div className='result-container'>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					marginBottom: '30px',
				}}
			>
				<h2>Your shortened URL:</h2>
				<div
					onClick={() => setShortenedUrl(null)}
					style={{ cursor: 'pointer' }}
				>
					X
				</div>
			</div>

			<div
				className='shortened-url-display'
				style={{ borderLeft: copied ? '4px solid green' : '' }}
			>
				<span className='short-url'>{fullShortUrl}</span>
				<div style={{ width: '100px' }}>
					<button
						onClick={handleCopy}
						className={`copy-button ${copied ? 'copied' : ''}`}
					>
						{copied ? 'Copied!' : 'Copy'}
					</button>
				</div>
			</div>

			<div className='original-url'>
				{shortenedUrl?.codeExists && (
					<span>
						URL found in record for code {shortenedUrl.shortCode}
					</span>
				)}
				{shortenedUrl?.urlExists && (
					<span>
						Code found in record for url {shortenedUrl.originalUrl}
					</span>
				)}
				{!shortenedUrl?.codeExists && !shortenedUrl?.urlExists && (
					<>
						<span>Original URL: {shortenedUrl.originalUrl}</span>{' '}
						<a
							href={shortenedUrl.originalUrl}
							target='_blank'
							rel='noopener noreferrer'
						>
							{shortenedUrl.originalUrl}
						</a>
					</>
				)}
			</div>
		</div>
	)
}

export default Result
