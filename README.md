# monkey-stars
monkey-stars is a Tampermonkey script that enhances your browsing experience by providing essential metrics about GitHub repositories directly from your browser. It displays the number of stars a repository has received and calculates a maintenance score based on the number of commits made in the past year and the ratio of closed to open issues.

## Installation

    - Install the Tampermonkey extension for your browser. Tampermonkey is available for Chrome, Microsoft Edge, Safari, Firefox, and other browsers. Links to the extension can be found on the Tampermonkey website.

    - Click the Tampermonkey icon in your browser's toolbar and select "Create a new script..."

    - Copy and paste the GitHub Star Counter script into the editor.

    - Replace 'YOUR_PERSONAL_ACCESS_TOKEN' in the script with your GitHub personal access token. You can generate a token by following the instructions in the GitHub documentation.

    - Click "File" -> "Save" in the Tampermonkey editor to save the script.

    - The script should now be active! When you browse a webpage with GitHub repository links, you should see the star count and maintenance score next to each link.


## Notes

The maintenance score is a calculated score that reflects the maintenance activity of the repository. It is a percentage derived from the number of commits made in the past year and the ratio of closed to open issues. A higher score suggests a more actively maintained repository.

Please note that this script makes multiple API requests for each repository, so it could hit the rate limit quickly if you have many repository links on a page. If you find that you're hitting the rate limit often, you might need to consider other options to increase your rate limit, such as using a GitHub App or a GitHub OAuth App, which have their own separate rate limits.


Please replace the text "GitHub Star Counter script" in step 3 with the actual script or a link to the script. Also, please make sure you have a GitHub personal access token and replace 'YOUR_PERSONAL_ACCESS_TOKEN' with your actual token.
