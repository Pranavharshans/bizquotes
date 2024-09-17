"use client"

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon, Share2, Download, Facebook, Instagram, Twitter } from 'lucide-react'
import html2canvas from 'html2canvas'

export default function Component() {
  const [quote, setQuote] = useState({ content: "", author: "" })
  const [greeting, setGreeting] = useState("")
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false)
  const quoteRef = useRef(null)

  useEffect(() => {
    fetchQuote()
    setGreeting(getGreeting())
    const interval = setInterval(fetchQuote, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchQuote = async () => {
    try {
      // Combine the tags 'business', 'success', and 'leadership'
      const response = await fetch('https://quote-garden.herokuapp.com/api/v3/quotes?tags=business,success,leadership');
      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        // Optionally, you can pick a random quote from the response
        const randomQuote = data.data[Math.floor(Math.random() * data.data.length)];
        setQuote({ content: randomQuote.quoteText, author: randomQuote.quoteAuthor });
      } else {
        // Fallback quote
        setQuote({ content: "The best way to predict the future is to create it.", author: "Peter Drucker" });
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
      setQuote({ content: "The best way to predict the future is to create it.", author: "Peter Drucker" });
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    const greetings = [
      "Rise and shine, entrepreneur!",
      "Good day, business leader!",
      "Evening, visionary!",
      "Hello, innovator!",
      "Greetings, game-changer!",
      "Welcome, trailblazer!",
      "Salutations, business maverick!",
      "Hey there, future tycoon!",
      "Good day, industry disruptor!",
      "Hello, entrepreneurial spirit!"
    ]
    if (hour < 12) return greetings[0]
    if (hour < 18) return greetings[1]
    return greetings[Math.floor(Math.random() * (greetings.length - 2)) + 2]
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const generateQuoteImage = async () => {
    if (quoteRef.current) {
      try {
        const canvas = await html2canvas(quoteRef.current, {
          backgroundColor: isDarkMode ? '#000000' : '#f8f7f2',
        })
        return canvas.toDataURL("image/png")
      } catch (error) {
        console.error('Error generating image:', error)
      }
    }
    return null
  }

  const shareQuote = async (platform: string) => {
    const imageData = await generateQuoteImage()
    if (!imageData) return

    switch (platform) {
      case 'download':
        const link = document.createElement('a')
        link.href = imageData
        link.download = 'inspirational-quote.png'
        link.click()
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')
        break
      case 'instagram':
        alert("To share on Instagram, please download the image and upload it manually to your Instagram app.")
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`&quot;${quote.content}&quot; - ${quote.author}`)}&url=${encodeURIComponent(window.location.href)}`, '_blank')
        break
      default:
        console.error('Unknown sharing platform')
    }
    setIsShareMenuOpen(false)
  }

  return (
    <div className={`min-h-screen flex flex-col p-4 sm:p-8 md:p-16 relative transition-colors duration-300 ${isDarkMode ? 'bg-black text-white' : 'bg-[#f8f7f2] text-gray-900'}`}>
      {/* Fading Grid lines */}
      <div 
        className="absolute inset-0 grid grid-cols-6 grid-rows-6"
        style={{
          maskImage: 'radial-gradient(circle, transparent 50%, black 70%)',
          WebkitMaskImage: 'radial-gradient(circle, transparent 50%, black 70%)'
        }}
      >
        {[...Array(35)].map((_, i) => (
          <div key={i} className={`${isDarkMode ? 'border-gray-700' : 'border-gray-300'} border-opacity-50`}>
            <div className={`w-full h-full border-l border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} border-opacity-50`}></div>
          </div>
        ))}
      </div>

      {/* Dark mode toggle */}
      <motion.button
        className={`fixed top-4 right-4 p-2 rounded-full z-20 ${isDarkMode ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}
        onClick={toggleDarkMode}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </motion.button>

      {/* Share button and menu */}
      <div className="fixed top-4 right-16 z-20">
        <motion.button
          className={`p-2 rounded-full ${isDarkMode ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}
          onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Share2 size={24} />
        </motion.button>
        {isShareMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute right-0 mt-2 p-2 rounded-md ${isDarkMode ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}
          >
            <button onClick={() => shareQuote('download')} className="block p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md">
              <Download size={20} />
            </button>
            <button onClick={() => shareQuote('facebook')} className="block p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md">
              <Facebook size={20} />
            </button>
            <button onClick={() => shareQuote('instagram')} className="block p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md">
              <Instagram size={20} />
            </button>
            <button onClick={() => shareQuote('twitter')} className="block p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md">
              <Twitter size={20} />
            </button>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`text-sm sm:text-base md:text-lg font-light mb-8 self-start relative z-10 ${isDarkMode ? 'text-beige' : 'text-gray-900'}`}
      >
        {greeting}
      </motion.div>

      <div ref={quoteRef} className="flex flex-col items-center justify-center text-center p-4 md:p-8 border rounded-lg bg-white dark:bg-gray-800 shadow-lg relative z-10">
        <motion.div
          className={`text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 ${isDarkMode ? 'text-beige' : 'text-gray-900'}`}
          animate={{ opacity: [0, 1], scale: [0.8, 1] }}
          transition={{ duration: 1 }}
        >
          &ldquo;{quote.content}&rdquo;
        </motion.div>
        <motion.div
          className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}
          animate={{ opacity: [0, 1], y: [20, 0] }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          — {quote.author}
        </motion.div>
      </div>
    </div>
  )
}
