🚗 CarGallery (Multi-Gallery) Management System

📌 Project Overview
CarGallery is a full-stack web application for car dealerships (galleries).
It provides a customer-facing catalog and an admin panel to manage inventory.
New scope: arabam.com-like flow → user selects a City, then selects a Gallery in that city, then browses that gallery’s cars.

This project was developed as part of the Project Management course.

🎯 Project Objectives
- Manage car inventory digitally (Cars + Brands)
- Provide a clean customer catalog (search / filter / sort)
- Enable admin management (add / update / delete cars, manage brands, manage images)
- Prepare a scalable Multi-Gallery model (City → Gallery → Catalog)
- Support maintainability with API-first architecture + CI pipeline

👥 Team Members & Roles
Name                 Role
Berk Yalçınkaya      Project Manager
Hıdır Işıkbaş        Frontend Developer
Asya Yayla           Risk Management
Burak Bayraktar      Database Developer
Hasan Eren Ertekin   Backend Developer

⚙️ Technologies Used
Frontend
- React 18 + TypeScript (Vite)
- axios (API calls)

Backend
- ASP.NET Core Web API
- Entity Framework Core
- Swagger / OpenAPI

Database
- SQLite (development)
- (Optional) upgrade path: PostgreSQL / SQL Server

DevOps / Tools
- Git & GitHub
- GitHub Actions (CI)

🧩 System Features (MVP)
Customer
- Register / Login
- Browse catalog (search / filter / sort)
- Car detail page with images and specs

Admin
- Car management: add / edit / delete
- Brand management: add / edit / delete
- Image management: upload / delete (car images)
- User management: view users + role operations (as defined in the project scope)

🧭 Multi-Gallery (New Scope)
- City selection page
- Gallery directory by selected city
- Gallery-scoped catalog (all cars filtered by selected GalleryId)
- Admin scoping: admins manage only their assigned gallery (planned enforcement)

▶️ How to Run (Local)
Backend
- Open backend folder
- dotnet run

Frontend
- Open frontend folder
- npm install
- npm run dev

(After both are running, open the frontend URL shown in terminal.)

✅ CI / CD
- CI runs on pushes to main via GitHub Actions.
- Workflow file: .github/workflows/ci.yml
Demo goal: show a green pipeline run in GitHub → Actions.

🗂️ Project Documents
The repository includes:
- 📄 Project Management Report (updated)
- 📊 Timeline & Budget Planning (Excel)
- ⚠️ Risk Analysis Updates (Week 3)
- 📐 UML Diagrams (MVP + Multi-Gallery)
- 🎬 Demo Plan (live demo steps)

📅 Project Timeline (Summary)
- February: Planning, architecture design, data modeling
- March: Full-stack integration (frontend + backend)
- April: Admin panel maturity, image management, stabilization
- May: Multi-Gallery (City → Gallery selection) + scoping + testing
- June: Final documentation + release + live demo

⚠️ Risk Management (Short)
Main risks:
- CRUD/API failures
- Data inconsistency after update/delete
- Migration / foreign key conflicts
- Invalid data entry
- Cross-gallery data leakage (multi-gallery scope)
Mitigation: validation rules, role checks, scoping tests, incremental migrations, and regression testing.

📐 UML Diagram
Updated UML includes:
- City, Gallery (new scope)
- Car, Brand, User + role model
- Gallery scoping relations (GalleryId)
Files:
- docs/architecture/ (PNG/PDF)
