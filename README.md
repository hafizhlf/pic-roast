
**AI Image Roaster**

**Description**
This is a Next.js application that utilizes Google Generative AI's Gemini model to generate humorous roasts based on uploaded images. Users can customize the roast's language and intensity level.

**Features**

-   **Image Upload:** Users can upload images to be roasted.
-   **Language Selection:** Choose from various languages for the roast.
-   **Intensity Control:** Adjust the roast's intensity level.
-   **AI-Powered Roasting:** Generates witty and creative roasts using Gemini's advanced language capabilities.
-   **User-Friendly Interface:** A clean and intuitive user interface.

**Installation**

1.  **Clone the Repository:**
    ```
    git clone https://github.com/your-username/ai-image-roaster.git
    ```
2.  **Install Dependencies:**
    ```
    cd ai-image-roaster
    npm install
    ```
3.  **Set up Environment Variables:** Create a `.env.local` file in the project root and add your Google Generative AI API key:
    ```
    GEMINI_API_KEY=your_api_key
    ```

**Running the Application**

1.  **Start the Development Server:**
    ```
    npm run dev
    ```
2.  **Access the Application:** Open your browser and go to `http://localhost:3000`.

**How to Use**

1.  **Upload an Image:** Click the "Upload Image" button and select an image.
2.  **Choose Language:** Select the desired language for the roast.
3.  **Adjust Intensity:** Use the slider to set the roast intensity.
4.  **Generate Roast:** Click the "Roast This Image" button.

**Additional Notes**

-   **API Key:** Ensure you have a Google Generative AI API key and set it as an environment variable.
-   **Image Format:** The application supports various image formats.
-   **Roast Quality:** The quality of the roasts depends on the image content and the provided prompts.
-   **Error Handling:** The application includes basic error handling and user feedback.

**Contributing** Feel free to contribute to this project by:

-   **Reporting Issues:** If you encounter any bugs or issues, please create an issue on GitHub.
-   **Suggesting Features:** Share your ideas for new features or improvements.
-   **Submitting Pull Requests:** Contribute code changes and fixes.

**License** This project is licensed under the GPL-3.0 License.