// src/components/Modals/PriceLookupModal/PriceLookupModal.jsx

import { useEffect, useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { fetchBlsSeries } from "../../../utils/blsApi";
import { resolveSeriesId } from "../../../utils/blsSeriesMap";
import "./PriceLookupModal.css";

function PriceLookupModal({ isOpen, onClose, onUsePrice }) {
  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupStatus, setLookupStatus] = useState("idle"); // idle | loading | error | done
  const [lookupError, setLookupError] = useState("");
  const [lookupResult, setLookupResult] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    // reset each open
    setLookupQuery("");
    setLookupStatus("idle");
    setLookupError("");
    setLookupResult(null);
  }, [isOpen]);

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

  const handleUse = () => {
    if (!lookupResult) return;
    onUsePrice?.(lookupResult); // ** send result to AddItemModal
    onClose();
  };

  return (
    <ModalWithForm title="Price Lookup" isOpen={isOpen} onClose={onClose}>
      <label className="lookupmodal__label">
        Search Item
        <input
          className="lookupmodal__input"
          value={lookupQuery}
          onChange={(e) => setLookupQuery(e.target.value)}
          placeholder="e.g., milk, banana, eggs, rice"
        />
      </label>

      <div className="lookupmodal__actions">
        <button
          type="button"
          className="btn btn--outline btn--sm"
          onClick={handleLookupSearch}
          disabled={!lookupQuery.trim() || lookupStatus === "loading"}
        >
          {lookupStatus === "loading" ? "Searching..." : "Search"}
        </button>

        <button
          type="button"
          className="btn btn--primary btn--sm"
          onClick={handleUse}
          disabled={!lookupResult}
        >
          Use Price
        </button>
      </div>

      <div className="lookupmodal__results">
        {lookupStatus === "error" && (
          <p className="lookupmodal__error">{lookupError}</p>
        )}

        {lookupStatus === "idle" && (
          <p className="lookupmodal__hint">
            Try: <strong>banana</strong>, <strong>milk</strong>,{" "}
            <strong>eggs</strong>, <strong>rice</strong>. (More items soon.)
          </p>
        )}

        {lookupResult && (
          <div className="lookupmodal__card">
            <p className="lookupmodal__title">
              Match: <strong>{lookupResult.matchedKey}</strong>
            </p>
            <p>
              Avg price:{" "}
              <strong>
                ${lookupResult.price.toFixed(2)}{" "}
                {lookupResult.unit ? `(${lookupResult.unit})` : ""}
              </strong>
            </p>
            <p className="lookupmodal__meta">
              Source: BLS Average Price ({lookupResult.periodName}{" "}
              {lookupResult.year})
            </p>
          </div>
        )}
      </div>
    </ModalWithForm>
  );
}

export default PriceLookupModal;
