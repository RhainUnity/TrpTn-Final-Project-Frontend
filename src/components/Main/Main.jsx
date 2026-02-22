// src/components/Main/Main.jsx
import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Main.css";

function Main({
  items = [],
  setItems,
  activeStore,
  setActiveStore,
  stores = [],
}) {
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");

  // When switching stores, reset filters
  useEffect(() => {
    setFilterCategory("All");
    setFilterPriority("All");
  }, [activeStore]);

  const total = useMemo(
    () =>
      items.reduce((sum, item) => sum + (item.price ?? 0) * (item.qty ?? 0), 0),
    [items],
  );

  const handleInc = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: (item.qty ?? 0) + 1 } : item,
      ),
    );
  };

  const handleDec = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(0, (item.qty ?? 0) - 1) }
          : item,
      ),
    );
  };

  // item variables to be implemented from backend later

  const visibleItems = items.filter((i) => !i.hidden);

  const matchesCategory = (i) =>
    filterCategory === "All" ||
    filterCategory === "" ||
    i.category === filterCategory;

  const matchesPriority = (i) =>
    filterPriority === "All" ||
    filterPriority === "" ||
    i.priority === filterPriority;

  const filteredItems = visibleItems.filter(
    (i) => matchesCategory(i) && matchesPriority(i),
  );

  const getUnitLabel = (unit) => {
    if (typeof unit === "string") return unit.trim() || "each";
    return "each";
  };

  return (
    <section className="main">
      <div className="main__panel">
        {/* ---NEW FEATURE: Store Tabs--- */}
        <div className="main__stores">
          {stores.map((store) => (
            <button
              key={store}
              type="button"
              className={`main__store-tab ${
                activeStore === store ? "main__store-tab_active" : ""
              }`}
              onClick={() => setActiveStore(store)}
              aria-pressed={activeStore === store}
            >
              {store}
            </button>
          ))}
        </div>
        <div className="main__top">
          <div className="main__filters">
            {/* Filter Category */}
            <label className="main__field">
              <span className="main__label">Filter category:</span>
              <select
                className="main__select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Pantry">Pantry</option>
                <option value="Dairy">Dairy</option>
                <option value="Meat">Meat</option>
              </select>
            </label>

            {/* Filter Prioroty */}
            <label className="main__field">
              <span className="main__label">Filter priority:</span>
              <select
                className="main__select"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Essential">Essential</option>
                <option value="Surplus">Surplus</option>
                <option value="Optional">Optional</option>
              </select>
            </label>
          </div>

          {/* Edit Actions */}
          <div className="main__actions">
            <Link
              className="main__action-btn main__action-link"
              to="/full-list"
            >
              Open Full List
            </Link>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <p className="main__empty">No items match your filters.</p>
        ) : (
          <div className="main__list">
            {filteredItems.map((row) => (
              <div key={row.id} className="main__row">
                <div className="main__row-left">
                  <span className="main__item-name">{row.item}</span>
                  <span className="main__unit">{getUnitLabel(row.unit)}</span>
                </div>

                <div className="main__row-right">
                  <span className="main__badge main__badge--priority">
                    {row.priority}
                  </span>
                  <span className="main__badge main__badge--category">
                    {row.category}
                  </span>

                  <div
                    className="main__qty-wrap"
                    aria-label="Quantity controls"
                  >
                    <button
                      className="main__qty-btn"
                      type="button"
                      onClick={() => handleDec(row.id)}
                      aria-label={`Decrease quantity of ${row.item}`}
                    >
                      –
                    </button>

                    <span
                      className="main__qty"
                      aria-label={`Quantity ${row.qty ?? 0}`}
                    >
                      {row.qty ?? 0}
                    </span>

                    <button
                      className="main__qty-btn"
                      type="button"
                      onClick={() => handleInc(row.id)}
                      aria-label={`Increase quantity of ${row.item}`}
                    >
                      +
                    </button>
                  </div>

                  <span className="main__price">
                    ${((row.price ?? 0) * (row.qty ?? 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="main__totalline">
          Cart total ({activeStore}): ${total.toFixed(2)}
        </p>
      </div>
    </section>
  );
}

export default Main;
