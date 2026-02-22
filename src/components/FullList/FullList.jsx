// src/components/FullList/FullList.jsx

import { useState } from "react";
import "./FullList.css";
import AddItemModal from "../Modals/AddItemModal/AddItemModal";
import ConfirmDeleteModal from "../Modals/ConfirmDeleteModal/ConfirmDeleteModal";

// ----DELETE THIS >>const STORE_TABS = ["WinCo", "Safeway", "Albertson’s"];

function FullList({
  items = [],
  setItems,
  activeStore,
  setActiveStore,
  stores,
}) {
  // ----DELETE THIS >>const [activeStore, setActiveStore] = useState("Safeway");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  // Stage 1
  const [editingId, setEditingId] = useState(null);

  const handleAddItem = ({ item, price, unit, category, priority }) => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        item,
        category,
        priority,
        price,
        unit,
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

  const requestDelete = (row) => {
    setDeleteItem(row); // open modal
  };

  const closeDeleteModal = () => setDeleteItem(null);

  const confirmDelete = () => {
    if (!deleteItem) return;

    const id = deleteItem.id;
    setItems((prev) => prev.filter((r) => r.id !== id));

    // if you delete the row you’re editing, exit edit mode
    if (editingId === id) setEditingId(null);

    setDeleteItem(null);
  };

  // Store Tabs
  return (
    <section className="full">
      <div className="full__tabs-wrap">
        <div className="full__tabs">
          {stores.map((store) => (
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
                {/* Top item/specs grid */}
                <div className="full__row-main">
                  {/* Item name */}
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
                      <div className="full__price-edit">
                        <input
                          className="full__input full__input_price"
                          type="number"
                          step="0.01"
                          value={row.price ?? 0}
                          onChange={(e) =>
                            handleChange(row.id, {
                              price: Number(e.target.value),
                            })
                          }
                        />
                        <span className="full__slash">/</span>
                        <select
                          className="full__select full__select_unit"
                          value={row.unit ?? "each"}
                          onChange={(e) =>
                            handleChange(row.id, { unit: e.target.value })
                          }
                        >
                          <option value="each">each</option>
                          <option value="lb">lb</option>
                          <option value="oz">oz</option>
                          <option value="g">g</option>
                          <option value="kg">kg</option>
                          <option value="dozen">dozen</option>
                          <option value="qt">qt</option>
                          <option value="gallon">gallon</option>
                          <option value="bag">bag</option>
                          <option value="box">box</option>
                        </select>
                      </div>
                    ) : (
                      <span className="full__price-text">
                        ${Number(row.price ?? 0).toFixed(2)}
                        {typeof row.unit === "string" && row.unit.trim()
                          ? ` / ${row.unit.trim()}`
                          : ""}
                      </span>
                    )}
                  </div>
                </div>

                {/* BOTTOM: actions bar */}
                <div className="full__row-actions">
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
                        className="full__btn full__btn_danger"
                        type="button"
                        onClick={() => requestDelete(row)}
                      >
                        Delete
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

      <ConfirmDeleteModal
        isOpen={!!deleteItem}
        itemName={deleteItem?.item}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </section>
  );
}

export default FullList;
