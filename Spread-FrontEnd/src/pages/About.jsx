import React from "react";

const About = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <h1 className="text-4xl font-bold mb-6">About Spread</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-lg">
          At Spread, our mission is to create a platform where people can read
          and write inspiring stories, share their experiences, and connect
          through meaningful content. We believe in the power of storytelling to
          inspire, educate, and bring people together.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
        <p className="text-lg">
          Spread is a solo project, developed with passion and dedication. I am
          committed to building a vibrant community and providing a wide range
          of content that resonates with readers and contributors.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
        <p className="text-lg mb-2">
          <strong>Inspiring Stories:</strong> Discover a collection of inspiring
          stories from individuals around the world. From personal triumphs to
          motivational journeys, our platform is a space for sharing and
          celebrating the human spirit.
        </p>
        <p className="text-lg mb-2">
          <strong>Blog Posts:</strong> Read and write blog posts on various
          topics, including technology, lifestyle, health, and sustainability.
          Our goal is to provide a platform for voices that inspire change and
          spark conversations.
        </p>
        <p className="text-lg mb-2">
          <strong>Community Engagement:</strong> I aim to foster a supportive
          community where readers and writers can engage, share feedback, and
          build connections. Your voice matters, and Spread is here to amplify
          it.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Why Choose Spread</h2>
        <p className="text-lg mb-2">
          <strong>Quality Content:</strong> I am committed to curating
          high-quality, inspiring stories and blog posts that provide value and
          insight.
        </p>
        <p className="text-lg mb-2">
          <strong>Diverse Topics:</strong> Spread covers a broad spectrum of
          topics, ensuring there's always something new and interesting for you
          to explore.
        </p>
        <p className="text-lg mb-2">
          <strong>Community Focused:</strong> I believe in the power of
          community and strive to create an inclusive space where everyone can
          share their stories and connect with others.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
        <p className="text-lg">
          I invite you to become a part of our growing community of readers and
          writers. Follow us on social media, subscribe to our newsletter, and
          share your stories on Spread. Together, we can create a platform that
          inspires and uplifts.
        </p>
        <div className="flex space-x-4 mt-4">
          {/* <a
            href="https://instagram.com/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Instagram
          </a>
          <a
            href="https://facebook.com/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Facebook
          </a>
          <a
            href="https://twitter.com/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Twitter
          </a> */}
          <a
            href="https://www.linkedin.com/in/mayur-wagh-751b8a24b"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            LinkedIn
          </a>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="text-lg">
          I'd love to hear from you! If you have any questions, feedback, or
          suggestions, feel free to reach out at{" "}
          <a
            href="mailto:youremail@example.com"
            className="text-blue-500 underline"
          >
            youremail@example.com
          </a>
          .
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Current Status</h2>
        <p className="text-lg">
          Spread is currently functional, allowing users to write and read
          stories and blogs. However, it is still in development, and more
          functionalities will be added. Stay tuned for updates as we continue
          to improve and expand our platform.
        </p>
      </section>
    </div>
  );
};

export default About;
