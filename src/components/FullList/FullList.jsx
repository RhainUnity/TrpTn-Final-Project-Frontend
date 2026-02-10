// src/components/FullList/FullList.jsx

import { useMemo, useState } from "react";
import "./FullList.css";
import AddItemModal from "../Modals/AddItemModal/AddItemModal";

const STORE_TABS = ["WinCo", "Safeway", "Albertson’s"];

function FullList({ items = [], setItems }) {
  const [activeStore, setActiveStore] = useState("Safeway");
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Stage 1
  const [editingId, setEditingId] = useState(null);

  // use later to disable Save button if no changes
  // const editingRow = useMemo(
  //   () => items.find((r) => r.id === editingId),
  //   [items, editingId],
  // );

  const handleAddItem = ({ item, price, category, priority }) => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        item,
        category,
        priority,
        price,
        qty: 0,
        hidden: false,
      },
    ]);
    setIsAddOpen(false);
  };

  const handleChange = (id, patch) => {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const handleSave = () => {
    // Later: persist to backend / state store
    setEditingId(null);
  };

  const handleCancel = () => {
    // Later: revert changes (for now just stop editing)
    setEditingId(null);
  };

// Store Tabs
  return (
    <section className="full">
      <div className="full__tabs-wrap">
        <div className="full__tabs">
          {STORE_TABS.map((store) => (
            <button
              key={store}
              type="button"
              className={`full__tab ${activeStore === store ? "full__tab_active" : ""}`}
              onClick={() => setActiveStore(store)}
            >
              {store}
            </button>
          ))}
        </div>

        {/* Add Item button */}
        <div className="full__additem-wrap">
          <button
            className="full__additem-btn"
            type="button"
            onClick={() => setIsAddOpen(true)}
          >
            Add Item
          </button>
        </div>
      </div>

      {/* Items Header */}
      <div className="full__panel">
        <div className="full__header-row">
          <div className="full__col full__col_item">Item</div>
          <div className="full__col full__col_category">Category</div>
          <div className="full__col full__col_priority">Priority</div>
          <div className="full__col full__col_price">Price</div>
        </div>

        {/* Items Info */}
        <div className="full__body">
          {items.map((row) => {
            const isEditing = row.id === editingId;

            return (
              <div key={row.id} className="full__row">
                <div className="full__cell full__col_item">
                  {isEditing ? (
                    <input
                      className="full__input"
                      value={row.item}
                      onChange={(e) =>
                        handleChange(row.id, { item: e.target.value })
                      }
                    />
                  ) : (
                    <span>{row.item}</span>
                  )}
                </div>

                {/* Category */}
                <div className="full__cell full__col_category">
                  {isEditing ? (
                    <select
                      className="full__select"
                      value={row.category}
                      onChange={(e) =>
                        handleChange(row.id, { category: e.target.value })
                      }
                    >
                      <option value="Pantry">Pantry</option>
                      <option value="Dairy">Dairy</option>
                      <option value="Meat">Meat</option>
                    </select>
                  ) : (
                    <span>{row.category}</span>
                  )}
                </div>

                {/* Priority */}
                <div className="full__cell full__col_priority">
                  {isEditing ? (
                    <select
                      className="full__select"
                      value={row.priority}
                      onChange={(e) =>
                        handleChange(row.id, { priority: e.target.value })
                      }
                    >
                      <option value="Essential">Essential</option>
                      <option value="Surplus">Surplus</option>
                      <option value="Optional">Optional</option>
                    </select>
                  ) : (
                    <span>{row.priority}</span>
                  )}
                </div>

                
                {/* Price */}
                <div className="full__cell full__col_price">
                  {isEditing ? (
                    <input
                      className="full__input full__input_price"
                      type="number"
                      step="0.01"
                      value={row.price}
                      onChange={(e) =>
                        handleChange(row.id, { price: Number(e.target.value) })
                      }
                    />
                  ) : (
                    <span>${row.price.toFixed(2)}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="full__cell full__col_action">
                  <label className="full__hide">
                    <input
                      className="full__hide-input"
                      type="checkbox"
                      checked={!!row.hidden}
                      onChange={(e) =>
                        handleChange(row.id, { hidden: e.target.checked })
                      }
                    />
                    <span className="full__hide-text">Hide</span>
                  </label>

                  {isEditing ? (
                    <div className="full__actions">
                      <button
                        className="full__btn"
                        type="button"
                        onClick={handleSave}
                      >
                        Save
                      </button>
                      <button
                        className="full__btn"
                        type="button"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="full__btn"
                      type="button"
                      onClick={() => setEditingId(row.id)}
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="full__spacer" />
      </div>
      <AddItemModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddItem}
        store={activeStore}
      />
    </section>
  );
}

export default FullList;
