import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../../language/i18n';
import api from '../../APIs/api';
import { SuccessAlert } from '../../components/Alerts/SuccessAlert';


const EditSection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(); // t not used yet

  // Form states
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaValue, setMediaValue] = useState('');
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState('');

  // Fetch section data
  useEffect(() => {
    const fetchSection = async () => {
      try {
        const response = await api.get(`/api/admin/sections/${id}`);
        setSection(response.data.data || response.data);
        if (response.data.data?.media) {
          setMediaValue(response.data.data.media);
        }
      } catch (err) {
        alert('Failed to load section: ' + (err.response?.data?.message || err.message));
        navigate('/app/sections');
      } finally {
        setLoading(false);
      }
    };
    fetchSection();
  }, [id, navigate]);

  const fixMediaUrl = (url) => {
    if (!url || typeof url !== "string") return "";
    if (url.includes("https://") && url.indexOf("https://") !== url.lastIndexOf("https://")) {
      const parts = url.split("https://");
      return "https://" + parts[parts.length - 1];
    }
    return url;
  };

  const uploadMedia = async (file) => {
    if (!file) return;
    
    setUploadingMedia(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', 'sections');
    formData.append('attachment_type', 'image'); // or video?

    try {
      const response = await api.post('/api/general/attachments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const filename = response.data?.data;
      if (filename) {
        setMediaValue(filename);
        setMediaPreviewUrl(`https://api-araf.vue.aait-d.com/medias/sections/${filename}`);
      }
    } catch (err) {
      console.error('Media upload failed:', err);
      alert('Media upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingMedia(false);
      setMediaFile(null);
    }
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      setMediaPreviewUrl(URL.createObjectURL(file));
      uploadMedia(file);
    }
  };

  const resetMediaStates = () => {
    setMediaFile(null);
    setMediaValue('');
    setMediaPreviewUrl('');
    setUploadingMedia(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formDataObj = Object.fromEntries(new FormData(e.target));
    // Remove unwanted fields and ensure media is string
    const { label, ...payload } = formDataObj;
    if (payload.media && typeof payload.media !== 'string') {
      delete payload.media;
    }
    // Backend expects 0/1 for is_active
    payload.is_active = payload.is_active === 'on' || payload.is_active === true || payload.is_active === 1 ? 1 : 0;

    try {
      await api.put(`/api/admin/sections/${id}`, payload);
      SuccessAlert("Section updated successfully");
      navigate('/app/sections');
    } catch (err) {
      console.error('Update error:', err.response?.data);
      alert('Update failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin w-12 h-12 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
          </svg>
          <p className="text-slate-600 dark:text-slate-400">Loading section...</p>
        </div>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="space-y-6 p-8">
        <h1 className="text-3xl font-black text-slate-800 dark:text-white">Edit Section</h1>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
          Section not found
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white">Edit Section</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Update section #{section.id}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/app/sections')}
            className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-6 py-3 rounded-2xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-100 dark:border-slate-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Media Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
              Media (Image/Video)
            </label>
            {(mediaPreviewUrl || mediaValue) && (
              <div className="mb-4">
                <div className="w-24 h-20 object-cover rounded-lg shadow-md border-2 border-slate-200 dark:border-slate-600 mx-auto bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    <video 
                      src={mediaPreviewUrl || fixMediaUrl(mediaValue)} 
                      controls 
                      className="w-full h-full object-cover rounded-lg max-h-20"
                      muted
                    >
                      Your browser does not support the video tag.
                    </video>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2">
                  {mediaPreviewUrl ? 'Preview - will upload' : 'Current media'}
                </p>
              </div>
            )}
            <label 
              htmlFor="media-upload"
              className="flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:border-blue-400 dark:hover:bg-blue-950/50 transition-all w-full"
            >
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {uploadingMedia ? 'Uploading...' : 'Click to upload or change media'}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Image or Video (max 10MB)
              </p>
            </label>
            <input 
              id="media-upload"
              type="file" 
              accept="image/*,video/*" 
              onChange={handleMediaChange} 
              className="hidden"
              disabled={uploadingMedia}
            />
            {uploadingMedia && (
              <div className="mt-3 flex items-center text-blue-600 dark:text-blue-400">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Uploading media...
              </div>
            )}
            <input type="hidden" name="media" value={mediaValue} />
          </div>

          {/* Title Arabic Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Title Arabic (title_ar)
              </label>
              <input 
                type="text" 
                name="title_ar" 
                defaultValue={section.title_ar || section.title || ''} 
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Title English (title_en)
              </label>
              <input 
                type="text" 
                name="title_en" 
                defaultValue={section.title_en || ''} 
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              />
            </div>
          </div>

          {/* Description AR */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Description Arabic (description_ar)
            </label>
            <textarea 
              name="description_ar" 
              defaultValue={section.description_ar || ''} 
              rows="4"
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical"
            />
          </div>

          {/* Description EN */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Description English (description_en)
            </label>
            <textarea 
              name="description_en" 
              defaultValue={section.description_en || ''} 
              rows="4"
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical"
            />
          </div>

          {/* Label AR */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Label Arabic
            </label>
            <input 
              type="text" 
              name="label" 
              defaultValue={section.label || ''} 
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
            />
          </div>

          {/* Label EN */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Label English
            </label>
            <input 
              type="text" 
              name="label_en" 
              defaultValue={section.label_en || ''} 
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Type
            </label>
            <input 
              type="text" 
              name="type" 
              defaultValue={section.type || ''} 
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              readOnly
            />
          </div>

          <div className="flex space-x-4">
            <button 
              type="submit" 
              disabled={submitting || uploadingMedia}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {submitting ? 'Updating...' : 'Update Section'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/app/sections')}
              disabled={submitting}
              className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 py-4 px-6 rounded-2xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSection;

