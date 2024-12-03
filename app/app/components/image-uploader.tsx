import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'
import { motion, HTMLMotionProps } from 'framer-motion'

interface ImageUploaderProps {
  onImageUpload: (file: File) => void
}

export function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageUpload(acceptedFiles[0])
    }
  }, [onImageUpload])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  })

  return (
    <motion.div
      {...getRootProps() as HTMLMotionProps<'div'>}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary'
        }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center space-y-4">
        <div className="p-4 bg-gradient-to-br from-orange-400 to-red-600 rounded-full text-white">
          <Upload className="h-8 w-8" />
        </div>
        <div>
          <p className="text-lg font-semibold">Drop your image here, or click to select</p>
          <p className="text-sm text-muted-foreground mt-1">Supports: JPEG, PNG, GIF (Max 5MB)</p>
        </div>
      </div>
    </motion.div>
  )
}
