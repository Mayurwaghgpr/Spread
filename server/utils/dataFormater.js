// Helper function to format post data
const formatPostData = (posts) => {
    return posts.map((post) => ({
        ...post,
        user: { ...post.User }
    }));
};




export default formatPostData