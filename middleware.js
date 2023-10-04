const { default: axios } = require("axios");

const getDataMiddleware = async (req, res, next) => {
    try {
        const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
            headers: {
                'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
            },
        });
        req.blogs = response.data.blogs;
        next();
    } catch (error) { // Fixed: changed err to error
        console.log(error); // Fixed: changed err to error
        res.status(500).send({ message: error.message }); // Send error message in response
    }
};

module.exports = getDataMiddleware;
