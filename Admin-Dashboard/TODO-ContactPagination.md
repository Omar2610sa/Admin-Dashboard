# ContactUs Pagination Implementation

## Plan
1. Replace `useFetch` hook with manual `api` fetch calls
2. Add pagination state (currentPage, paginationMeta)
3. Add `fetchContacts` async function with page query params
4. Add `useEffect` to trigger fetch on page change
5. Add Material UI Pagination component at bottom
6. Update description count to use `paginationMeta.total`

## Changes in `src/pages/ContactUs/ContactUs.jsx`
- Replace imports: remove `useFetch`, add `api`, `Pagination`, `Stack`
- Add state: `contacts`, `loading`, `error`, `currentPage`, `paginationMeta`
- Add `fetchContacts` function
- Add `useEffect` for fetching
- Add Pagination UI
