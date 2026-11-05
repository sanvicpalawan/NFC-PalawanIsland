NFC PALAWAN ISLAND

Connect physical products and places to useful digital experiences.

NFC Palawan Island is a connected business platform concept built around NFC tags and QR codes. The supplied application package describes a mobile first web experience for hospitality and other businesses, together with an administrative content management system for products, use cases, site content, and inquiries.

PROJECT STATUS

The application source is currently stored in the chip-nfc-sticker-business.zip archive. The source files have not been extracted into the repository root. Please inspect the archive and read SECURITY before running or deploying the application.

PROJECT HIGHLIGHTS

The package includes customer facing pages for solutions, industries, products, frequently asked questions, and contact information. It includes a product catalog for NFC and QR items, with product details, variants, materials, applications, and specification links. Its administrative tools are designed to manage site content, products, industries, use cases, inquiries, media, and settings.

The listed technology includes Next.js, React, TypeScript, Tailwind CSS, PostgreSQL, Drizzle ORM, and Docker. Check the package files and documentation for the exact versions and current setup instructions.

GETTING STARTED

The project files are inside the archive. First review its contents, then extract them into a clean working directory. Do not copy secrets or production configuration into the public repository.

Command line steps

unzip -l chip-nfc-sticker-business.zip
mkdir -p app-source
unzip chip-nfc-sticker-business.zip -d app-source
cd app-source

Create a local environment file using the variable names in the supplied environment example. Replace every placeholder with unique local values. Never commit environment files, passwords, database credentials, or session secrets.

SECURITY NOTICE

The supplied archive contains hard coded administrator credentials and a development authentication bypass. Treat all embedded credentials as compromised. Replace and rotate them before use. Review authentication and authorization, remove any production bypass, and do not deploy until the security checklist in SECURITY has been completed.

REPOSITORY CONTENTS

The repository contains the supplied application archive, this project overview, and security guidance. Extracted source code is not yet present at the repository root.

CONTRIBUTING

Describe the behavior affected by each change. Keep credentials and personal information out of commits. After extracting the source, run the lint and type check commands defined in the application package.

LICENSE

No license is currently specified. All rights remain with their respective owners until a license is added.
