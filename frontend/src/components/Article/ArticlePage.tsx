import axios from "axios";
import { useEffect, useState } from "react";
import { NewsArticle, searchNews } from "../../services/bing-news-service";
import "./ArticlePage.css";

function ArticlePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const response = await searchNews("latest tech news"); // Pass a query string here
        setArticles(response.value); // Use response.value to set articles
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError("Couldn't fetch articles");
        } else {
          setError("Error fetching articles");
        }
        console.error("Error fetching articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  function handlePostClick(url: string): void {
    window.open(url, "_blank");
  }

  return (
    <div className="news-page">
      <h1>All news</h1>
      {isLoading ? (
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
              onClick={() => handlePostClick(article.url)}
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
    </div>
  );
}

export default ArticlePage;
