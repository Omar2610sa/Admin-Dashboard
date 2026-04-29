# TODO: Implement Create Feature Modal in AllFeatures.jsx

## Steps (in order):

- [x] 1. Add createFeature translations to src/language/i18n.jsx
- [x] 2. Update AllFeatures.jsx:
  - Add imports (useEffect, ToggleSwitch, i18n)
  - Add states (sections, submitting, media*, isActive, etc.)
  - Add fetchSections useEffect
  - Add helpers (fixMediaUrl, isVideoFile, uploadMedia, handleMediaChange)
  - Add handleCreateSubmit (POST /api/admin/features)
  - Replace modal placeholder with full EditFeature-like form + section select
- [x] 3. Test modal open/close, upload, section select, submit, table refresh
- [x] 4. attempt_completion

## COMPLETED ✅

Create Feature Modal implemented successfully with section_id fix.

Final state:
- Dynamic sections from /api/general/sections
- sectionId state controlled select (id value)
- POST payload: section_id (int), attachment (media), all AR/EN fields
- Full EditFeature UI match
- No existing code changed
