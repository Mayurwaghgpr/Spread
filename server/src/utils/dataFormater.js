// Helper function to format post data
const formatPostData = (posts) => {
  return posts.map((post) => {
    const newPost = {
      ...post,
      user: { ...post.User },
    };
    delete newPost.User;
    return newPost;
  });
};

export default formatPostData;
