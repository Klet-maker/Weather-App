# **App Name**: Global Weather Hub

## Core Features:

- Real-Time Weather Display: Display real-time weather data (temperature, humidity, wind speed, and sky condition) fetched from OpenWeatherMap API.
- Interactive Search Bar: An input field that offers city suggestions as the user types and allows users to search by city.
- Local Time & Day/Night Indicator: Show the local time and indicate whether it is day or night in the selected city.
- Language Selector: Enable users to switch the application's language between Spanish, English, French, Italian, Ukrainian, and German, adapting all text accordingly using i18next.
- Theme Selection: Allow users to switch between light, dark, and automatic themes (automatic theme switches based on the day/night cycle of the city).
- AI-Powered Weather Alert Tool: An AI-powered tool that, if severe weather is detected for the current city, will generate a short blurb alerting the user, recommending appropriate measures based on the type of weather event (e.g., "A severe storm is approaching; seek shelter immediately").

## Style Guidelines:

- Primary color: Sky Blue (#87CEEB) to evoke a sense of calm and openness, relating to the sky.
- Background color: Light Gray (#F0F8FF), a desaturated version of Sky Blue, for a clean and unobtrusive backdrop in light mode.
- Accent color: Orange-Yellow (#FFB347), an analogous color providing a warm contrast for interactive elements.
- Font: 'Inter' (sans-serif) for both headlines and body text, offering a modern and neutral look that ensures readability and suits both titles and longer content blocks.
- Utilize weather-related icons from 'lucide-react' to visually represent weather conditions.
- Implement subtle transitions and animations using Framer Motion to enhance user experience during data updates and theme changes.
- Responsive design that adapts fluidly to different screen sizes, providing an optimal viewing experience across devices.