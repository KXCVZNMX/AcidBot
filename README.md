# AcidBot

A maimai DX (international ver.) bot.

Any issue please raise in the [issues](https://github.com/KXCVZNMX/Acidbot/issues) page

## ✨ Features

### 📊 Best 50 Chart

- Chart Constants
- Achievement and rank
- DX Score
- Derived Rating
- Sync Status (sync, sync+, etc.)
- Play Status (fc, fc+, etc.)

### 𖣠 Skill Radar Map

- Patterns ()
- Chart Types (slider chart, keyboard chart, etc.)

### 🗃️Data Sources

- Songs collected from [arcade-songs](https://arcade-songs.zetaraku.dev/)
- Tags collected from [DXRating.net](https://dxrating.net)

## 🛠️ Technical Stack

### Frontend Framework 

- Next.js was used to provide a full-stack development environment
- Typescript was used to avoid type ambiguity and unsafe code

### Styling and UI

- Tailwind CSS 4.1 was used for an easy-to-use utility CSS framework
- daisyUI was used for semantic components in corporation with Tailwind CSS

### Backend & Database

- MongoDB was used to host all application data due to its simplicity and nice GUI
- RESTful API endpoints was used and built with Next.js

### Development Tools

- Next.js + Turbopack was used to allow fast bundle and build for development servers
- ESLint was used to provide typescript-specific styling and rules
- Prettier was used to standardise styling across different development environment and platforms
- npm was used as for package manager

## 🚀 Local Installation

### Prerequisites

- Node.js v20+
- Next.js v15.5.4+
- npm package manager
- MongoDB cluster

### Installation

1. Clone the repository

    ```zsh
    git clone https://github.com/KXCVZNMX/AcidBot.git
    cd AcidBot
    ```

2. Install dependencies
    
    ```zsh
    npm install
    ```
   
3. Setup Environment Variables

    create a .env file in the root of the project

    ```dotenv
    MONGODB_URI={your_mongo_db_uri}
    ```
4. Start Development Server

    ```zsh
    npm run dev
    ```