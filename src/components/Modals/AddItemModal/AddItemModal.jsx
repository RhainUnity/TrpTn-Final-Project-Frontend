// src/components/Modals/AddItemModal/AddItemModal.jsx

import { useEffect, useState } from "react";
import "./AddItemModal.css";

function AddItemModal({ isOpen, onClose, onSubmit, store }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("Essential");

  // toggle button for lookup form
  const [isLookupOpen, setIsLookupOpen] = useState(false);

  // fields for lookup form (UI only for now)
  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupZip, setLookupZip] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    // reset each time it opens
    setName("");
    setPrice("");
    setCategory("");
    setPriority("Essential");
    //  reset lookup form too
    setIsLookupOpen(false);
    setLookupQuery("");
    //  setLookupStore("Safeway");
    setLookupZip("");
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const parsedPrice = Number(price);
    if (!name.trim() || Number.isNaN(parsedPrice)) return;

    onSubmit({
      item: name.trim(),
      price: parsedPrice,
      category: category.trim() || "Surplus",
      priority: priority || "Essential",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="addmodal" onMouseDown={onClose} role="presentation">
      <div
        className="addmodal__content"
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Add Item"
      >
        <button
          type="button"
          className="addmodal__close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <form className="addmodal__form" onSubmit={handleSubmit}>
          <label className="addmodal__label">
            Item Name
            <input
              className="addmodal__input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=""
              required
            />
          </label>
          <label className="addmodal__label">
            Item Price
            <input
              className="addmodal__input"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder=""
              required
            />
          </label>

          {/* needs to be dropdown */}
          <label className="addmodal__label">
            Item Priority
            <select
              className="addmodal__input"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Essential">Essential</option>
              <option value="Surplus">Surplus</option>
              <option value="Optional">Optional</option>
            </select>
          </label>
          <label className="addmodal__label">
            Item Category
            <select
              className="addmodal__input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Pantry">Pantry</option>
              <option value="Dairy">Dairy</option>
              <option value="Meat">Meat</option>
            </select>
          </label>

          {/* // /// Lookup form (UI only for now)  */}
          {/* Button to open lookup form */}
          <label className="addmodal__label">
            Store
            <select className="addmodal__input" value={store} disabled>
              <option value="WinCo">WinCo</option>
              <option value="Safeway">Safeway</option>
              <option value="Albertson’s">Albertson’s</option>
            </select>
          </label>
          <button
            type="button"
            className="addmodal__secondary"
            onClick={() => setIsLookupOpen((v) => !v)}
          >
            {isLookupOpen ? "Close Price Lookup" : "Lookup Price (API)"}
          </button>
          {isLookupOpen && (
            <div className="addmodal__lookup">
              <p className="addmodal__lookup-title">Price Lookup</p>

              <label className="addmodal__label">
                Search Item
                <input
                  className="addmodal__input"
                  value={lookupQuery}
                  onChange={(e) => setLookupQuery(e.target.value)}
                  placeholder="e.g., Nissin Chow Mein"
                />
              </label>

              <label className="addmodal__label">
                ZIP Code
                <input
                  className="addmodal__input"
                  value={lookupZip}
                  onChange={(e) => setLookupZip(e.target.value)}
                  placeholder="optional"
                />
              </label>

              <div className="addmodal__lookup-actions">
                <button type="button" className="addmodal__lookup-btn" disabled>
                  Search (coming soon)
                </button>
                <button type="button" className="addmodal__lookup-btn" disabled>
                  Use Selected Price (coming soon)
                </button>
              </div>

              <div className="addmodal__lookup-results">
                <p className="addmodal__hint">
                  Results will appear here (API later).
                </p>
              </div>
            </div>
          )}
          <button className="addmodal__submit" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddItemModal;
