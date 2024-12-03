'use client'

import { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from 'next/image'
import { ImageUploader } from './components/image-uploader'
import { RoastResult } from './components/roast-result'
import { LanguageSelector } from './components/language-selector'
import { ThemeToggle } from './components/theme-toggle'
import { Loader2, Trash2, Share2, ImageIcon, Settings } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function ImageRoaster() {
  const [image, setImage] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [roast, setRoast] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [language, setLanguage] = useState('Indonesia')
  const { toast } = useToast()

  const handleImageUpload = (file: File) => {
    setImage(file)
    setImageUrl(URL.createObjectURL(file))
    setRoast('')
    setError(null)
  }

  const handleRemoveImage = () => {
    setImage(null)
    setImageUrl(null)
    setRoast('')
    setError(null)
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    setRoast('')
  }

  const generateRoast = async () => {
    if (!image) return

    setIsLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('image', image)
    formData.append('language', language)

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
  }

  const handleShare = useCallback(() => {
    if (roast) {
      navigator.clipboard.writeText(roast)
        .then(() => {
          toast({
            title: "Copied to clipboard",
            description: "The roast has been copied to your clipboard!",
          })
        })
        .catch(() => {
          toast({
            title: "Failed to copy",
            description: "Unable to copy the roast to your clipboard.",
            variant: "destructive",
          })
        })
    }
  }, [roast, toast])

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">AI Image Roaster</CardTitle>
            <ThemeToggle />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="image" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="image">
                <ImageIcon className="w-4 h-4 mr-2" />
                Image
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
            <TabsContent value="image">
              {!image && <ImageUploader onImageUpload={handleImageUpload} />}
              {imageUrl && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <Image
                    src={imageUrl}
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
                </div>
              )}
            </TabsContent>
            <TabsContent value="settings">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="language-select" className="text-sm font-medium">
                    Roast Language
                  </label>
                  <LanguageSelector onLanguageChange={handleLanguageChange} selectedLanguage={language} />
                </div>
                {/* Add more settings here if needed */}
              </div>
            </TabsContent>
          </Tabs>
          {roast && (
            <div className="space-y-2">
              <RoastResult roast={roast} />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Character count: {roast.length}
                </span>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          )}
          {error && (
            <div className="text-red-500 text-center">{error}</div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={generateRoast}
            disabled={!image || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Roasting...
              </>
            ) : (
              'Roast This Image!'
            )}
          </Button>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  )
}
