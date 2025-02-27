'use client'

import { useState, useCallback, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import Image from 'next/image'
import { ImageUploader } from './components/image-uploader'
import { RoastResult } from './components/roast-result'
import { LanguageSelector } from './components/language-selector'
import { ThemeToggle } from './components/theme-toggle'
import { Loader2, Trash2, ImageIcon, Settings, Flame } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { motion, AnimatePresence } from "framer-motion"

export default function ImageRoaster() {
  const [image, setImage] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [roast, setRoast] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [language, setLanguage] = useState('Indonesia')
  const [roastIntensity, setRoastIntensity] = useState(50)
  const { toast } = useToast()

  const handleImageUpload = useCallback((file: File) => {
    setImage(file)
    setImageUrl(URL.createObjectURL(file))
    setRoast('')
    setError(null)
  }, [])

  const handleRemoveImage = useCallback(() => {
    setImage(null)
    setImageUrl(null)
    setRoast('')
    setError(null)
  }, [])

  const handleLanguageChange = useCallback((newLanguage: string) => {
    setLanguage(newLanguage)
    setRoast('')
  },[])

  const generateRoast = useCallback(async () => {
    if (!image) return

    setIsLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('image', image)
    formData.append('language', language)
    formData.append('intensity', roastIntensity.toString())

    try {
      const response = await fetch('/api/roast', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to generate roast')
      }

      const data = await response.json()
      setRoast(data.roast)
    } catch (error) {
      console.log('Error generating roast:', error)
      setError('Oops! Something went wrong while roasting your image. Maybe it was too hot to handle!')
      toast({
        title: "Error",
        description: "Failed to generate roast. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [image, language, roastIntensity, toast])

  // const handleShare = useCallback(() => {
  //   if (roast) {
  //     navigator.clipboard.writeText(roast)
  //       .then(() => {
  //         toast({
  //           title: "Copied to clipboard",
  //           description: "The roast has been copied to your clipboard!",
  //         })
  //       })
  //       .catch(() => {
  //         toast({
  //           title: "Failed to copy",
  //           description: "Unable to copy the roast to your clipboard.",
  //           variant: "destructive",
  //         })
  //       })
  //   }
  // }, [roast, toast])

  const content = useMemo(() => (
    <Card className="w-full max-w-3xl mx-auto backdrop-blur-sm shadow-xl">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-600 text-transparent bg-clip-text">
            AI Image Roaster
          </CardTitle>
          <ThemeToggle />
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <Tabs defaultValue="image" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="image" className="text-sm">
              <ImageIcon className="w-4 h-4 mr-2" />
              Image
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="image">
            <AnimatePresence mode="wait">
              {!image ? (
                <motion.div
                  key="uploader"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ImageUploader onImageUpload={handleImageUpload} />
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-64 rounded-lg overflow-hidden"
                >
                  <Image
                    src={imageUrl!}
                    alt="Uploaded image"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
          <TabsContent value="settings">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="language-select" className="text-sm font-medium">
                  Roast Language
                </label>
                <LanguageSelector onLanguageChange={handleLanguageChange} selectedLanguage={language} />
              </div>
              <div className="space-y-2">
                <label htmlFor="roast-intensity" className="text-sm font-medium flex items-center justify-between">
                  <span>Roast Intensity</span>
                  <span className="text-muted-foreground">{roastIntensity}%</span>
                </label>
                <Slider
                  id="roast-intensity"
                  min={0}
                  max={100}
                  step={1}
                  value={[roastIntensity]}
                  onValueChange={(value) => setRoastIntensity(value[0])}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Mild</span>
                  <span>Spicy</span>
                  <span>Brutal</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <AnimatePresence>
          {roast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              <RoastResult roast={roast} />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Character count: {roast.length}
                </span>
                {/* <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button> */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {error && (
          <div className="text-red-500 text-center">{error}</div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={generateRoast}
          disabled={!image || isLoading}
          className="w-full bg-gradient-to-r from-orange-400 to-red-600 hover:from-orange-500 hover:to-red-700 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Roasting...
            </>
          ) : (
            <>
              <Flame className="mr-2 h-4 w-4" />
              Roast This Image!
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  ), [image, imageUrl, roast, isLoading, error, language, roastIntensity, handleImageUpload, handleRemoveImage, handleLanguageChange, generateRoast])

  return (
    <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
      {content}
      <Toaster />
    </div>
  )
}
