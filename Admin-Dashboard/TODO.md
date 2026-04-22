## Authentication Flow Implementation TODO

### Pending Steps:
1. [x] Install react-router-dom via `npm install react-router-dom`
2. [x] Update App.jsx: Add BrowserRouter, Routes (/ → Login, /app/* → Protected MainLayout)
3. [x] Create MainLayout.jsx: Migrate Sidebar + Header + Outlet
4. [x] Update Login.jsx: Add form, localStorage auth, navigate('/app/dashboard')
5. [x] Update Header.jsx: Add logout logic (remove localStorage, navigate('/'))
6. [x] Test flow: Login → protected dashboard, invalid access → login, logout → login
7. [x] Create stub pages (Dashboard etc.) for Outlet if needed
8. [x] [Complete]
