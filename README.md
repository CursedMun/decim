# Decim - Password Manager

Decim is a password manager that helps you securely store and manage your passwords, notes, and host information. It utilizes SQLite to store data locally, ensuring your sensitive information remains encrypted using your own personal key.

## Features

- Password Management: Safely store and manage your passwords.
- Secure Notes: Keep your personal notes encrypted and organized.
- Hosts Management: Store host information securely for easy access.
- Local Storage: All data is stored locally using SQLite for enhanced security.
- Encryption: Your passwords and sensitive information are encrypted with your unique key.

## Disclaimer

**Decim is currently in active development, and there might be bugs and incomplete features.** Use it with caution and consider it a work-in-progress. We appreciate your understanding and patience as we work to improve and stabilize the app.

## Contributing

Decim is a pet project, and we welcome contributions from the community. If you're interested in contributing, feel free to:

- Report issues: If you come across any bugs or have suggestions, please open an issue in the repository.
- Submit pull requests: If you're a developer, you can help by submitting pull requests with bug fixes, improvements, or new features.

## Technologies Used

- TypeScript (ts)
- Tauri (https://tauri.studio/): A framework for building lightweight, fast, and secure desktop applications using web technologies.
- Next.js (https://nextjs.org/): A React framework for building server-rendered applications.
- Tailwind CSS (https://tailwindcss.com/): A utility-first CSS framework for rapid UI development.
- Tauri SQL API: Utilized to interact with SQLite for local data storage.

## Getting Started

1. Go to the latest releases: [Decim Releases](https://github.com/CursedMun/decim/releases)
2. Download the appropriate version for your operating system.
3. Install Decim on your system.
4. Configure Encryption Key: Once installed, you'll need to set up your encryption key. Locate the configuration file at `appdata/com.decim.app/config.decim`. Open it with any text editor and add your encryption key.
5. Initial Login: The default password to log in is `admin`.
6. Refresh the App: After adding your encryption key and logging in, you may need to refresh the app. Use `Ctrl+R` (Windows/Linux) or `Cmd+R` (Mac) to refresh.

## Current Tasks

### 1. Auto Update

We're working on implementing an auto-update feature for Decim. This will ensure that you always have the latest version of the application without the need for manual updates. Stay tuned for this convenient feature!

### 2. Login Bug Fix

We are actively addressing the login bug that currently requires a manual refresh after logging in. Our goal is to provide a smooth and seamless login experience for users, eliminating the need for additional steps.

### 3. Improved Configuration

We understand that the current configuration process might feel a bit hacky. We're committed to enhancing this aspect of the app. Our upcoming update will make the configuration process more user-friendly, and we're also working on allowing users to input their configuration details during the initial setup.

We appreciate your patience as we work on these improvements to enhance your experience with Decim. Your feedback and suggestions are valuable to us, so please feel free to contribute your ideas or report any issues on the [GitHub repository](https://github.com/CursedMun/decim/issues).

---

**Note:** The completion of these tasks will enhance the usability and functionality of Decim. Keep an eye on the [Decim Releases](https://github.com/CursedMun/decim/releases) page for updates and new features.

## License

This project is licensed under the [MIT License](LICENSE).
