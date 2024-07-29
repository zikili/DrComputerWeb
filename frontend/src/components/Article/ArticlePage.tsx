// components/ArticlePage.tsx
import axios from "axios";
import { useState, useCallback, useEffect } from "react";
import { NewsArticle, searchNews } from "../../services/bing-news-service";
import "./ArticlePage.css";

const RETRY_DELAY = 3000; // Delay in milliseconds (3 seconds)
const MAX_RETRIES = 3;

function ArticlePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Function to fetch articles
  const fetchArticles = useCallback(
    async (retries: number = 0) => {
      if (!hasMore || isLoading) return;

      setIsLoading(true);
      try {
        const response = await searchNews("latest tech news", offset);
        const newArticles = response.value.filter(
          (article) => !articles.some((a) => a.url === article.url)
        );

        if (newArticles.length === 0) {
          setHasMore(false);
        } else {
          setArticles((prev) => [...prev, ...newArticles]);
          setOffset((prev) => prev + 10); // Adjust the offset based on your API response
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 429) {
          if (retries < MAX_RETRIES) {
            // Retry after a delay
            setTimeout(() => fetchArticles(retries + 1), RETRY_DELAY);
          } else {
            setError("Rate limit exceeded. Please try again later.");
          }
        } else {
          if (axios.isAxiosError(error)) {
            setError("Couldn't fetch articles");
          } else {
            setError("Error fetching articles");
          }
          console.error("Error fetching articles:", error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [offset, hasMore, isLoading, articles]
  );

  // Automatically fetch the initial set of articles when component mounts
  useEffect(() => {
    fetchArticles();
  }, []);

  // Handle load more button click
  const handleLoadMore = () => {
    fetchArticles();
  };

  return (
    <div className="news-page">
      <h1>All news</h1>
      {isLoading && articles.length === 0 ? (
        <div className="spinner-border text-primary" />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : articles.length === 0 ? (
        <div className="no-articles">
          <h3>No articles available.</h3>
        </div>
      ) : (
        <div className="articles-list">
          {articles.map((article, index) => (
            <div
              key={index}
              className="article-item"
              onClick={() => window.open(article.url, "_blank")}
            >
              <h2>{article.name}</h2>
              <p>{article.description}</p>
              {article.image?.thumbnail?.contentUrl && (
                <img src={article.image.thumbnail.contentUrl} alt="Article" />
              )}
            </div>
          ))}
        </div>
      )}
      {hasMore && (
        <button
          className="load-more-button"
          onClick={handleLoadMore}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}

export default ArticlePage;
