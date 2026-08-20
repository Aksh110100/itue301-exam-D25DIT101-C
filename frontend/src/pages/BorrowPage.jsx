import { useEffect, useState } from "react";

function BorrowPage() {
  const [formData, setFormData] = useState({
    memberName: "",
    bookTitle: "",
    borrowDate: "",
    returnDate: "",
  });
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBorrowings() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/mongo/borrowings",
        );

        if (!response.ok) {
          throw new Error("Unable to load borrowings");
        }

        setBorrowings(await response.json());
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    loadBorrowings();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/mongo/borrowings/from-form",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to save borrowing");
      }

      const borrowingsResponse = await fetch(
        "http://localhost:5000/api/v1/mongo/borrowings",
      );
      setBorrowings(await borrowingsResponse.json());
      setFormData({
        memberName: "",
        bookTitle: "",
        borrowDate: "",
        returnDate: "",
      });
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <section>
      <h2>Borrow a Book</h2>
      <form className="borrow-form" onSubmit={handleSubmit}>
        <label>
          Member name
          <input
            name="memberName"
            type="text"
            value={formData.memberName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Book title
          <input
            name="bookTitle"
            type="text"
            value={formData.bookTitle}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Borrow date
          <input
            name="borrowDate"
            type="date"
            value={formData.borrowDate}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Return date
          <input
            name="returnDate"
            type="date"
            value={formData.returnDate}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Save Borrowing</button>
      </form>
      {formData.memberName && (
        <p className="form-preview">
          Borrower: <strong>{formData.memberName}</strong>
        </p>
      )}
      <h3>Saved Borrowings</h3>
      {loading && <p>Loading borrowings...</p>}
      {error && <p role="alert">Error: {error}</p>}
      {!loading && !error && borrowings.length === 0 && (
        <p>No MongoDB borrowing records found.</p>
      )}
      {!loading && !error && borrowings.length > 0 && (
        <div className="borrowing-list">
          {borrowings.map((borrowing) => (
            <article className="borrowing-record" key={borrowing._id}>
              <p>
                <strong>Member:</strong> {borrowing.memberId?.name || "Unknown"}
              </p>
              <p>
                <strong>Book:</strong> {borrowing.bookId?.title || "Unknown"}
              </p>
              <p>
                <strong>Status:</strong> {borrowing.status}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default BorrowPage;
