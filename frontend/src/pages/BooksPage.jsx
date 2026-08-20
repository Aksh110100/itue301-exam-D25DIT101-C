import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";

function BooksPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBooks() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/mongo/books",
        );

        if (!response.ok) {
          throw new Error("Unable to load books");
        }

        const books = await response.json();
        setData(books);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, []);

  return (
    <section>
      <h2>Books</h2>
      {loading && <p>Loading books...</p>}
      {error && <p role="alert">Error: {error}</p>}
      {!loading && !error && (
        <div className="book-list">
          {data.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>
      )}
    </section>
  );
}

export default BooksPage;
