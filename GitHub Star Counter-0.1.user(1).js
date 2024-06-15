// ==UserScript==
// @name         GitHub Star Counter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show number of stars next to all links that leads to github projects
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';

    const baseUrl = 'https://api.github.com/repos';
    const token = 'TOKEN_YOUR'; // Replace with your PAT


    $('a[href^="https://github.com/"]').each(function() {
        const href = $(this).attr('href');
        const parts = href.replace('https://github.com/', '').split('/');
        if (parts.length === 2) {
            const user = parts[0];
            const repo = parts[1];
            const link = $(this); // Save the jQuery object to a variable

            // Fetch repository data
            GM_xmlhttpRequest({
                method: "GET",
                url: `${baseUrl}/${user}/${repo}`,
                headers: {
                    "User-Agent": "Mozilla/5.0", // Add a User-Agent header
                    "Authorization": `token ${token}` // Add the Authorization header
                },
                onload: function(response) {
                    const data = JSON.parse(response.responseText);
                    // Format the star count to match GitHub's format
                    let stars = data.stargazers_count;
                    if (stars >= 1000) {
                        stars = (stars / 1000).toFixed(1) + 'k';
                    }
                    // Fetch commit activity data
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: `${baseUrl}/${user}/${repo}/stats/commit_activity`,
                        headers: {
                            "User-Agent": "Mozilla/5.0", // Add a User-Agent header
                            "Authorization": `token ${token}` // Add the Authorization header
                        },
                        onload: function(response) {
                            const commitData = JSON.parse(response.responseText);
                            // Check if commitData is an array
                            let commitsPastYear = 0;
                            if (Array.isArray(commitData)) {
                                // Calculate the number of commits in the past year
                                commitsPastYear = commitData.filter(week => week.total !== 0).length;
                            }
                            // Fetch issue data
                            GM_xmlhttpRequest({
                                method: "GET",
                                url: `${baseUrl}/${user}/${repo}/issues?state=all`,
                                headers: {
                                    "User-Agent": "Mozilla/5.0", // Add a User-Agent header
                                    "Authorization": `token ${token}` // Add the Authorization header
                                },
                                onload: function(response) {
                                    const issueData = JSON.parse(response.responseText);
                                    // Calculate the number of closed vs. open issues
                                    const closedIssues = issueData.filter(issue => issue.state === 'closed').length;
                                    const openIssues = issueData.filter(issue => issue.state === 'open').length;
                                    // Calculate the maintenance score
                                    const maintenanceScore = ((commitsPastYear / 52) * 0.5) + ((closedIssues / (openIssues + closedIssues)) * 0.5);
                                    link.append(` ⭐ ${stars} | 🔄: ${Math.round(maintenanceScore * 100)}%`); // Use the saved jQuery object
                                }
                            });
                        }
                    });
                },
                onerror: function() {
                    console.log('Failed to fetch data for ' + href);
                }
            });
        }
    });
})();
