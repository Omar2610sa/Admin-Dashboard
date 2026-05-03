# TODO: Boards Section Form Restriction

## Approved Plan Steps (in order):

- [x] 1. Update src/pages/Features/EditFeature.jsx
  - Add isBoardsSection state
  - Update useEffect to detect feature.section === 'boards'  
  - Conditionally render: show only title_ar/en + description_ar/en fields
  - Hide media, labels, status
  - Clean payload in submit

- [x] 2. Update src/pages/Features/AllFeatures.jsx (create modal)
  - Add boardsSectionId logic from sections
  - On section change, detect boards
  - Conditionally render simplified form  
  - Clean payload in create submit

- [ ] 3. Test:
  - Edit boards feature: simplified form
  - Create boards feature: simplified form  
  - Non-boards: full form
  - Submit works

- [ ] 4. attempt_completion

## Progress: Starting implementation...
