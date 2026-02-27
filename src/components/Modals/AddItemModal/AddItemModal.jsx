// src/components/Modals/AddItemModal/AddItemModal.jsx

import { useEffect, useState } from "react";
import { fetchBlsSeries } from "../../../utils/blsApi";
import { resolveSeriesId } from "../../../utils/blsSeriesMap";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./AddItemModal.css";

function AddItemModal({ isOpen, onClose, onSubmit, store }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("Essential");
  const [unit, setUnit] = useState("each");

  // toggle button for lookup form
  const [isLookupOpen, setIsLookupOpen] = useState(false);

  // fields for lookup form (UI only for now)
  const [lookupQuery, setLookupQuery] = useState("");

  /* ---MAYBE LATER for geo-based lookup?--- */
  // ----const [lookupZip, setLookupZip] = useState("");

  const [lookupStatus, setLookupStatus] = useState("idle"); // idle | loading | error | done
  const [lookupError, setLookupError] = useState("");
  const [lookupResult, setLookupResult] = useState(null); // { label, price, meta... }

  /* ---USEEFFECTS START--- */
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

    /* ---MAYBE LATER for geo-based lookup?--- */
    // ---setLookupZip("");

    setLookupStatus("idle");
    setLookupError("");
    setLookupResult(null);
    setUnit("each"); // here?
  }, [isOpen]);

  useEffect(() => {
    if (!isLookupOpen) return;
    setLookupStatus("idle");
    setLookupError("");
    setLookupResult(null);
    setUnit("each"); // here?
  }, [isLookupOpen]);
  /* ---USEEFFECTS END--- */

  /* ---Handlers for lookup form (API integration later)--- */
  const handleLookupSearch = async () => {
    const resolved = resolveSeriesId(lookupQuery);

    if (!resolved) {
      setLookupStatus("error");
      setLookupError(
        "No match yet. Try: banana, milk (we’ll add more items soon).",
      );
      setLookupResult(null);
      return;
    }

    try {
      setLookupStatus("loading");
      setLookupError("");
      setLookupResult(null);

      const latest = await fetchBlsSeries(resolved.seriesId);
      if (!latest || Number.isNaN(latest.value)) {
        throw new Error("No data returned for that item.");
      }

      setLookupResult({
        matchedKey: resolved.key,
        seriesId: latest.seriesId || resolved.seriesId,
        price: latest.value,
        unit: resolved.unit || "each",
        periodName: latest.periodName,
        year: latest.year,
      });

      setLookupStatus("done");
    } catch (e) {
      setLookupStatus("error");
      setLookupError(e?.message || "Lookup failed");
      setLookupResult(null);
    }
  };

  const formatPriceForInput = (n) => {
    const num = Number(n);
    if (Number.isNaN(num)) return "";
    return num.toFixed(2); // normal 2 decimal spots for dollars
  };

  const handleUseLookupPrice = () => {
    if (!lookupResult) return;

    // set the name based on what matched (or keep user’s typed name)
    setName((prev) => (prev.trim() ? prev : lookupResult.matchedKey));

    // set price input from lookup
    setPrice(formatPriceForInput(lookupResult.price));
    setUnit(lookupResult.unit || "each");

    // Auto-pick a category based on matched item
    const suggestedCategory =
      lookupResult.matchedKey === "milk" || lookupResult.matchedKey === "eggs"
        ? "Dairy"
        : lookupResult.matchedKey === "chicken"
          ? "Meat"
          : "Pantry";
    setCategory((prev) => (prev ? prev : suggestedCategory));

    setIsLookupOpen(false);

    // clear status/result so next open feels fresh
    setLookupStatus("idle");
    setLookupError("");
    setLookupResult(null);
    setLookupQuery("");

    /* ---MAYBE LATER for geo-based lookup?--- */
    // ---setLookupZip("");
  };
  /* ---END Lookup Handlers--- */

  const handleSubmit = (e) => {
    e.preventDefault();

    const parsedPrice = Number(price);
    if (!name.trim() || Number.isNaN(parsedPrice)) return;

    onSubmit({
      item: name.trim(),
      price: parsedPrice,
      unit: unit?.trim() || "each",
      category: category.trim() || "Pantry",
      priority: priority || "Essential",
    });
  };

  return (
    <ModalWithForm
      title="Add Item"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <label className="addmodal__label">
        Item Name
        <input
          className="addmodal__input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., milk"
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
          placeholder="e.g., 4.10"
          required
        />
      </label>

      <label className="addmodal__label">
        Unit
        <select
          className="addmodal__input"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        >
          <option value="each">each</option>
          <option value="per lb">per lb</option>
          <option value="per oz">per oz</option>
          <option value="per gal">per gal</option>
          <option value="per qt">per qt</option>
          <option value="per dozen">per dozen</option>
        </select>
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
        className="btn btn--outline addmodal__secondary"
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
              placeholder="e.g., milk, banana, eggs, rice"
            />
          </label>

          {/* --ZIP CODE FIELD (optional for later geo-based lookup): */}
          {/* <label className="addmodal__label">
            ZIP Code
            <input
              className="addmodal__input"
              value={lookupZip}
              onChange={(e) => setLookupZip(e.target.value)}
              placeholder="optional"
            />
          </label> */}

          {/* LOOkUP FORM with API integration: */}
          <div className="addmodal__lookup-actions">
            <button
              type="button"
              className="btn btn--outline btn--sm addmodal__lookup-btn"
              onClick={handleLookupSearch}
              disabled={!lookupQuery.trim() || lookupStatus === "loading"}
            >
              {lookupStatus === "loading" ? "Searching..." : "Search"}
            </button>

            {/* USE PRICE FROM LOOKUP BUTTON */}
            <button
              type="button"
              className="btn btn--primary btn--sm addmodal__lookup-btn addmodal__lookup-btn_use-price"
              onClick={handleUseLookupPrice}
              disabled={!lookupResult}
            >
              Use Price
            </button>
          </div>

          {/* LOOKUP RESULTS: */}
          <div className="addmodal__lookup-results">
            {lookupStatus === "error" && (
              <p className="addmodal__error">{lookupError}</p>
            )}

            {lookupStatus === "idle" && (
              <p className="addmodal__hint">
                Try: <strong>banana</strong>, <strong>milk</strong>,{" "}
                <strong>eggs</strong>, <strong>rice</strong>. (More items soon.)
              </p>
            )}

            {lookupResult && (
              <div className="addmodal__resultCard">
                <p className="addmodal__resultTitle">
                  Match: <strong>{lookupResult.matchedKey}</strong>
                </p>
                <p>
                  Avg price:{" "}
                  <strong>
                    ${lookupResult.price.toFixed(2)}{" "}
                    {lookupResult.unit ? `(${lookupResult.unit})` : ""}
                  </strong>
                </p>
                <p className="addmodal__resultMeta">
                  Source: BLS Average Price ({lookupResult.periodName}{" "}
                  {lookupResult.year})
                </p>
              </div>
            )}
          </div>
          {/* END Lookup Form */}
        </div>
      )}

      <button className="btn btn--primary addmodal__submit" type="submit">
        {" "}
        {/* ** */}
        Submit
      </button>
    </ModalWithForm>
  );
}

export default AddItemModal;
