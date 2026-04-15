import { useState, useRef, useEffect } from 'react';
import { Home, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseAvailable } from './lib/supabase';

// Re-use the same shape icons from App.tsx
const AlmondIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M 7.5 16 C 7.5 20 16.5 20 16.5 16 C 16.5 9 14 3.5 12 3.5 C 10 3.5 7.5 9 7.5 16 Z" fill="none" />
  </svg>
);

const SquareIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M 7.5 16 C 7.5 20 16.5 20 16.5 16 L 16.5 6 C 16.5 5.2 16 4.8 15.2 4.8 L 8.8 4.8 C 8 4.8 7.5 5.2 7.5 6 Z" fill="none" />
  </svg>
);

const OvalIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M 7.5 16 C 7.5 20 16.5 20 16.5 16 L 16.5 9.5 C 16.5 6 14.5 4.5 12 4.5 C 9.5 4.5 7.5 6 7.5 9.5 Z" fill="none" />
  </svg>
);

const SquovalIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M 7.5 16 C 7.5 20 16.5 20 16.5 16 L 16.5 7 C 16.5 5.5 15.5 4.5 14 4.5 L 10 4.5 C 8.5 4.5 7.5 5.5 7.5 7 Z" fill="none" />
  </svg>
);

const ShortIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M 7.5 16 C 7.5 20 16.5 20 16.5 16 L 16.5 10 C 16.5 9.2 16 8.8 15.2 8.8 L 8.8 8.8 C 8 8.8 7.5 9.2 7.5 10 Z" fill="none" />
  </svg>
);

const SharpIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M 7.5 16 C 7.5 20 16.5 20 16.5 16 C 16.5 10 13 3 12 3 C 11 3 7.5 10 7.5 16 Z" fill="none" />
  </svg>
);

const CoffinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M 7.5 16 C 7.5 20 16.5 20 16.5 16 L 15.5 8 L 14 4 L 10 4 L 8.5 8 Z" fill="none" />
  </svg>
);

const SHAPES = [
  { id: 'almond', name: 'ทรงอัลมอนด์', icon: AlmondIcon },
  { id: 'square', name: 'ทรงสี่เหลี่ยม', icon: SquareIcon },
  { id: 'squoval', name: 'ทรงเหลี่ยมรี', icon: SquovalIcon },
  { id: 'oval', name: 'ทรงกลม/ทรงรี', icon: OvalIcon },
  { id: 'short', name: 'ทรงสั้น', icon: ShortIcon },
  { id: 'sharp', name: 'ทรงแหลม', icon: SharpIcon },
  { id: 'coffin', name: 'ทรงคอฟฟิน', icon: CoffinIcon }
];

