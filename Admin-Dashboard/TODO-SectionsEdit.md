# Sections Edit Page TODO

## Completed ✅
- [x] Create src/pages/Sections/EditSection.jsx with full form (title_ar/en, description_ar/en, label_ar/en, type readonly, media upload)
- [x] Media upload logic (FormData, model='sections', preview img/video, hidden input)
- [x] Add route /app/sections/edit/:id in App.jsx
- [x] Update AllSections actions Edit button to navigate(`/app/sections/edit/${row.id}`)

## Test
- `npm run dev`
- Click Edit on section row
- Verify form prefills, media preview, upload works, submit PUT

**Ready! Matches Country UI exactly.**

