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

    // Helper functions
    const formatStars = (count) => {
        return count >= 1000 ? (count / 1000).toFixed(1) + 'k' : count;
    };

    const calculateMaintenanceScore = (commitsPastYear, closedIssues, totalIssues) => {
        const commitScore = commitsPastYear / 52;
        const issueScore = totalIssues > 0 ? closedIssues / totalIssues : 0;
        return Math.round((commitScore * 0.5 + issueScore * 0.5) * 100);
    };

    const fetchGitHubData = async (user, repo, link) => {
        const headers = {
            "User-Agent": "Mozilla/5.0",
            "Authorization": `token ${token}`
        };

        try {
            // Fetch basic repository data
            const repoResponse = await makeRequest(`${baseUrl}/${user}/${repo}`, headers);
            const repoData = JSON.parse(repoResponse.responseText);
            const stars = formatStars(repoData.stargazers_count);

            // Fetch commit activity data
            const commitResponse = await makeRequest(`${baseUrl}/${user}/${repo}/stats/commit_activity`, headers);
            const commitData = JSON.parse(commitResponse.responseText);
            const commitsPastYear = Array.isArray(commitData) 
                ? commitData.filter(week => week.total !== 0).length 
                : 0;

            // Fetch issues data
            const issuesResponse = await makeRequest(`${baseUrl}/${user}/${repo}/issues?state=all`, headers);
            const issueData = JSON.parse(issuesResponse.responseText);
            const closedIssues = issueData.filter(issue => issue.state === 'closed').length;
            const totalIssues = issueData.length;

            const maintenanceScore = calculateMaintenanceScore(commitsPastYear, closedIssues, totalIssues);
            link.append(` ⭐ ${stars} | 🔄: ${maintenanceScore}%`);
        } catch (error) {
            console.error(`Failed to fetch data for ${user}/${repo}:`, error);
        }
    };

    // Promise wrapper for GM_xmlhttpRequest
    const makeRequest = (url, headers) => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url,
                headers,
                onload: resolve,
                onerror: reject
            });
        });
    };

    // Main execution
    $('a[href^="https://github.com/"]').each(function() {
        const href = $(this).attr('href');
        const [user, repo] = href.replace('https://github.com/', '').split('/');
        
        if (user && repo) {
            fetchGitHubData(user, repo, $(this));
        }
    });
})();
