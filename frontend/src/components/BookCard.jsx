function BookCard({ title, author, category, available }) {
  return (
    <article className="book-card">
      <h3>{title}</h3>
      <p>
        <strong>Author:</strong> {author}
      </p>
      <p>
        <strong>Category:</strong> {category}
      </p>
      <p
        className={
          available ? "availability available" : "availability unavailable"
        }
      >
        {available ? "Available" : "Not Available"}
      </p>
    </article>
  );
}

export default BookCard;
