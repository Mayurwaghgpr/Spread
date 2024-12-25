// Helper function to format post data
const formatPostData = (posts) => {
    return posts.map(({ dataValues: { id, title, subtitelpagraph, titleImage, topic, authorId, createdAt, updatedAt, User ,Likes,comments} }) => ({
        id, title, subtitelpagraph, titleImage, topic, authorId, createdAt, updatedAt,
        Likes,
        comments,
        user: { ...User.dataValues }
    }));
};




export default formatPostData