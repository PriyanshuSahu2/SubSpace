const express = require('express');
const axios = require('axios');
const _ = require('lodash');
const getDataMiddleware = require('./middleware'); // Assuming you have a middleware to fetch blogs
const app = express();
const PORT = 3000;

// Define getDataMiddleware to fetch blogs here or import it

app.get('/api/blog/:id', getDataMiddleware, (req, res) => {
    try {
        const blogs = req.blogs; // Assuming blogs are fetched using getDataMiddleware

        const idToSearch = req.params.id; // Get the id parameter from the URL

        // Search for the blog with the specified id
        const blog = _.find(blogs, { id: idToSearch }); // Assuming 'id' is the property name in your blog objects

        if (blog) {
            // If a blog with the specified id is found, return it
            res.json(blog);
        } else {
            // If no blog with the specified id is found, return a 404 Not Found response
            res.status(404).json({ error: 'Blog not found' });
        }
    } catch (error) {
        console.error('Error searching for blog by id:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/api/blog-stats', getDataMiddleware, async (req, res) => {
    try {
        // Assuming the response data is an array of blog objects
        const blogs = req.blogs;

        const totalBlogs = blogs.length;
        const longestBlog = _.maxBy(blogs, 'title.length');
        const blogsWithPrivacy = _.filter(blogs, (blog) =>
            _.includes(_.toLower(blog.title), 'privacy')
        );

        const uniqueTitles = _.uniqBy(blogs, 'title');

        res.json({
            totalBlogs,
            longestBlog: longestBlog?.title,
            blogsWithPrivacy: blogsWithPrivacy.length,
            uniqueTitles: _.map(uniqueTitles, 'title'),
        });
    } catch (error) {
        console.error('Error fetching blog data:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/blog-search', getDataMiddleware, async (req, res) => {
    try {

        const blogs = req.blogs;

        const query = req.query.query.toLowerCase(); // Convert query to lowercase for case-insensitive search
        const matchingBlogs = _.filter(blogs, (blog) =>
            _.includes(_.toLower(blog.title), query)
        );

        res.json(matchingBlogs);
    } catch (error) {
        console.error('Error fetching blog data for search:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