interface UploadedImage {
  id: string;
  image_url: string;
  shape: string;
  created_at: string;
  user_id?: string;
  file?: File;
  preview?: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [selectedShape, setSelectedShape] = useState<string>('almond');
  const [filterShape, setFilterShape] = useState<string>('all');
  const [isDragging, setIsDragging] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load images from Supabase on component mount
  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    if (isSupabaseAvailable) {
      try {
        const { data, error } = await supabase!
          .from('nail_images')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading images:', error);
          return;
        }

        setUploadedImages(data || []);
      } catch (error) {
        console.error('Error loading images:', error);
      }
    } else {
      // Fallback to localStorage
      try {
        const savedImages = localStorage.getItem('nailGalleryImages');
        if (savedImages) {
          const parsedImages = JSON.parse(savedImages);
          setUploadedImages(parsedImages);
        }
      } catch (error) {
        console.error('Error loading saved images:', error);
      }
    }
  };

  
  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;

    if (isSupabaseAvailable) {
      // Upload to Supabase
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          try {
            // Upload file to Supabase storage
            const fileName = `${Date.now()}-${file.name}`;
            const { error: uploadError } = await supabase!.storage
              .from('nail-images')
              .upload(fileName, file);

            if (uploadError) {
              console.error('Error uploading file:', uploadError);
              continue;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase!.storage
              .from('nail-images')
              .getPublicUrl(fileName);

            // Insert into database
            const { error: insertError } = await supabase!
              .from('nail_images')
              .insert({
                image_url: publicUrl,
                shape: selectedShape
              });

            if (insertError) {
              console.error('Error inserting image data:', insertError);
            }
          } catch (error) {
            console.error('Error uploading image:', error);
          }
        }
      }
    } else {
      // Fallback to localStorage
      const newImages: UploadedImage[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          const preview = await new Promise<string>((resolve) => {
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
          
          newImages.push({
            id: `${Date.now()}-${i}`,
            image_url: preview,
            shape: selectedShape,
            created_at: new Date().toISOString(),
            file,
            preview
          });
        }
      }

      setUploadedImages(prev => [...prev, ...newImages]);
      
      // Save to localStorage
      const allImages = [...uploadedImages, ...newImages];
      localStorage.setItem('nailGalleryImages', JSON.stringify(allImages));
    }

    // Reload images after upload
    await loadImages();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const confirmDelete = (id: string) => {
    setDeleteConfirm(id);
  };

  const removeImage = async (id: string) => {
    if (isSupabaseAvailable) {
      try {
        // Get image data before deletion
        const image = uploadedImages.find(img => img.id === id);
        if (!image) return;

        // Extract file name from URL
        const fileName = image.image_url.split('/').pop();
        
        // Delete from storage
        const { error: storageError } = await supabase!.storage
          .from('nail-images')
          .remove([fileName]);

        if (storageError) {
          console.error('Error deleting from storage:', storageError);
        }

        // Delete from database
        const { error: dbError } = await supabase!
          .from('nail_images')
          .delete()
          .eq('id', id);

        if (dbError) {
          console.error('Error deleting from database:', dbError);
        }

        // Reload images
        await loadImages();
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    } else {
      // Fallback to localStorage
      setUploadedImages(prev => {
        const filteredImages = prev.filter(img => img.id !== id);
        // Update localStorage immediately
        if (filteredImages.length === 0) {
          localStorage.removeItem('nailGalleryImages');
        } else {
          localStorage.setItem('nailGalleryImages', JSON.stringify(filteredImages));
        }
        return filteredImages;
      });
    }
    
    setDeleteConfirm(null);
  };

  const changeImageShape = async (id: string, newShape: string) => {
    if (isSupabaseAvailable) {
      try {
        const { error } = await supabase!
          .from('nail_images')
          .update({ shape: newShape })
          .eq('id', id);

        if (error) {
          console.error('Error updating shape:', error);
          return;
        }

        // Reload images to reflect changes
        await loadImages();
      } catch (error) {
        console.error('Error updating shape:', error);
      }
    } else {
      // Fallback to localStorage
      setUploadedImages(prev => 
        prev.map(img => 
          img.id === id ? { ...img, shape: newShape } : img
        )
      );
      
      // Update localStorage
      localStorage.setItem('nailGalleryImages', JSON.stringify(uploadedImages));
    }
  };

  // Group images by shape with filter
  const getImagesByShape = () => {
    const filteredImages = filterShape === 'all' 
      ? uploadedImages 
      : uploadedImages.filter(img => img.shape === filterShape);
    
    const grouped: { [key: string]: UploadedImage[] } = {};
    filteredImages.forEach(img => {
      if (!grouped[img.shape]) {
        grouped[img.shape] = [];
      }
      grouped[img.shape].push(img);
    });
    return grouped;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white pt-6 pb-4 px-4 md:px-8 shadow-sm border-b">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src="/icons.png" 
              alt="BAAN ANN" 
              className="h-8 md:h-10 w-auto"
            />
            <h1 className="text-xl md:text-2xl font-bold tracking-wide">
              BAAN ANN
            </h1>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Gallery</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto pt-6 px-4 md:px-8 pb-20">
        
        {/* Shape Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Select Default Shape for Uploads</h2>
          <div className="flex flex-wrap gap-3">
            {SHAPES.map((shape) => {
              const Icon = shape.icon;
              const isActive = selectedShape === shape.id;
              return (
                <button
                  key={shape.id}
                  onClick={() => setSelectedShape(shape.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                    isActive 
                      ? 'border-black bg-black text-white' 
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{shape.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Upload Area */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Upload Images</h2>
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isDragging 
                ? 'border-black bg-gray-100' 
                : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-2">
              Drag and drop images here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Supports JPG, PNG, GIF (Max 10MB per file)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
          </div>
        </div>

        {/* Uploaded Images */}
        {uploadedImages.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                Uploaded Images ({uploadedImages.length})
              </h2>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Filter:</label>
                <select
                  value={filterShape}
                  onChange={(e) => setFilterShape(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="all">All Shapes</option>
                  {SHAPES.map((shape) => (
                    <option key={shape.id} value={shape.id}>
                      {shape.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {filterShape === 'all' ? (
              // Show all images in a single grid when "All Shapes" is selected
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadedImages.map((image) => (
                  <div key={image.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="aspect-[4/5] relative bg-gray-100">
                      <img 
                        src={image.image_url || image.preview} 
                        alt="Uploaded nail design"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => confirmDelete(image.id)}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-3">
                      <select
                        value={image.shape}
                        onChange={(e) => changeImageShape(image.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        {SHAPES.map((shape) => (
                          <option key={shape.id} value={shape.id}>
                            {shape.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Show grouped by shape when specific shape is selected
              <div className="space-y-8">
                {Object.entries(getImagesByShape()).map(([shapeId, images]) => {
                  const shape = SHAPES.find(s => s.id === shapeId);
                  const Icon = shape?.icon;
                  return (
                    <div key={shapeId} className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center gap-3 mb-4">
                        {Icon && <Icon className="w-6 h-6 text-black" />}
                        <h3 className="text-lg font-semibold">{shape?.name}</h3>
                        <span className="text-sm text-gray-500">({images.length} images)</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((image) => (
                          <div key={image.id} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                            <div className="aspect-[4/5] relative bg-gray-100">
                              <img 
                                src={image.preview} 
                                alt="Uploaded nail design"
                                className="w-full h-full object-cover"
                              />
                              <button
                                onClick={() => confirmDelete(image.id)}
                                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="p-3">
                              <select
                                value={image.shape}
                                onChange={(e) => changeImageShape(image.id, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                              >
                                {SHAPES.map((shape) => (
                                  <option key={shape.id} value={shape.id}>
                                    {shape.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {uploadedImages.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No images uploaded yet</p>
            <p className="text-sm text-gray-400 mt-2">Upload some nail designs to get started</p>
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this image? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => removeImage(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
